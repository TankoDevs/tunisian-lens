import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import { Menu, X, Camera, User, LogIn, UserPlus, LogOut, Sun, Moon, Briefcase, ShieldCheck, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";
import { useChat } from "../context/ChatContext";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { getConnects } = useMarketplace();
    const { hasAccess: hasTunisianAccess } = useTunisianAccess();
    const { unreadCount } = useChat();
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll detection for navbar background
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const isActive = (path: string) => location.pathname === path;

    const navLinkClass = (path: string) =>
        `text-sm tracking-wide transition-colors duration-300 gallery-link ${isActive(path)
            ? 'text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground'
        }`;

    return (
        <nav className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent border-b border-transparent'
            }`}>
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2.5 group">
                    <Camera className="h-5 w-5 text-sand-400 transition-transform duration-300 group-hover:rotate-12" strokeWidth={1.8} />
                    <span className="font-serif text-xl font-bold tracking-tight">Tunisian Lens</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/explore" className={navLinkClass('/explore')}>
                        Explore
                    </Link>
                    <Link to="/creatives" className={navLinkClass('/creatives')}>
                        Creatives
                    </Link>
                    <Link to="/about" className={navLinkClass('/about')}>
                        About
                    </Link>
                    {hasTunisianAccess && (
                        <Link to="/jobs" className={navLinkClass('/jobs')}>
                            Jobs
                        </Link>
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-2">
                    <Link to="/client-access" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 mr-2">
                        Client Access
                    </Link>
                    {(!isAuthenticated || user?.role === 'creative') && (
                        <Link to="/submit">
                            <Button variant="ghost" size="sm" className="hidden lg:inline-flex text-muted-foreground">Submit Work</Button>
                        </Link>
                    )}

                    {/* Theme Toggle */}
                    <button
                        className="rounded-full w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
                        onClick={toggleTheme}
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="h-4 w-4" strokeWidth={1.5} />
                        ) : (
                            <Sun className="h-4 w-4" strokeWidth={1.5} />
                        )}
                    </button>

                    {/* Messages Icon */}
                    {isAuthenticated && (
                        <Link to="/messages" className="relative">
                            <button className="rounded-full w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300" title="Messages">
                                <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-sand-400 text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                        </Link>
                    )}

                    {/* Account Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            className="rounded-full w-9 h-9 flex items-center justify-center border border-border hover:border-foreground/20 overflow-hidden transition-all duration-300"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            {isAuthenticated && user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            )}
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute right-0 mt-3 w-56 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-border">
                                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-sand-400/10 text-sand-600 dark:text-sand-400">
                                                        {user?.role}
                                                    </span>
                                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                                </div>
                                            </div>
                                            {user?.role === 'creative' && (
                                                <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Connects</span>
                                                    <span className="font-semibold text-sm text-sand-600 dark:text-sand-400">⚡ {getConnects(user.id)}</span>
                                                </div>
                                            )}
                                            <div className="p-1.5 space-y-0.5">
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                    Dashboard
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <ShieldCheck className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                {user?.role === 'creative' && (
                                                    <Link
                                                        to={`/artist/${user.id}`}
                                                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                        My Profile
                                                    </Link>
                                                )}
                                                <button
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                                                    Log Out
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-1.5 space-y-0.5">
                                            <Link
                                                to="/login"
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <LogIn className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                Log In
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <UserPlus className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                    <div className="border-t border-border p-1.5">
                                        {(!isAuthenticated || user?.role === 'creative') && (
                                            <Link
                                                to="/submit"
                                                className="lg:hidden flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Submit Work
                                            </Link>
                                        )}
                                        <Link
                                            to="/client-access"
                                            className="lg:hidden flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
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
                <div className="md:hidden flex items-center gap-1">
                    <button
                        className="rounded-full w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
                        onClick={toggleTheme}
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <Moon className="h-4.5 w-4.5" strokeWidth={1.5} />
                        ) : (
                            <Sun className="h-4.5 w-4.5" strokeWidth={1.5} />
                        )}
                    </button>
                    <button
                        className="rounded-full w-9 h-9 flex items-center justify-center text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden border-b border-border bg-background overflow-hidden"
                    >
                        <div className="px-6 py-6 space-y-1">
                            <Link to="/explore" className={`block py-2.5 text-sm ${isActive('/explore') ? 'text-foreground font-medium' : 'text-muted-foreground'}`} onClick={() => setIsOpen(false)}>
                                Explore
                            </Link>
                            <Link to="/creatives" className={`block py-2.5 text-sm ${isActive('/creatives') ? 'text-foreground font-medium' : 'text-muted-foreground'}`} onClick={() => setIsOpen(false)}>
                                Creatives
                            </Link>
                            <Link to="/about" className={`block py-2.5 text-sm ${isActive('/about') ? 'text-foreground font-medium' : 'text-muted-foreground'}`} onClick={() => setIsOpen(false)}>
                                About
                            </Link>
                            {hasTunisianAccess && (
                                <Link to="/jobs" className={`block py-2.5 text-sm ${isActive('/jobs') ? 'text-foreground font-medium' : 'text-muted-foreground'}`} onClick={() => setIsOpen(false)}>
                                    Jobs
                                </Link>
                            )}

                            <div className="border-t border-border mt-4 pt-4 space-y-1">
                                <Link to="/client-access" className="block py-2.5 text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>
                                    Client Access
                                </Link>
                                <Link to="/submit" className="block py-2.5 text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>
                                    Submit Work
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="flex items-center gap-2 py-2.5 text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>
                                        <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                                        Admin Panel
                                    </Link>
                                )}
                                {isAuthenticated && (
                                    <Link to="/messages" className="flex items-center gap-2 py-2.5 text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>
                                        <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                                        Messages
                                        {unreadCount > 0 && (
                                            <span className="ml-auto text-[10px] font-semibold bg-sand-400 text-white px-1.5 py-0.5 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </div>

                            <div className="border-t border-border mt-4 pt-4 grid grid-cols-2 gap-3">
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full">Log In</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Sign Up</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
