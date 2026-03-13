import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { type CreativeType } from "../data/mockData";
import { Logo } from "../components/ui/Logo";

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
        if (role === 'creative' && !city) { showAlert("Please provide your city", "error"); return; }
        if (role === 'creative' && !creativeType) { showAlert("Please select your creative type", "error"); return; } // New validation
        if (!isVerified) { showAlert("Please complete the verification slider", "warning"); return; }
        try {
            await signup(email, password, `${firstName} ${lastName}`, role, { country, ...(role === 'creative' ? { city, creativeType } : {}) }); // Pass creativeType
            navigate("/");
        } catch {
            showAlert("Failed to create account. Please try again.", "error");
        }
    };

    const roleOptions = [
        { value: 'creative' as const, label: 'Creative' },
        { value: 'client' as const, label: 'Client' },
        { value: 'visitor' as const, label: 'Visitor' },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="hidden md:block relative bg-muted order-2 md:order-1">
                <img
                    src="https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=1200&q=80"
                    alt="Photography"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                            target.src = "https://picsum.photos/seed/placeholder-signup/1200/1600";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-10 left-10 right-10 text-white">
                    <p className="text-lg font-sans font-medium leading-relaxed">Join the community of world-class visual artists.</p>
                    <p className="text-xs mt-3 text-white/60 tracking-wider uppercase">Tunisian Lens</p>
                </div>
            </div>

            {/* Form */}
            <div className="flex items-center justify-center p-8 md:p-16 bg-background order-1 md:order-2">
                <div className="w-full max-sm:px-0 space-y-8">
                    <div className="space-y-3">
                        <Link to="/" className="md:hidden block mb-4">
                            <Logo iconSize={20} textSize="text-xl" />
                        </Link>
                        <div className="hidden md:block w-10 h-[1.5px] bg-sand-400 mb-4" />
                        <h1 className="text-3xl font-sans font-bold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">Showcase your work to the world</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First name</label>
                                <Input id="first-name" placeholder="First" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last name</label>
                                <Input id="last-name" placeholder="Last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I am a...</label>
                            <div className="grid grid-cols-3 gap-2">
                                {roleOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setRole(opt.value)}
                                        className={`py-2 rounded-md text-xs font-medium border transition-all duration-300 ${role === opt.value
                                            ? 'bg-foreground text-background border-foreground'
                                            : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {role === 'creative' && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City</label>
                                    <select
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400"
                                    >
                                        <option value="" disabled>Select a city</option>
                                        {TUNISIAN_REGIONS.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I am a</label>
                                    <div className="flex gap-2">
                                        {([
                                            { value: 'photographer' as const, label: 'Photographer' },
                                            { value: 'videographer' as const, label: 'Videographer' },
                                            { value: 'both' as const, label: 'Both' },
                                        ]).map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setCreativeType(opt.value)}
                                                className={`flex-1 h-10 rounded-md border text-sm font-medium transition-all duration-200 ${creativeType === opt.value
                                                    ? 'bg-foreground text-background border-foreground'
                                                    : 'border-border hover:bg-accent text-muted-foreground hover:text-foreground'
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
                            <label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country</label>
                            <select
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full h-10 px-4 rounded-md border border-border bg-background text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400"
                            >
                                <option value="Tunisia">Tunisia</option>
                                <option value="Algeria">Algeria</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Libya">Libya</option>
                                <option value="Egypt">Egypt</option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Other">Other</option>
                            </select>
                            {country !== 'Tunisia' && (
                                <p className="text-xs text-sand-600 dark:text-sand-400">
                                    ⚠️ The job marketplace is restricted to Tunisian citizens and residents.
                                </p>
                            )}
                        </div>
                        <div className="pt-1">
                            <Captcha onVerify={setIsVerified} />
                        </div>
                        <Button className="w-full h-11" type="submit" disabled={!isVerified}>Create Account</Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-11 font-medium bg-background" onClick={() => showAlert("Google signup will be available soon!", "warning")}>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" className="h-11 font-medium bg-background" onClick={() => showAlert("Facebook signup will be available soon!", "warning")}>
                            <svg className="mr-2 h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-sand-600 dark:text-sand-400 hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
