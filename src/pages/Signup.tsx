import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Camera, ArrowRight, Eye, EyeOff, Check, X, Sparkles, Key, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { type CreativeType } from "../data/mockData";
import { validatePassword, generateHardenedPassword } from "../lib/passwordSecurity";

const TUNISIAN_REGIONS = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
    "Jendouba", "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia",
    "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid",
    "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
];

export function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Tunisia");
    const [role, setRole] = useState<'creative' | 'visitor' | 'client'>("creative");
    const [creativeType, setCreativeType] = useState<CreativeType>("photographer");
    const [isVerified, setIsVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();

    // Live password security evaluation
    const passwordEval = useMemo(() => {
        return validatePassword(password, {
            email,
            name: `${firstName} ${lastName}`.trim(),
        });
    }, [password, email, firstName, lastName]);

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

    const handleGeneratePassword = () => {
        const strongKey = generateHardenedPassword(16);
        setPassword(strongKey);
        setConfirmPassword(strongKey);
        setShowPassword(true);
        setShowConfirmPassword(true);

        navigator.clipboard.writeText(strongKey).then(() => {
            showAlert("Hardened 16-character cryptographic key generated & copied to clipboard!", "success");
        }).catch(() => {
            showAlert("Hardened 16-character key generated! Store it securely.", "success");
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            showAlert("Please enter your full name", "error");
            return;
        }
        if (!email.trim()) {
            showAlert("Email address is required", "error");
            return;
        }

        // Strict Password Evaluation Check
        if (!passwordEval.isValid) {
            showAlert(passwordEval.errors[0] || "Password does not meet required security standards.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Password confirmation does not match.", "error");
            return;
        }

        if (role === 'creative' && !city) {
            showAlert("Please select your governorate / city", "error");
            return;
        }
        if (role === 'creative' && !creativeType) {
            showAlert("Please select your creative discipline", "error");
            return;
        }
        if (!isVerified) {
            showAlert("Please complete the verification slider", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            await signup(
                email.trim(),
                password,
                `${firstName.trim()} ${lastName.trim()}`,
                role,
                { country, ...(role === 'creative' ? { city, creativeType } : {}) }
            );
            showAlert("Account created successfully with hardened security credentials!", "success");
            const fromState = (location.state as { from?: { pathname?: string } | string })?.from;
            const targetPath = typeof fromState === 'string' ? fromState : fromState?.pathname || "/dashboard";
            navigate(targetPath, { replace: true });
        } catch (err: any) {
            showAlert(err?.message || "Failed to create account. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const roleOptions = [
        { value: 'creative' as const, label: 'Creative / Curator' },
        { value: 'client' as const, label: 'Commissioning Client' },
        { value: 'visitor' as const, label: 'Observer / Collector' },
    ];

    return (
        <div className="min-h-[calc(100vh-4.5rem)] grid grid-cols-1 md:grid-cols-2 bg-canvas text-alabaster">
            {/* Visual Photography Column */}
            <div className="hidden md:block relative bg-surface border-r border-edge overflow-hidden order-2 md:order-1">
                <img
                    src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=1400&q=85"
                    alt="Tunisian heritage and light"
                    className="absolute inset-0 h-full w-full object-cover filter brightness-[0.75] contrast-[1.05]"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                            target.src = "https://picsum.photos/seed/placeholder-signup/1200/1600";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-canvas/60 via-transparent to-transparent" />

                <div className="absolute bottom-16 left-12 right-12 text-alabaster max-w-md">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre block mb-3">
                        The Creative Guild
                    </span>
                    <blockquote className="text-2xl font-serif leading-relaxed text-alabaster">
                        "Preserving the soul of Tunisia, frame by frame, across all 24 governorates."
                    </blockquote>
                    <p className="text-xs mt-3 text-mist font-mono tracking-widest uppercase">
                        — National Photographic Society
                    </p>
                </div>
            </div>

            {/* Form Column */}
            <div className="flex items-center justify-center p-8 md:p-16 order-1 md:order-2 overflow-y-auto">
                <div className="w-full max-w-md space-y-8 py-6">
                    <div className="space-y-3">
                        <Link to="/" className="inline-flex items-center space-x-2 md:hidden mb-4">
                            <Camera className="h-5 w-5 text-ochre" strokeWidth={1.8} />
                            <span className="font-serif text-xl text-alabaster">Tunisian Lens</span>
                        </Link>
                        <div className="hidden md:block w-8 h-[2px] bg-ochre mb-4" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre">Membership Enrollment</span>
                        <h1 className="text-3xl md:text-4xl font-serif text-alabaster tracking-tight">Create an Account</h1>
                        <p className="text-sm text-mist font-light">Join Tunisia’s premier optical storytelling guild with hardened credential protection</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-xs font-mono uppercase tracking-wider text-mist">First Name</label>
                                <input
                                    id="first-name"
                                    placeholder="Selim"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-xs font-mono uppercase tracking-wider text-mist">Last Name</label>
                                <input
                                    id="last-name"
                                    placeholder="Mansouri"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                                />
                            </div>
                        </div>

                        {/* Role selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-wider text-mist">I wish to join as</label>
                            <div className="grid grid-cols-3 gap-2">
                                {roleOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setRole(opt.value)}
                                        className={`py-2.5 px-2 rounded-xl text-xs font-mono tracking-wider border transition-all text-center ${role === opt.value
                                            ? 'bg-ochre text-canvas border-ochre font-semibold shadow-sm'
                                            : 'bg-surface border-edge text-mist hover:text-alabaster hover:border-edge/80'
                                            }`}
                                    >
                                        {opt.value === 'creative' ? 'Creative' : opt.value === 'client' ? 'Client' : 'Visitor'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-mist">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="selim@lens.tn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                            />
                        </div>

                        {/* --- HARDENED PASSWORD SECTION --- */}
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-mist flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-ochre" /> Hardened Password
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGeneratePassword}
                                    className="text-[11px] font-mono text-ochre hover:text-ochre-light flex items-center gap-1 transition-colors"
                                    title="Generate a cryptographically secure 16-character password"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    <span>Generate Key</span>
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter complex password..."
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

                            {/* Live Strength Meter */}
                            {password.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center justify-between text-xs font-mono">
                                        <span className="text-mist/70">Security Strength:</span>
                                        <span style={{ color: passwordEval.color }} className="font-semibold">
                                            {passwordEval.label}
                                        </span>
                                    </div>

                                    {/* 4-Segment Strength Indicator */}
                                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                                        {[1, 2, 3, 4].map((seg) => (
                                            <div
                                                key={seg}
                                                className="rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: seg <= passwordEval.score ? passwordEval.color : 'rgba(255,255,255,0.08)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Password Requirements Checklist */}
                            <div className="p-3.5 rounded-xl border border-edge bg-surface/60 space-y-2 text-[11px] font-mono">
                                <p className="text-mist/60 uppercase tracking-wider text-[10px] font-semibold">Security Requirements:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className={`flex items-center gap-1.5 ${passwordEval.requirements.minLength ? 'text-emerald-400' : 'text-mist/50'}`}>
                                        {passwordEval.requirements.minLength ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                                        <span>At least 10 characters</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordEval.requirements.hasUppercase ? 'text-emerald-400' : 'text-mist/50'}`}>
                                        {passwordEval.requirements.hasUppercase ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                                        <span>Uppercase letter (A-Z)</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordEval.requirements.hasLowercase ? 'text-emerald-400' : 'text-mist/50'}`}>
                                        {passwordEval.requirements.hasLowercase ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                                        <span>Lowercase letter (a-z)</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordEval.requirements.hasNumber ? 'text-emerald-400' : 'text-mist/50'}`}>
                                        {passwordEval.requirements.hasNumber ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                                        <span>Number digit (0-9)</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordEval.requirements.hasSpecialChar ? 'text-emerald-400' : 'text-mist/50'}`}>
                                        {passwordEval.requirements.hasSpecialChar ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                                        <span>Symbol (!@#$%^&*...)</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${passwordEval.requirements.noCommonPattern && passwordEval.requirements.noPersonalInfo ? 'text-emerald-400' : 'text-mist/50'}`}>
                                        {passwordEval.requirements.noCommonPattern && passwordEval.requirements.noPersonalInfo ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                                        <span>No common dictionary words</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="confirm-password" className="text-xs font-mono uppercase tracking-wider text-mist">
                                    Confirm Password
                                </label>
                                {confirmPassword.length > 0 && (
                                    <span className={`text-[10px] font-mono flex items-center gap-1 ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {passwordsMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        {passwordsMatch ? 'Keys match' : 'Keys do not match'}
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-type password..."
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full h-11 pl-4 pr-11 rounded-xl border bg-surface text-alabaster text-sm placeholder:text-mist/40 focus:outline-none transition-all font-mono ${
                                        confirmPassword.length > 0
                                            ? passwordsMatch
                                                ? 'border-emerald-500/50 focus:border-emerald-400'
                                                : 'border-rose-500/50 focus:border-rose-400'
                                            : 'border-edge focus:border-ochre'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist hover:text-alabaster transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {role === 'creative' && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-xs font-mono uppercase tracking-wider text-mist">Governorate (Tunisia)</label>
                                    <select
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm focus:outline-none focus:border-ochre transition-all"
                                    >
                                        <option value="" disabled>Select a Governorate</option>
                                        {TUNISIAN_REGIONS.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-mist">Creative Medium</label>
                                    <div className="flex gap-2">
                                        {([
                                            { value: 'photographer' as const, label: 'Photography' },
                                            { value: 'videographer' as const, label: 'Cinematography' },
                                            { value: 'both' as const, label: 'Both Mediums' },
                                        ]).map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setCreativeType(opt.value)}
                                                className={`flex-1 h-10 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all ${creativeType === opt.value
                                                    ? 'bg-ochre text-canvas border-ochre font-semibold shadow-sm'
                                                    : 'border-edge bg-surface text-mist hover:text-alabaster'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="country" className="text-xs font-mono uppercase tracking-wider text-mist">Country of Residence</label>
                            <select
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm focus:outline-none focus:border-ochre transition-all"
                            >
                                <option value="Tunisia">Tunisia</option>
                                <option value="Algeria">Algeria</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Libya">Libya</option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="United States">United States</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <Captcha onVerify={setIsVerified} />
                        </div>

                        <button
                            type="submit"
                            disabled={!isVerified || !passwordEval.isValid || !passwordsMatch || isSubmitting}
                            className="w-full h-12 rounded-full bg-ochre hover:bg-ochre-light disabled:opacity-40 disabled:cursor-not-allowed text-canvas font-medium text-xs font-mono uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <Key className="w-4 h-4" />
                            <span>{isSubmitting ? "Hardening Credentials..." : "Enroll with Hardened Key"}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="text-center text-sm text-mist pt-2">
                        Already hold an account?{" "}
                        <Link to="/login" className="text-ochre hover:text-ochre-light underline underline-offset-4 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
