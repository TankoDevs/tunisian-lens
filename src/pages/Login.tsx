import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const { login } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Custom Validation
        if (!email) {
            showAlert("Please enter your email to continue", "error");
            return;
        }
        if (!password) {
            showAlert("Password is required", "error");
            return;
        }
        if (!isVerified) {
            showAlert("Please complete the verification slider", "warning");
            return;
        }

        try {
            await login(email, password);
            navigate("/");
        } catch {
            showAlert("Login failed. Please check your credentials.", "error");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
            {/* Form Section */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="text-center md:text-left space-y-2">
                        <Link to="/" className="inline-flex items-center space-x-2 md:hidden mb-4">
                            <Camera className="h-6 w-6" />
                            <span className="font-serif text-xl font-bold">Tunisian Lens</span>
                        </Link>
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your account</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="pt-2">
                            <Captcha onVerify={setIsVerified} />
                        </div>
                        <Button className="w-full" type="submit" disabled={!isVerified}>Sign In</Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div className="hidden md:block relative bg-muted">
                <img
                    src="https://picsum.photos/seed/tunis-architecture/1200/1600"
                    alt="Tunisian Architecture"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                            target.src = "https://picsum.photos/seed/placeholder-login/1200/1600";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-8 left-8 right-8 text-white p-6 bg-black/40 backdrop-blur-sm rounded-lg">
                    <p className="text-lg font-serif italic">"Photography is the story I fail to put into words."</p>
                    <p className="text-sm mt-2 opacity-80">— Destin Sparks</p>
                </div>
            </div>
        </div>
    );
}
