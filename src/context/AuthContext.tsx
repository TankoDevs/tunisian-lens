import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'photographer' | 'visitor' | 'admin' | 'client';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, role?: 'photographer' | 'visitor' | 'admin' | 'client', metadata?: Record<string, any>) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS_KEY = 'tunisian_lens_mock_users';
const CURRENT_USER_KEY = 'tunisian_lens_current_user';

// Seed a default admin account so it's always available
function seedAdminAccount() {
    const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    const adminExists = mockUsers.some((u: any) => u.email === 'admin@tunisianlens.com');
    if (!adminExists) {
        mockUsers.push({
            id: 'admin-1',
            email: 'admin@tunisianlens.com',
            password: 'admin123',
            name: 'Site Admin',
            role: 'admin'
        });
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
        console.log("🔑 Default admin account seeded: admin@tunisianlens.com / admin123");
    }
}
seedAdminAccount();

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const fetchUserProfile = async (supabaseUser: any) => {
        try {
            // 1. Get user role and verification status from public.users
            let { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

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
                        role: supabaseUser.user_metadata.role || 'photographer'
                    })
                    .select()
                    .single();

                if (!_createError) profile = newProfile;
            }

            // 2. If photographer, ensure photographer record exists
            if (profile?.role === 'photographer') {
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
                        const photoId = photo?.id || (await supabase.from('photographers').select('id').eq('user_id', supabaseUser.id).single()).data?.id;

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
                name: profile?.name || supabaseUser.user_metadata.full_name || supabaseUser.email?.split('@')[0] || 'User',
                avatar: supabaseUser.user_metadata.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg",
                role: profile?.role || supabaseUser.user_metadata.role || 'photographer'
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
            // Mock mode: Check localStorage for session
            const storedUser = localStorage.getItem(CURRENT_USER_KEY);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (_e) {
                    localStorage.removeItem(CURRENT_USER_KEY);
                }
            }
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
            const foundUser = mockUsers.find((u: any) => u.email === email && u.password === password);

            if (foundUser) {
                const userData: User = {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: foundUser.name,
                    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                    role: foundUser.role || 'photographer'
                };
                setUser(userData);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
            } else {
                throw new Error("Invalid email or password");
            }
        }
    };

    const signup = async (email: string, password: string, name: string, role: 'photographer' | 'visitor' | 'admin' | 'client' = 'photographer', metadata?: Record<string, any>) => {
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
            if (mockUsers.some((u: any) => u.email === email)) {
                throw new Error("User already exists");
            }

            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                email,
                password,
                name,
                role,
                ...metadata
            };

            mockUsers.push(newUser);
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));

            const userData: User = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                role: newUser.role as 'photographer' | 'visitor' | 'admin' | 'client'
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

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
