import { Link, useNavigate } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import { Menu, X, Camera, User, LogIn, UserPlus, LogOut, Sun, Moon, Briefcase, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { getConnects } = useMarketplace();
    const { hasAccess: hasTunisianAccess } = useTunisianAccess();
    const navigate = useNavigate();

    // Close user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close mobile menu on outside click/tap
    useEffect(() => {
        if (!isOpen) return;
        function handleOutside(event: MouseEvent | TouchEvent) {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('touchstart', handleOutside);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('touchstart', handleOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <Camera className="h-6 w-6" strokeWidth={2} />
                    <span className="font-serif text-2xl font-bold tracking-tighter">Tunisian Lens</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/explore" className="text-sm font-medium hover:text-primary/80 transition-colors">
                        Explore
                    </Link>
                    <Link to="/photographers" className="text-sm font-medium hover:text-primary/80 transition-colors">
                        Photographers
                    </Link>
                    <Link to="/about" className="text-sm font-medium hover:text-primary/80 transition-colors">
                        About
                    </Link>
                    {hasTunisianAccess && (
                        <Link to="/jobs" className="text-sm font-medium hover:text-primary/80 transition-colors flex items-center gap-1.5">
                            Find Jobs
                        </Link>
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-3">
                    <Link to="/client-access" className="text-sm font-medium hover:text-primary/80 transition-colors">
                        Client Access
                    </Link>
                    {(!isAuthenticated || user?.role === 'photographer') && (
                        <Link to="/submit">
                            <Button variant="ghost" size="sm" className="hidden lg:inline-flex">Submit Work</Button>
                        </Link>
                    )}

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-9 h-9"
                        onClick={toggleTheme}
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="h-4 w-4" strokeWidth={2} />
                        ) : (
                            <Sun className="h-4 w-4" strokeWidth={2} />
                        )}
                    </Button>

                    {/* Account Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-9 h-9 overflow-hidden"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            {isAuthenticated && user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-5 w-5" strokeWidth={2} />
                            )}
                        </Button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute right-0 mt-2 w-56 bg-background border rounded-xl shadow-xl overflow-hidden z-50"
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-3 border-b bg-muted/50">
                                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                        {user?.role}
                                                    </span>
                                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                                </div>
                                            </div>
                                            {user?.role === 'photographer' && (
                                                <div className="px-4 py-2 border-b bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-tight text-amber-700 dark:text-amber-500">My Connects</span>
                                                    <span className="font-bold text-sm text-amber-700 dark:text-amber-500">⚡ {getConnects(user.id)}</span>
                                                </div>
                                            )}
                                            <div className="p-2 space-y-1">
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Briefcase className="h-4 w-4" strokeWidth={2} />
                                                    Dashboard
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-primary"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                {user?.role === 'photographer' && (
                                                    <Link
                                                        to={`/artist/${user.id}`}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4" strokeWidth={2} />
                                                        My Profile
                                                    </Link>
                                                )}
                                                <button
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="h-4 w-4" strokeWidth={2} />
                                                    Log Out
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-2 space-y-1">
                                            <Link
                                                to="/login"
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <LogIn className="h-4 w-4" strokeWidth={2} />
                                                Log In
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <UserPlus className="h-4 w-4" strokeWidth={2} />
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                    <div className="border-t p-2">
                                        {(!isAuthenticated || user?.role === 'photographer') && (
                                            <Link
                                                to="/submit"
                                                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Submit Work
                                            </Link>
                                        )}
                                        <Link
                                            to="/client-access"
                                            className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Client Access
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Right Controls */}
                <div className="md:hidden flex items-center gap-2">
                    <button
                        className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-accent transition-colors"
                        onClick={toggleTheme}
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="h-5 w-5" strokeWidth={2} />
                        ) : (
                            <Sun className="h-5 w-5" strokeWidth={2} />
                        )}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-6 w-6" strokeWidth={2} /> : <Menu className="h-6 w-6" strokeWidth={2} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div ref={mobileMenuRef} className="md:hidden border-b bg-background p-4 space-y-4">
                    <Link to="/explore" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                        Explore
                    </Link>
                    <Link to="/photographers" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                        Photographers
                    </Link>
                    <Link to="/about" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    {hasTunisianAccess && (
                        <Link to="/jobs" className="block text-sm font-medium py-2 text-primary font-bold" onClick={() => setIsOpen(false)}>
                            Find Jobs
                        </Link>
                    )}
                    <div className="border-t pt-4 space-y-4">
                        <Link to="/client-access" className="block text-sm font-medium py-2 text-primary" onClick={() => setIsOpen(false)}>
                            Client Access
                        </Link>
                        <Link to="/submit" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                            Submit Work
                        </Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-2 text-sm font-bold py-2 text-primary" onClick={() => setIsOpen(false)}>
                                <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                                Admin Panel
                            </Link>
                        )}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" className="w-full">Log In</Button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)}>
                                <Button className="w-full">Sign Up</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
