import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { PHOTO_CATEGORIES, VIDEO_CATEGORIES } from "../data/mockData";

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
                            <span className="font-sans text-xl font-bold">Tunisian Lens</span>
                        </Link>
                        <div className="hidden md:block w-10 h-[1.5px] bg-sand-400 mb-4" />
                        <h1 className="text-3xl font-sans font-bold tracking-tight">Welcome back</h1>
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

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-11 font-medium bg-background" onClick={() => showAlert("Google login will be available soon!", "warning")}>
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
                        <Button variant="outline" className="h-11 font-medium bg-background" onClick={() => showAlert("Facebook login will be available soon!", "warning")}>
                            <svg className="mr-2 h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-sand-600 dark:text-sand-400 hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Quick Demo Login (Testing)</p>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Photographers</p>
                                <div className="flex flex-wrap gap-2">
                                    {PHOTO_CATEGORIES.map(cat => {
                                        const email = `${cat.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.com`;
                                        return (
                                            <button
                                                key={`photo-${cat}`}
                                                type="button"
                                                onClick={() => { setEmail(email); setPassword('demo123'); setIsVerified(true); }}
                                                className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-muted/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Videographers</p>
                                <div className="flex flex-wrap gap-2">
                                    {VIDEO_CATEGORIES.map(cat => {
                                        const email = `${cat.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.com`;
                                        return (
                                            <button
                                                key={`video-${cat}`}
                                                type="button"
                                                onClick={() => { setEmail(email); setPassword('demo123'); setIsVerified(true); }}
                                                className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-muted/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Other Roles</p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setEmail('client@tunisianlens.com'); setPassword('client123'); setIsVerified(true); }}
                                        className="text-[10px] px-2.5 py-1 rounded-full border border-sandbox bg-sand-100 hover:bg-sand-500 hover:text-white transition-colors text-sand-800"
                                    >
                                        Client
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEmail('admin@tunisianlens.com'); setPassword('admin123'); setIsVerified(true); }}
                                        className="text-[10px] px-2.5 py-1 rounded-full border border-red-200 bg-red-50 hover:bg-red-500 hover:text-white transition-colors text-red-800"
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>
                        </div>
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
                    <p className="text-lg font-sans italic leading-relaxed">"Photography is the story I fail to put into words."</p>
                    <p className="text-xs mt-3 text-white/60 tracking-wider uppercase">— Destin Sparks</p>
                </div>
            </div>
        </div>
    );
}
