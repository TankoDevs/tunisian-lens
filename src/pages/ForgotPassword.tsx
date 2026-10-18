import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { resetPasswordForEmail } = useAuth();
    const { showAlert } = useAlert();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        if (!email.trim()) {
            setErrorMessage("Please enter the email address linked to your account.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await resetPasswordForEmail(email.trim());
            setIsSubmitted(true);
            showAlert(res.message, "success");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to initiate password reset. Please try again.";
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
                        <span>Security &amp; Account Recovery</span>
                    </div>
                    <h1 className="text-3xl font-serif text-alabaster tracking-tight">Forgot Password?</h1>
                    <p className="text-xs text-mist max-w-sm mx-auto leading-relaxed">
                        Enter your verified email address below. We'll send you an encrypted recovery link to reset your account password.
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="p-8 rounded-3xl bg-surface border border-edge text-center space-y-6 shadow-2xl">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-ochre/15 border border-ochre/30 flex items-center justify-center text-ochre">
                            <Mail className="h-7 w-7" strokeWidth={1.8} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg font-serif font-medium text-alabaster">Reset Instructions Dispatched</h2>
                            <p className="text-xs text-mist leading-relaxed font-light">
                                An encrypted recovery email was dispatched to <strong className="text-ochre font-mono">{email}</strong>.
                                Click the link in that email to create a new password.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-canvas border border-edge text-[11px] text-mist flex items-center gap-2 text-left">
                            <CheckCircle2 className="h-4 w-4 text-ochre flex-shrink-0" />
                            <span>Link expires in 30 minutes for security compliance.</span>
                        </div>

                        <div className="pt-2 flex flex-col gap-3">
                            <Link to="/reset-password">
                                <button className="w-full h-11 rounded-full bg-ochre hover:bg-ochre-light text-canvas font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                                    <span>Enter New Password</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setIsSubmitted(false)}
                                className="text-xs text-mist hover:text-ochre transition-colors font-mono"
                            >
                                Did not receive the link? Try another email
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 rounded-3xl bg-surface border border-edge shadow-2xl space-y-6">
                        {errorMessage && (
                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-rose-400">{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <div className="space-y-2">
                                <label htmlFor="recovery-email" className="text-xs font-mono uppercase tracking-wider text-mist">
                                    Registered Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="recovery-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="creative@tunisianlens.com"
                                        required
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                                    />
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist/60" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 rounded-full bg-ochre hover:bg-ochre-light disabled:opacity-50 text-canvas font-semibold text-xs font-mono uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span>Transmitting Link...</span>
                                ) : (
                                    <>
                                        <span>Send Password Reset Email</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-2 text-center border-t border-edge/60">
                            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-ochre transition-colors font-mono">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Return to Archival Sign In</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
