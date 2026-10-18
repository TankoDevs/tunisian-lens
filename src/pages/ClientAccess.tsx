import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";

export function ClientAccess() {
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState("");
    const { getProjectByCode } = useProjects();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!accessCode.trim()) {
            setError("Please enter a valid client access code");
            return;
        }

        const project = getProjectByCode(accessCode.trim());

        if (project) {
            navigate(`/project/${project.id}`);
        } else {
            setError("Unrecognized access code. Please verify with your videographer or photographer.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-canvas text-alabaster px-4 py-16">
            <div className="w-full max-w-md p-8 md:p-10 space-y-8 bg-surface rounded-3xl border border-edge shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ochre/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-canvas border border-edge text-ochre mb-2">
                        <Lock className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre block">Protected Vault</span>
                    <h1 className="text-3xl font-serif text-alabaster tracking-tight">Client &amp; Visitor Access</h1>
                    <p className="text-xs md:text-sm text-mist font-light leading-relaxed">
                        Enter your private code from a videographer or photographer to unlock and download your photos, master files, and deliverables.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <input
                            placeholder="e.g. X7K-9P2"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="w-full text-center text-xl font-mono tracking-[0.3em] uppercase h-14 rounded-2xl border border-edge bg-canvas text-alabaster placeholder:text-mist/30 focus:outline-none focus:border-ochre transition-all"
                        />
                        {error && <p className="text-xs text-rose-400 text-center font-mono pt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 rounded-full bg-ochre hover:bg-ochre-light text-canvas font-medium text-xs font-mono uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <span>Unlock Gallery</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </form>

                <div className="text-center text-[11px] font-mono text-mist/60 flex items-center justify-center gap-1.5 pt-2 border-t border-edge/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-ochre" />
                    <span>Encrypted Client Handover Protocol</span>
                </div>
            </div>
        </div>
    );
}
