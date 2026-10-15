import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { type CreativeType } from "../data/mockData";

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
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Tunisia");
    const [role, setRole] = useState<'creative' | 'visitor' | 'client'>("creative");
    const [creativeType, setCreativeType] = useState<CreativeType>("photographer");
    const [isVerified, setIsVerified] = useState(false);
    const { signup } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName) { showAlert("Please enter your full name", "error"); return; }
        if (!email) { showAlert("Email is required", "error"); return; }
        if (!password) { showAlert("Please create a password", "error"); return; }
        if (role === 'creative' && !city) { showAlert("Please select your governorate / city", "error"); return; }
        if (role === 'creative' && !creativeType) { showAlert("Please select your creative discipline", "error"); return; }
        if (!isVerified) { showAlert("Please complete the verification slider", "warning"); return; }
        try {
            await signup(email, password, `${firstName} ${lastName}`, role, { country, ...(role === 'creative' ? { city, creativeType } : {}) });
            navigate("/");
        } catch {
            showAlert("Failed to create account. Please try again.", "error");
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
                        <p className="text-sm text-mist font-light">Join Tunisia’s premier optical storytelling guild</p>
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

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-mist">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                            />
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
                            disabled={!isVerified}
                            className="w-full h-12 rounded-full bg-ochre hover:bg-ochre-light disabled:opacity-50 text-canvas font-medium text-xs font-mono uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <span>Enroll in the Guild</span>
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
