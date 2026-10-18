import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Camera, ArrowRight, ShieldCheck, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { PHOTO_CATEGORIES } from "../data/mockData";
import { checkLoginAttempts } from "../lib/passwordSecurity";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [lockoutSeconds, setLockoutSeconds] = useState(0);

    const { login } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();

    const handleEmailChange = (val: string) => {
        setEmail(val);
        if (!val.trim()) {
            setLockoutSeconds(0);
        } else {
            const status = checkLoginAttempts(val);
            setLockoutSeconds(status.remainingLockoutSeconds);
        }
    };

    // Countdown timer for lockout
    useEffect(() => {
        if (lockoutSeconds <= 0) return;
        const timer = setInterval(() => {
            setLockoutSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [lockoutSeconds]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { showAlert("Please enter your email to continue", "error"); return; }
        if (!password) { showAlert("Password is required", "error"); return; }
        if (lockoutSeconds > 0) {
            showAlert(`Account temporarily locked. Please wait ${lockoutSeconds} seconds.`, "error");
            return;
        }
        if (!isVerified) { showAlert("Please complete the human verification slider", "warning"); return; }

        try {
            await login(email.trim(), password);
            showAlert("Welcome back to your workspace!", "success");
            const fromState = (location.state as { from?: { pathname?: string } | string })?.from;
            const targetPath = typeof fromState === 'string' ? fromState : fromState?.pathname || "/dashboard";
            navigate(targetPath, { replace: true });
        } catch (err: unknown) {
            const status = checkLoginAttempts(email);
            setLockoutSeconds(status.remainingLockoutSeconds);
            const message = err instanceof Error ? err.message : "Login failed. Please verify your credentials.";
            showAlert(message, "error");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4.5rem)] grid grid-cols-1 md:grid-cols-2 bg-canvas text-alabaster">
            {/* Form Column */}
            <div className="flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-3">
                        <Link to="/" className="inline-flex items-center space-x-2 md:hidden mb-4">
                            <Camera className="h-5 w-5 text-ochre" strokeWidth={1.8} />
                            <span className="font-serif text-xl text-alabaster">Tunisian Lens</span>
                        </Link>
                        <div className="hidden md:block w-8 h-[2px] bg-ochre mb-4" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre">Archival Portal</span>
                        <h1 className="text-3xl md:text-4xl font-serif text-alabaster tracking-tight">Welcome Back</h1>
                        <p className="text-sm text-mist font-light">Enter your credentials to access your creative studio</p>
                    </div>

                    {/* Lockout Warning Banner */}
                    {lockoutSeconds > 0 && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                            <div className="text-xs space-y-1 font-mono">
                                <p className="font-semibold text-rose-400 uppercase tracking-wider">Account Security Lockout</p>
                                <p className="text-mist">
                                    Too many consecutive failed attempts. Cooling off for <strong className="text-alabaster">{lockoutSeconds}s</strong> to prevent brute-force attacks.
                                </p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-mist">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="photographer@tunisianlens.com"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-mist">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-edge bg-surface text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist hover:text-alabaster transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Captcha onVerify={setIsVerified} />
                        </div>

                        <button
                            type="submit"
                            disabled={!isVerified || lockoutSeconds > 0}
                            className="w-full h-12 rounded-full bg-ochre hover:bg-ochre-light disabled:opacity-50 disabled:cursor-not-allowed text-canvas font-medium text-xs font-mono uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <span>{lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : "Access Portfolio"}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-edge"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-canvas px-3 text-mist/60 font-mono tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="h-11 rounded-xl border border-edge bg-surface hover:bg-surface-elevated text-xs font-mono uppercase tracking-wider text-mist hover:text-alabaster transition-colors flex items-center justify-center gap-2"
                            onClick={() => showAlert("Google authentication will be active shortly.", "warning")}
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="h-11 rounded-xl border border-edge bg-surface hover:bg-surface-elevated text-xs font-mono uppercase tracking-wider text-mist hover:text-alabaster transition-colors flex items-center justify-center gap-2"
                            onClick={() => showAlert("Facebook login will be active shortly.", "warning")}
                        >
                            <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    <div className="text-center text-sm text-mist">
                        Don't have an account yet?{" "}
                        <Link to="/signup" className="text-ochre hover:text-ochre-light underline underline-offset-4 font-medium">
                            Join the Guild
                        </Link>
                    </div>

                    {/* Quick Demo Logins for Testing */}
                    <div className="pt-8 border-t border-edge space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-ochre" />
                            <p className="text-xs font-mono uppercase tracking-wider text-mist">Quick Testing Profiles</p>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="text-[11px] text-mist/60 block mb-1.5 font-mono">Photographer Profiles:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {PHOTO_CATEGORIES.slice(0, 5).map(cat => {
                                        const demoEmail = `${cat.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.com`;
                                        return (
                                            <button
                                                key={`photo-${cat}`}
                                                type="button"
                                                onClick={() => { handleEmailChange(demoEmail); setPassword('demo123'); setIsVerified(true); }}
                                                className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-edge bg-surface hover:border-ochre hover:text-ochre transition-colors"
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <span className="text-[11px] text-mist/60 block mb-1.5 font-mono">Administrative & Client:</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { handleEmailChange('client@tunisianlens.com'); setPassword('client123'); setIsVerified(true); }}
                                        className="text-[10px] font-mono px-3 py-1 rounded-full border border-edge bg-surface text-sidi-azure hover:border-sidi-azure transition-colors"
                                    >
                                        Client Role
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { handleEmailChange('admin@tunisianlens.com'); setPassword('admin123'); setIsVerified(true); }}
                                        className="text-[10px] font-mono px-3 py-1 rounded-full border border-ochre/40 bg-ochre/10 text-ochre hover:bg-ochre/20 transition-colors"
                                    >
                                        Admin Curator
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Photography Column */}
            <div className="hidden md:block relative bg-surface border-l border-edge overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1554080353-a576cf803bda?w=1400&q=85"
                    alt="Mediterranean visual study"
                    className="absolute inset-0 h-full w-full object-cover filter brightness-[0.75] contrast-[1.05]"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                            target.src = "https://picsum.photos/seed/placeholder-login/1200/1600";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-canvas/60 via-transparent to-transparent" />

                <div className="absolute bottom-16 left-12 right-12 text-alabaster max-w-md">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre block mb-3">
                        Tunisian Lens Archives
                    </span>
                    <blockquote className="text-2xl font-serif leading-relaxed text-alabaster">
                        "Photography is the austere art of seizing light before history conceals it."
                    </blockquote>
                    <p className="text-xs mt-3 text-mist font-mono tracking-widest uppercase">
                        — Archival Curators, Sidi Bou Said
                    </p>
                </div>
            </div>
        </div>
    );
}
