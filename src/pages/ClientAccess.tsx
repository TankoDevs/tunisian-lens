import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Lock, ArrowRight } from "lucide-react";
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
            setError("Please enter an access code");
            return;
        }

        const project = getProjectByCode(accessCode.trim());

        if (project) {
            navigate(`/project/${project.id}`);
        } else {
            setError("Invalid access code. Please check and try again.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-muted/20">
            <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg border shadow-sm mx-4">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold">Client Access</h1>
                    <p className="text-muted-foreground">
                        Enter your unique access code to view and download your private gallery.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Enter Access Code (e.g. X7K-9P2)"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="text-center text-lg tracking-widest uppercase h-12"
                        />
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    </div>

                    <Button type="submit" className="w-full h-11 text-base">
                        Access Gallery <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="text-center text-xs text-muted-foreground">
                    <p>Protected by secure client verification.</p>
                </div>
            </div>
        </div>
    );
}
