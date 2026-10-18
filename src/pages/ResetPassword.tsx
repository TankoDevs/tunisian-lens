import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Camera, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { validatePassword } from "../lib/passwordSecurity";

export function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { updatePassword } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const evalResult = validatePassword(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (!password) {
            setErrorMessage("Please enter a new password.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (!evalResult.isValid) {
            setErrorMessage(evalResult.errors[0] || "Password does not meet required security standards.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await updatePassword(password);
            showAlert(res.message, "success");
            navigate("/login", { replace: true });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to update password. Please try again.";
            setErrorMessage(msg);
            showAlert(msg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-6 md:p-12 bg-black text-alabaster">
            <div className="w-full max-w-md space-y-8">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <Link to="/" className="inline-flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-surface border border-edge flex items-center justify-center text-ochre">
                            <Camera className="h-5 w-5" strokeWidth={1.8} />
                        </div>
                        <span className="font-serif text-2xl font-bold tracking-tight text-alabaster">Tunisian Lens</span>
                    </Link>
                    <div className="flex items-center justify-center gap-1.5 text-ochre text-xs font-mono uppercase tracking-[0.2em]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Security Standard NIST SP 800-63B</span>
                    </div>
                    <h1 className="text-3xl font-serif text-alabaster tracking-tight">Set New Password</h1>
                    <p className="text-xs text-mist max-w-sm mx-auto leading-relaxed">
                        Create a strong, unique password to safeguard your creative portfolio and archive dispatches.
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-surface border border-edge shadow-2xl space-y-6">
                    {errorMessage && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-rose-400">{errorMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* New Password */}
                        <div className="space-y-2">
                            <label htmlFor="new-password" className="text-xs font-mono uppercase tracking-wider text-mist">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full h-12 pl-11 pr-11 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all font-mono"
                                />
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist/60" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist hover:text-alabaster transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="text-xs font-mono uppercase tracking-wider text-mist">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all font-mono"
                                />
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist/60" />
                            </div>
                        </div>

                        {/* Security Requirements Meter */}
                        {password.length > 0 && (
                            <div className="p-4 rounded-2xl bg-canvas border border-edge space-y-3">
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-mist uppercase text-[10px]">Security Strength</span>
                                    <span className={`font-semibold capitalize ${
                                        evalResult.score >= 3 ? 'text-emerald-400' :
                                        evalResult.score === 2 ? 'text-ochre' : 'text-rose-400'
                                    }`}>
                                        {evalResult.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-mist">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className={`w-3.5 h-3.5 ${password.length >= 10 ? 'text-ochre' : 'text-mist/30'}`} />
                                        <span>At least 10 chars</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className={`w-3.5 h-3.5 ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-ochre' : 'text-mist/30'}`} />
                                        <span>Upper &amp; lower</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className={`w-3.5 h-3.5 ${/[0-9]/.test(password) ? 'text-ochre' : 'text-mist/30'}`} />
                                        <span>Numbers</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className={`w-3.5 h-3.5 ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password) ? 'text-ochre' : 'text-mist/30'}`} />
                                        <span>Symbols</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password || password !== confirmPassword}
                            className="w-full h-12 rounded-full bg-ochre hover:bg-ochre-light disabled:opacity-50 text-canvas font-semibold text-xs font-mono uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span>Securing Credentials...</span>
                            ) : (
                                <>
                                    <span>Update &amp; Re-encrypt Password</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-2 text-center border-t border-edge/60">
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-ochre transition-colors font-mono">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Sign In</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
