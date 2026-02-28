import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'creative' | 'visitor' | 'admin' | 'client';
    country?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, role?: 'creative' | 'visitor' | 'admin' | 'client', metadata?: Record<string, unknown>) => Promise<void>;
    logout: () => void;
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
            id: 'demo-creative-1',
            email: 'creative@tunisianlens.com',
            password: 'creative123',
            name: 'Yassine Mansour',
            role: 'creative',
            country: 'TN',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
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

    let changed = false;
    for (const demo of demos) {
        if (!mockUsers.some((u: { email: string }) => u.email === demo.email)) {
            mockUsers.push(demo);
            changed = true;
        }
    }
    if (changed) localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
})();

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // For mock mode, initialize from localStorage synchronously (lazy state init — avoids setState in effect)
        if (!isConfigured) {
            const stored = localStorage.getItem(CURRENT_USER_KEY);
            if (stored) {
                try { return JSON.parse(stored) as User; } catch { /* ignore */ }
            }
        }
        return null;
    });

    interface SupabaseUser { id: string; email?: string; user_metadata: Record<string, unknown>; }
    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
        try {
            // 1. Get user role and verification status from public.users
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            let profile = profileData;
            if (profileError && profileError.code !== 'PGRST116') {
                console.error("Profile fetch error:", profileError);
            }

            // If profile doesn't exist (happens right after signup), the trigger might not have finished
            // or we might need to create it manually if triggers are disabled.
            if (profileError && profileError.code === 'PGRST116') {
                const { data: newProfile, error: _createError } = await supabase
                    .from('users')
                    .upsert({
                        id: supabaseUser.id,
                        email: supabaseUser.email,
                        name: supabaseUser.user_metadata.full_name || supabaseUser.email?.split('@')[0],
                        role: supabaseUser.user_metadata.role || 'creative'
                    })
                    .select()
                    .single();

                if (!_createError) profile = newProfile;
            }

            // 2. If photographer, ensure photographer record exists
            if (profile?.role === 'creative') {
                const { data: photo, error: _photoError } = await supabase
                    .from('photographers')
                    .select('*')
                    .eq('user_id', supabaseUser.id)
                    .single();

                if (_photoError && _photoError.code === 'PGRST116') {
                    // Create photographer profile
                    await supabase.from('photographers').insert({
                        user_id: supabaseUser.id,
                        location: supabaseUser.user_metadata.city || '',
                        connects_balance: 0 // Start at 0 until verified
                    });
                }

                // 3. Connects Award Logic: If verified and never awarded, give 20 connects
                if (profile.is_verified) {
                    const { data: transactions } = await supabase
                        .from('connect_transactions')
                        .select('id')
                        .eq('photographer_id', photo?.id || '')
                        .eq('reason', 'bonus')
                        .limit(1);

                    if (!transactions || transactions.length === 0) {
                        // Get photo id if we just created it or it was missing
                        const { data: photoDataRef } = await supabase.from('photographers').select('id').eq('user_id', supabaseUser.id).single();
                        const photoId = (photo?.id || (photoDataRef as { id: string } | null)?.id) as string | undefined;

                        if (photoId) {
                            // Award 20 connects
                            await supabase.from('photographers').update({ connects_balance: 20 }).eq('id', photoId);
                            await supabase.from('connect_transactions').insert({
                                photographer_id: photoId,
                                amount: 20,
                                reason: 'bonus'
                            });
                        }
                    }
                }
            }

            // Map data
            const userData: User = {
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                name: (profile?.name as string) || (supabaseUser.user_metadata.full_name as string) || supabaseUser.email?.split('@')[0] || 'User',
                avatar: (supabaseUser.user_metadata.avatar_url as string) || "https://randomuser.me/api/portraits/lego/1.jpg",
                role: (profile?.role as 'creative' | 'visitor' | 'admin' | 'client') || (supabaseUser.user_metadata.role as 'creative' | 'visitor' | 'admin' | 'client') || 'creative',
                country: (profile?.country as string) || (supabaseUser.user_metadata.country as string) || undefined,
                createdAt: (supabaseUser as unknown as { created_at?: string }).created_at || undefined,
            };

            setUser(userData);
        } catch (_e) {
            console.error("Failed to fetch extended profile:", _e);
        }
    };

    // Sync auth state
    useEffect(() => {
        if (isConfigured) {
            // Get initial Supabase session
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    fetchUserProfile(session.user);
                }
            });

            // Listen for Supabase auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    fetchUserProfile(session.user);
                } else {
                    setUser(null);
                }
            });

            return () => subscription.unsubscribe();
        } else {
            console.log("🛠️ Auth running in Mock Mode (No Supabase detected)");
        }
    }, []);

    const login = async (email: string, password: string) => {
        if (isConfigured) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            // Mock login
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            const foundUser = mockUsers.find((u: { email: string; password: string }) => u.email === email && u.password === password);

            if (foundUser) {
                const userData: User = {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: foundUser.name,
                    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                    role: foundUser.role || 'creative',
                    country: foundUser.country || undefined,
                    createdAt: foundUser.createdAt || undefined,
                };
                setUser(userData);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
            } else {
                throw new Error("Invalid email or password");
            }
        }
    };

    const signup = async (email: string, password: string, name: string, role: 'creative' | 'visitor' | 'admin' | 'client' = 'creative', metadata?: Record<string, unknown>) => {
        if (isConfigured) {
            const { error } = await supabase.auth.signUp({
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
        } else {
            // Mock signup
            const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
            if (mockUsers.some((u: { email: string }) => u.email === email)) {
                throw new Error("User already exists");
            }

            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                email,
                password,
                name,
                role,
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
                role: newUser.role as 'creative' | 'visitor' | 'admin' | 'client',
                country: (newUser as { country?: string }).country || undefined,
                createdAt: newUser.createdAt,
            };
            setUser(userData);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
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
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
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
