import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";

export function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Tunisia");
    const [role, setRole] = useState<'photographer' | 'visitor' | 'client'>("photographer");
    const [isVerified, setIsVerified] = useState(false);
    const { signup } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Custom Validation
        if (!firstName || !lastName) {
            showAlert("Please enter your full name", "error");
            return;
        }
        if (!email) {
            showAlert("Email is required", "error");
            return;
        }
        if (!password) {
            showAlert("Please create a password", "error");
            return;
        }
        if (role === 'photographer' && !city) {
            showAlert("Please provide your city", "error");
            return;
        }
        if (!isVerified) {
            showAlert("Please complete the verification slider", "warning");
            return;
        }

        try {
            await signup(email, password, `${firstName} ${lastName}`, role, { country, ...(role === 'photographer' ? { city } : {}) });
            navigate("/");
        } catch {
            showAlert("Failed to create account. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
            {/* Image Section (Left on Desktop) */}
            <div className="hidden md:block relative bg-muted order-2 md:order-1">
                <img
                    src="https://picsum.photos/seed/sidi-bou-said-door/1200/1600"
                    alt="Tunisian Door"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                            target.src = "https://picsum.photos/seed/placeholder-signup/1200/1600";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-8 left-8 right-8 text-white p-6 bg-black/40 backdrop-blur-sm rounded-lg">
                    <p className="text-lg font-serif font-medium">Join the community of top Tunisian creators.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex items-center justify-center p-8 bg-background order-1 md:order-2">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="text-center md:text-left space-y-2">
                        <Link to="/" className="inline-flex items-center space-x-2 md:hidden mb-4">
                            <Camera className="h-6 w-6" />
                            <span className="font-serif text-xl font-bold">Tunisian Lens</span>
                        </Link>
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground">Showcase your work to the world</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium leading-none">First name</label>
                                <Input
                                    id="first-name"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium leading-none">Last name</label>
                                <Input
                                    id="last-name"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-4 pt-2">
                            <label className="text-sm font-medium leading-none">I am a...</label>
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    type="button"
                                    variant={role === 'photographer' ? 'default' : 'outline'}
                                    onClick={() => setRole('photographer')}
                                    className="w-full"
                                >
                                    Photographer
                                </Button>
                                <Button
                                    type="button"
                                    variant={role === 'visitor' ? 'default' : 'outline'}
                                    onClick={() => setRole('visitor')}
                                    className="w-full"
                                >
                                    Visitor
                                </Button>
                                <Button
                                    type="button"
                                    variant={role === 'client' ? 'default' : 'outline'}
                                    onClick={() => setRole('client')}
                                    className="w-full"
                                >
                                    Client
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {role === 'photographer' && (
                            <div className="space-y-2">
                                <label htmlFor="city" className="text-sm font-medium leading-none">City</label>
                                <Input
                                    id="city"
                                    placeholder="Tunis"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="country" className="text-sm font-medium leading-none">Country</label>
                            <select
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                    ⚠️ The job marketplace (Find Jobs) is restricted to Tunisian citizens and residents.
                                </p>
                            )}
                        </div>
                        <div className="pt-2">
                            <Captcha onVerify={setIsVerified} />
                        </div>
                        <Button className="w-full" type="submit" disabled={!isVerified}>Create Account</Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
