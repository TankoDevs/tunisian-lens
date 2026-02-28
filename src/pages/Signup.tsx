import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { type CreativeType } from "../data/mockData";

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
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-3">
                        <Link to="/" className="inline-flex items-center space-x-2 md:hidden mb-4">
                            <Camera className="h-5 w-5 text-sand-400" strokeWidth={1.8} />
                            <span className="font-sans text-xl font-bold">Tunisian Lens</span>
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
                                    <Input id="city" placeholder="Tunis" value={city} onChange={(e) => setCity(e.target.value)} />
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
                                <option value="Tunisia">🇹🇳 Tunisia</option>
                                <option value="Algeria">🇩🇿 Algeria</option>
                                <option value="Morocco">🇲🇦 Morocco</option>
                                <option value="Libya">🇱🇾 Libya</option>
                                <option value="Egypt">🇪🇬 Egypt</option>
                                <option value="France">🇫🇷 France</option>
                                <option value="Germany">🇩🇪 Germany</option>
                                <option value="United States">🇺🇸 United States</option>
                                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                                <option value="Other">🌍 Other</option>
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
