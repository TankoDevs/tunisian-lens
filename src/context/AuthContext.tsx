import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';
import { PHOTO_CATEGORIES, VIDEO_CATEGORIES } from '../data/mockData';
import {
    validatePassword,
    checkLoginAttempts,
    recordFailedAttempt,
    resetLoginAttempts,
} from '../lib/passwordSecurity';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    bio?: string;
    title?: string;
    location?: string;
    role: 'creative' | 'visitor' | 'admin' | 'client';
    country?: string;
    createdAt?: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, role?: 'creative' | 'visitor' | 'admin' | 'client', metadata?: Record<string, unknown>) => Promise<void>;
    logout: () => void;
    switchRole: (newRole: 'creative' | 'visitor' | 'admin' | 'client') => void;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    resetPasswordForEmail: (email: string) => Promise<{ success: boolean; message: string }>;
    updatePassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS_KEY = 'tunisian_lens_mock_users';
const CURRENT_USER_KEY = 'tunisian_lens_current_user';

// Seed demo accounts so they're always available
(function seedDemoAccounts() {
    const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');

    const demos = [
        {
            id: 'admin-1',
            email: 'admin@tunisianlens.com',
            password: 'admin123',
            name: 'Site Admin',
            role: 'admin',
        },
        {
            id: 'demo-client-1',
            email: 'client@tunisianlens.com',
            password: 'client123',
            name: 'Nour Ben Ali',
            role: 'client',
            country: 'TN',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
    ];

    // Dynamically inject a creative account for every category
    PHOTO_CATEGORIES.forEach((cat, i) => {
        demos.push({
            id: `demo-photo-${i}`,
            email: `${cat.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.com`,
            password: 'demo123',
            name: `${cat} Photographer`,
            role: 'creative',
            country: 'TN',
            avatar: `https://randomuser.me/api/portraits/men/${(i % 50) + 1}.jpg`,
        });
    });

    VIDEO_CATEGORIES.forEach((cat, i) => {
        demos.push({
            id: `demo-video-${i}`,
            email: `${cat.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.com`,
            password: 'demo123',
            name: `${cat} Videographer`,
            role: 'creative',
            country: 'TN',
            avatar: `https://randomuser.me/api/portraits/women/${(i % 50) + 1}.jpg`,
        });
    });

    let changed = false;
    for (const demo of demos) {
        if (!mockUsers.some((u: { email: string }) => u.email === demo.email)) {
            mockUsers.push(demo);
            changed = true;
        }
    }

    // Migrate: upgrade any old 'photographer' roles to 'creative'
    for (const u of mockUsers) {
        if ((u as { role: string }).role === 'photographer') {
            (u as { role: string }).role = 'creative';
            changed = true;
        }
    }

    if (changed) localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));

    // Also migrate the currently logged-in user if they have the old role
    const currentRaw = localStorage.getItem(CURRENT_USER_KEY);
    if (currentRaw) {
        try {
            const current = JSON.parse(currentRaw);
            if (current.role === 'photographer') {
                current.role = 'creative';
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
            }
        } catch { /* ignore */ }
    }
})();

// eslint-disable-next-line react-refresh/only-export-components
export function normalizeRole(rawRole?: string): 'creative' | 'visitor' | 'admin' | 'client' {
    if (!rawRole) return 'creative';
    const r = rawRole.toLowerCase().trim();
    if (r === 'admin' || r === 'curator') return 'admin';
    if (r === 'client' || r === 'partner') return 'client';
    if (r === 'visitor' || r === 'collector' || r === 'user') return 'visitor';
    if (r === 'creative' || r === 'contributor' || r === 'photographer' || r === 'videographer') return 'creative';
    return 'creative';
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // For mock mode, initialize from localStorage synchronously (lazy state init)
        if (!isConfigured) {
            const stored = localStorage.getItem(CURRENT_USER_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored) as User;
                    parsed.role = normalizeRole(parsed.role);
                    return parsed;
                } catch { /* ignore */ }
            }
        }
        return null;
    });

    const [isLoading, setIsLoading] = useState<boolean>(() => {
        if (!isConfigured) return false;
        return true;
    });

    interface SupabaseUser { id: string; email?: string; user_metadata?: Record<string, unknown>; }
    const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User> => {
        try {
            // 1. Try public.profiles first (Supabase schema standard), fallback to public.users
            let profile: Record<string, unknown> | null = null;
            try {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', supabaseUser.id)
                    .maybeSingle();
                profile = profileData as Record<string, unknown> | null;
            } catch {
                // ignore
            }

            if (!profile) {
                try {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', supabaseUser.id)
                        .maybeSingle();
                    profile = userData as Record<string, unknown> | null;
                } catch {
                    // ignore
                }
            }

            const rawRole = (profile?.role as string) || (supabaseUser.user_metadata?.role as string) || 'creative';
            const normalizedRole = normalizeRole(rawRole);

            // 2. If photographer/creative, ensure photographer record exists
            if (normalizedRole === 'creative') {
                try {
                    const { data: photo, error: photoError } = await supabase
                        .from('photographers')
                        .select('*')
                        .eq('user_id', supabaseUser.id)
                        .maybeSingle();

                    if (!photo && (!photoError || photoError.code === 'PGRST116')) {
                        await supabase.from('photographers').insert({
                            user_id: supabaseUser.id,
                            location: (supabaseUser.user_metadata?.city as string) || '',
                            connects_balance: 20
                        });
                    }
                } catch {
                    // ignore photographer insert error
                }
            }

            // 3. Map user data cleanly
            const userData: User = {
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                name: (profile?.full_name as string) || (profile?.name as string) || (supabaseUser.user_metadata?.full_name as string) || supabaseUser.email?.split('@')[0] || 'User',
                avatar: (profile?.avatar_url as string) || (supabaseUser.user_metadata?.avatar_url as string) || "https://randomuser.me/api/portraits/lego/1.jpg",
                bio: (profile?.bio as string) || (supabaseUser.user_metadata?.bio as string) || undefined,
                title: (profile?.title as string) || (supabaseUser.user_metadata?.title as string) || undefined,
                location: (profile?.location as string) || (supabaseUser.user_metadata?.location as string) || undefined,
                role: normalizedRole,
                country: (profile?.country as string) || (supabaseUser.user_metadata?.country as string) || undefined,
                createdAt: (supabaseUser as unknown as { created_at?: string }).created_at || (profile?.created_at as string) || undefined,
            };

            setUser(userData);
            if (!isConfigured) {
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
            }
            return userData;
        } catch (_e) {
            console.error("Failed to fetch extended profile:", _e);
            // Construct resilient fallback
            const fallbackUser: User = {
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                name: (supabaseUser.user_metadata?.full_name as string) || supabaseUser.email?.split('@')[0] || 'User',
                avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                role: normalizeRole(supabaseUser.user_metadata?.role as string),
            };
            setUser(fallbackUser);
            return fallbackUser;
        } finally {
            setIsLoading(false);
        }
    };

    // Sync auth state
    useEffect(() => {
        if (isConfigured) {
            let isMounted = true;
            // Get initial Supabase session
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (isMounted) {
                    if (session?.user) {
                        fetchUserProfile(session.user);
                    } else {
                        setIsLoading(false);
                    }
                }
            }).catch(() => {
                if (isMounted) setIsLoading(false);
            });

            // Listen for Supabase auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (isMounted) {
                    if (session?.user) {
                        fetchUserProfile(session.user);
                    } else {
                        setUser(null);
                        setIsLoading(false);
                    }
                }
            });

            return () => {
                isMounted = false;
                subscription.unsubscribe();
            };
        } else {
            setIsLoading(false);
            console.log("🛠️ Auth running in Mock Mode (No Supabase detected)");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, password: string) => {
        // 1. Check brute-force lockout status
        const lockout = checkLoginAttempts(email);
        if (lockout.isLocked) {
            throw new Error(`Account temporarily locked due to consecutive failed attempts. Please retry in ${lockout.remainingLockoutSeconds}s.`);
        }

        if (isConfigured) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                const failRecord = recordFailedAttempt(email);
                if (failRecord.isLocked) {
                    throw new Error("Maximum login attempts exceeded. Account is locked for 60 seconds.");
                }
                throw error;
            }
            if (data?.user) {
                await fetchUserProfile(data.user);
            }
            resetLoginAttempts(email);
        } else {
            // Mock login
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            const foundUser = mockUsers.find((u: { email: string; password: string }) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (foundUser) {
                resetLoginAttempts(email);
                const userData: User = {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: foundUser.name,
                    avatar: foundUser.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
                    bio: foundUser.bio || "Passionate creative exploring the visual heritage and contemporary landscapes of Tunisia.",
                    title: foundUser.title || (foundUser.role === 'creative' ? 'Photographer & Visual Creator' : 'Commissioning Client'),
                    location: foundUser.location || "Tunis, Tunisia",
                    role: normalizeRole(foundUser.role),
                    country: foundUser.country || undefined,
                    createdAt: foundUser.createdAt || undefined,
                };
                setUser(userData);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
            } else {
                const failRecord = recordFailedAttempt(email);
                if (failRecord.isLocked) {
                    throw new Error("Maximum login attempts exceeded. Account is locked for 60 seconds.");
                }
                throw new Error(`Invalid email or password. (${5 - failRecord.attempts} attempts remaining)`);
            }
        }
    };

    const signup = async (email: string, password: string, name: string, role: 'creative' | 'visitor' | 'admin' | 'client' = 'creative', metadata?: Record<string, unknown>) => {
        // Enforce hardened archival password security standards
        const passwordEval = validatePassword(password, { email, name });
        if (!passwordEval.isValid) {
            throw new Error(passwordEval.errors[0] || "Password does not meet required security complexity.");
        }

        if (isConfigured) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: role,
                        ...metadata
                    },
                },
            });
            if (error) throw error;
            if (data?.user) {
                await fetchUserProfile(data.user);
            }
        } else {
            // Mock signup
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            if (mockUsers.some((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase())) {
                throw new Error("An account with this email address already exists.");
            }

            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                email,
                password,
                name,
                role: normalizeRole(role),
                createdAt: new Date().toISOString(),
                ...metadata
            };

            mockUsers.push(newUser);
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));

            const userData: User = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                role: normalizeRole(newUser.role),
                country: (newUser as { country?: string }).country || undefined,
                createdAt: newUser.createdAt,
            };
            setUser(userData);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        }
    };

    const switchRole = (newRole: 'creative' | 'visitor' | 'admin' | 'client') => {
        if (!user) return;
        const updated = { ...user, role: newRole };
        setUser(updated);
        if (!isConfigured) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            const idx = mockUsers.findIndex((u: { id: string }) => u.id === user.id);
            if (idx !== -1) {
                mockUsers[idx].role = newRole;
                localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
            }
        }
    };

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser: User = { ...user, ...updates };
        setUser(updatedUser);

        if (isConfigured) {
            try {
                // Update Supabase user metadata
                await supabase.auth.updateUser({
                    data: {
                        full_name: updatedUser.name,
                        avatar_url: updatedUser.avatar,
                        bio: updatedUser.bio,
                        title: updatedUser.title,
                        location: updatedUser.location,
                    }
                });
                // Also attempt updating public.profiles table
                await supabase.from('profiles').update({
                    full_name: updatedUser.name,
                    avatar_url: updatedUser.avatar,
                    bio: updatedUser.bio,
                    title: updatedUser.title,
                    location: updatedUser.location,
                }).eq('id', user.id);
            } catch (err) {
                console.warn("Could not sync profile update to remote DB:", err);
            }
        } else {
            // Update local mock storage
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            const idx = mockUsers.findIndex((u: { id: string }) => u.id === user.id);
            if (idx !== -1) {
                mockUsers[idx] = { ...mockUsers[idx], ...updates };
                localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
            }
        }
    };

    const resetPasswordForEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
        const cleanEmail = email.trim().toLowerCase();
        if (isConfigured) {
            const redirectUrl = `${window.location.origin}/reset-password`;
            const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                redirectTo: redirectUrl,
            });
            if (error) throw error;
            return {
                success: true,
                message: `Password reset link dispatched to ${cleanEmail}. Check your inbox to proceed.`
            };
        } else {
            // Mock mode password recovery
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            const exists = mockUsers.some((u: { email: string }) => u.email.toLowerCase() === cleanEmail);
            if (!exists) {
                throw new Error("No registered account found with this email address.");
            }
            localStorage.setItem('tl_reset_target_email', cleanEmail);
            return {
                success: true,
                message: `Password reset instructions sent to ${cleanEmail}. You can now proceed to set a new password.`
            };
        }
    };

    const updatePassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
        const passwordEval = validatePassword(newPassword);
        if (!passwordEval.isValid) {
            throw new Error(passwordEval.errors[0] || "Password does not meet required security standards.");
        }

        if (isConfigured) {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            return { success: true, message: "Your password has been successfully updated." };
        } else {
            const targetEmail = localStorage.getItem('tl_reset_target_email') || user?.email;
            if (!targetEmail) {
                throw new Error("No active password reset session found. Please request a new recovery link.");
            }
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            const idx = mockUsers.findIndex((u: { email: string }) => u.email.toLowerCase() === targetEmail.toLowerCase());
            if (idx !== -1) {
                mockUsers[idx].password = newPassword;
                localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
                localStorage.removeItem('tl_reset_target_email');
                return { success: true, message: "Password updated successfully. You can now log in." };
            }
            throw new Error("User account could not be located in local archive.");
        }
    };

    const logout = async () => {
        if (isConfigured) {
            await supabase.auth.signOut();
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, switchRole, updateProfile, resetPasswordForEmail, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
