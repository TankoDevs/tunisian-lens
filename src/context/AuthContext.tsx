import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'photographer' | 'visitor' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, role?: 'photographer' | 'visitor' | 'admin') => Promise<void>;
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

    // Sync auth state
    useEffect(() => {
        if (isConfigured) {
            // Get initial Supabase session
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    const u = session.user;
                    setUser({
                        id: u.id,
                        email: u.email || '',
                        name: u.user_metadata.full_name || u.email?.split('@')[0] || 'User',
                        avatar: u.user_metadata.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg",
                        role: u.user_metadata.role || 'photographer'
                    });
                }
            });

            // Listen for Supabase auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    const u = session.user;
                    setUser({
                        id: u.id,
                        email: u.email || '',
                        name: u.user_metadata.full_name || u.email?.split('@')[0] || 'User',
                        avatar: u.user_metadata.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg",
                        role: u.user_metadata.role || 'photographer'
                    });
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
                } catch (e) {
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

    const signup = async (email: string, password: string, name: string, role: 'photographer' | 'visitor' | 'admin' = 'photographer') => {
        if (isConfigured) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: role
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
                role
            };

            mockUsers.push(newUser);
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));

            const userData: User = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
                role: newUser.role as 'photographer' | 'visitor' | 'admin'
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
