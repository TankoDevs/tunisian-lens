import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";
import { Button } from "./ui/button";
import { Menu, X, Camera, User, LogIn, UserPlus, LogOut, Sun, Moon, Briefcase, ShieldCheck, MessageSquare, Zap, TrendingUp, Bell, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useChat } from "../context/ChatContext";
import { cn } from "../lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [isGearOpen, setIsGearOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const messagesMenuRef = useRef<HTMLDivElement>(null);
    const exploreMenuRef = useRef<HTMLDivElement>(null);
    const gearMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { getConnects } = useMarketplace();
    const { unreadCount, getMyConversations } = useChat();
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll detection for navbar background
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (messagesMenuRef.current && !messagesMenuRef.current.contains(event.target as Node)) {
                setIsMessagesOpen(false);
            }
            if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target as Node)) {
                setIsExploreOpen(false);
            }
            if (gearMenuRef.current && !gearMenuRef.current.contains(event.target as Node)) {
                setIsGearOpen(false);
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
        <nav className={cn(
            "sticky top-0 z-50 w-full transition-all duration-500",
            scrolled
                ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm py-2"
                : "bg-transparent border-b border-transparent py-4"
        )}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <Camera className="h-6 w-6 text-sand-400 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2} />
                        <span className="font-sans text-2xl font-black tracking-tight text-foreground">Tunisian Lens</span>
                    </Link>

                    {/* Desktop Nav Discovery Group */}
                    <div className="hidden md:flex items-center space-x-7">
                        <div className="relative group/explore" ref={exploreMenuRef}>
                            <button
                                onClick={() => setIsExploreOpen(!isExploreOpen)}
                                onMouseEnter={() => setIsExploreOpen(true)}
                                className={cn(navLinkClass('/explore'), "flex items-center gap-1 py-2")}
                            >
                                Explore <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExploreOpen && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                                {isExploreOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        onMouseLeave={() => setIsExploreOpen(false)}
                                        className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-xl shadow-xl p-2 z-50"
                                    >
                                        <Link to="/explore" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors" onClick={() => setIsExploreOpen(false)}>Photography</Link>
                                        <Link to="/explore?type=video" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors" onClick={() => setIsExploreOpen(false)}>Videography</Link>
                                        <Link to="/creatives" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors" onClick={() => setIsExploreOpen(false)}>Top Creators</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/creatives" className={navLinkClass('/creatives')}>
                            Creatives
                        </Link>
                        <Link to="/jobs" className={navLinkClass('/jobs')}>
                            Jobs
                        </Link>

                        <div className="relative group/gear" ref={gearMenuRef}>
                            <button
                                onClick={() => setIsGearOpen(!isGearOpen)}
                                onMouseEnter={() => setIsGearOpen(true)}
                                className={cn(navLinkClass('/gear'), "flex items-center gap-1 py-2")}
                            >
                                Gear Market <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isGearOpen && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                                {isGearOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        onMouseLeave={() => setIsGearOpen(false)}
                                        className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-xl shadow-xl p-2 z-50"
                                    >
                                        <Link to="/gear?cat=camera" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors" onClick={() => setIsGearOpen(false)}>Cameras</Link>
                                        <Link to="/gear?cat=lens" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors" onClick={() => setIsGearOpen(false)}>Lenses</Link>
                                        <Link to="/gear?cat=lighting" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors" onClick={() => setIsGearOpen(false)}>Lighting</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Desktop Actions Group */}
                <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-center gap-4 mr-2">
                        <Link to="/client-access" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Client Access
                        </Link>
                        <div className="h-4 w-[1px] bg-border/60" /> {/* Subtle Divider */}
                    </div>

                    {(!isAuthenticated || user?.role === 'creative') && (
                        <Link to="/submit">
                            <Button
                                size="sm"
                                className="hidden lg:inline-flex rounded-full bg-sand-400 hover:bg-sand-500 text-white font-bold px-5 shadow-lg shadow-sand-400/20 hover:shadow-sand-400/30 transition-all"
                            >
                                Submit Work
                            </Button>
                        </Link>
                    )}

                    <div className="flex items-center gap-1.5">
                        {/* Messages Icon */}
                        {isAuthenticated && (
                            <div className="relative" ref={messagesMenuRef}>
                                <button
                                    className="rounded-full w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 relative"
                                    title="Messages"
                                    onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                                >
                                    <MessageSquare className="h-4.5 w-4.5" strokeWidth={1.5} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-sand-400 text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                <AnimatePresence>
                                    {isMessagesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                                        >
                                            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                                                <h3 className="font-bold text-sm">Recent Messages</h3>
                                                <Link to="/messages" onClick={() => setIsMessagesOpen(false)} className="text-xs text-[hsl(var(--accent))] hover:underline font-semibold">
                                                    View All
                                                </Link>
                                            </div>
                                            <div className="max-h-[320px] overflow-y-auto">
                                                {getMyConversations().length === 0 ? (
                                                    <div className="p-8 text-center text-muted-foreground">
                                                        <p className="text-xs">No conversations yet</p>
                                                    </div>
                                                ) : (
                                                    getMyConversations().slice(0, 5).map((conv) => (
                                                        <Link
                                                            key={conv.id}
                                                            to="/messages"
                                                            onClick={() => setIsMessagesOpen(false)}
                                                            className="block p-4 hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center text-sand-600 font-bold text-xs uppercase flex-shrink-0">
                                                                    {(user?.id === conv.clientId ? conv.creativeName : conv.clientName).charAt(0)}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                                        <p className="font-bold text-xs truncate">
                                                                            {user?.id === conv.clientId ? conv.creativeName : conv.clientName}
                                                                        </p>
                                                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                                            {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                                                                        {conv.lastMessage || 'Start a conversation'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Notifications Icon */}
                        {isAuthenticated && (
                            <button
                                className="rounded-full w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 relative"
                                title="Notifications"
                            >
                                <Bell className="h-4.5 w-4.5" strokeWidth={1.5} />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-sand-400 rounded-full" />
                            </button>
                        )}

                        {/* Theme Toggle */}
                        <button
                            className="rounded-full w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
                            onClick={toggleTheme}
                            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? (
                                <Moon className="h-4.5 w-4.5" strokeWidth={1.5} />
                            ) : (
                                <Sun className="h-4.5 w-4.5" strokeWidth={1.5} />
                            )}
                        </button>
                    </div>

                    {/* Account Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            className="rounded-full w-10 h-10 flex items-center justify-center border border-border/60 hover:border-foreground/20 overflow-hidden transition-all duration-300 bg-muted/20 shadow-sm"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            {isAuthenticated && user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
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
                                                    <>
                                                        <Link
                                                            to={`/artist/${user.id}`}
                                                            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                                            My Profile
                                                        </Link>
                                                        <Link
                                                            to="/buy-connects"
                                                            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors duration-200"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <Zap className="h-4 w-4 text-[hsl(var(--accent))]" strokeWidth={1.5} fill="currentColor" />
                                                            Buy Connects
                                                        </Link>
                                                    </>
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
                        <div className="px-6 py-8 space-y-8 max-h-[85vh] overflow-y-auto">
                            {/* Main Navigation Group */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-2 mb-4">Menu</p>
                                {[
                                    { to: "/explore", label: "Explore Hub", icon: <TrendingUp className="h-4 w-4" /> },
                                    { to: "/creatives", label: "Find Creatives", icon: <User className="h-4 w-4" /> },
                                    { to: "/jobs", label: "Job Board", icon: <Briefcase className="h-4 w-4" /> },
                                    { to: "/gear", label: "Gear Market", icon: <Camera className="h-4 w-4" /> },
                                ].map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300",
                                            isActive(item.to)
                                                ? "bg-foreground text-background font-bold shadow-lg"
                                                : "text-foreground/70 hover:bg-muted font-medium"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center",
                                            isActive(item.to) ? "bg-background/20" : "bg-muted"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <span className="text-sm tracking-wide">{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Secondary Navigation */}
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-2 mb-4">Platform</p>
                                <Link to="/about" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/70 font-medium hover:text-foreground" onClick={() => setIsOpen(false)}>
                                    About Tunisian Lens
                                </Link>
                                <Link to="/client-access" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/70 font-medium hover:text-foreground" onClick={() => setIsOpen(false)}>
                                    Client Access
                                </Link>
                                <Link to="/submit" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/70 font-medium hover:text-foreground" onClick={() => setIsOpen(false)}>
                                    Submit Your Work
                                </Link>
                            </div>

                            {/* User Specific & Auth */}
                            <div className="pt-4 border-t border-border space-y-4">
                                {isAuthenticated ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 px-4 py-3 bg-muted/30 rounded-2xl border border-border/50">
                                            <img src={user?.avatar} alt={user?.name} className="w-12 h-12 rounded-full object-cover border-2 border-background" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{user?.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                            <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full h-12 rounded-xl justify-start gap-3 px-4">
                                                    <Briefcase className="h-4 w-4" /> Dashboard
                                                </Button>
                                            </Link>
                                            {user?.role === 'creative' && (
                                                <Link to="/buy-connects" onClick={() => setIsOpen(false)}>
                                                    <Button variant="outline" className="w-full h-12 rounded-xl justify-start gap-3 px-4 border-[hsl(var(--accent))/30] text-[hsl(var(--accent))]">
                                                        <Zap className="h-4 w-4" fill="currentColor" /> Buy Connects · ⚡ {getConnects(user.id)}
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button
                                                variant="ghost"
                                                className="w-full h-12 rounded-xl justify-start gap-3 px-4 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" /> Log Out
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full h-12 rounded-xl font-bold">Log In</Button>
                                        </Link>
                                        <Link to="/signup" className="w-full" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full h-12 rounded-xl font-bold">Sign Up</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
