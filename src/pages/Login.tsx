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
        if (!email) { showAlert("Please enter your email to continue", "error"); return; }
        if (!password) { showAlert("Password is required", "error"); return; }
        if (!isVerified) { showAlert("Please complete the verification slider", "warning"); return; }
        try {
            await login(email, password);
            navigate("/");
        } catch {
            showAlert("Login failed. Please check your credentials.", "error");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
            {/* Form */}
            <div className="flex items-center justify-center p-8 md:p-16 bg-background">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-3">
                        <Link to="/" className="inline-flex items-center space-x-2 md:hidden mb-4">
                            <Camera className="h-5 w-5 text-sand-400" strokeWidth={1.8} />
                            <span className="font-serif text-xl font-bold">Tunisian Lens</span>
                        </Link>
                        <div className="hidden md:block w-10 h-[1.5px] bg-sand-400 mb-4" />
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="pt-1">
                            <Captcha onVerify={setIsVerified} />
                        </div>
                        <Button className="w-full h-11" type="submit" disabled={!isVerified}>Sign In</Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-sand-600 dark:text-sand-400 hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="hidden md:block relative bg-muted">
                <img
                    src="https://images.unsplash.com/photo-1554080353-a576cf803bda?w=1200&q=80"
                    alt="Photography"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder')) {
                            target.src = "https://picsum.photos/seed/placeholder-login/1200/1600";
                        }
                    }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-10 left-10 right-10 text-white">
                    <p className="text-lg font-serif italic leading-relaxed">"Photography is the story I fail to put into words."</p>
                    <p className="text-xs mt-3 text-white/60 tracking-wider uppercase">— Destin Sparks</p>
                </div>
            </div>
        </div>
    );
}
