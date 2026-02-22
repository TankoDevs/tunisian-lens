import { motion, AnimatePresence } from "framer-motion";
import { X, Ban, CheckCircle2, AlertCircle } from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import { cn } from "../../lib/utils";

export function GlobalAlert() {
    const { alert, hideAlert } = useAlert();

    return (
        <AnimatePresence>
            {alert && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={cn(
                        "fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-3",
                        alert.type === 'error' && "bg-destructive/10 border-destructive/20 text-destructive",
                        alert.type === 'success' && "bg-green-500/10 border-green-500/20 text-green-600",
                        alert.type === 'warning' && "bg-amber-500/10 border-amber-500/20 text-amber-600"
                    )}
                >
                    {alert.type === 'error' && <Ban className="h-5 w-5 shrink-0" strokeWidth={2} />}
                    {alert.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={2} />}
                    {alert.type === 'warning' && <AlertCircle className="h-5 w-5 shrink-0" strokeWidth={2} />}

                    <p className="text-sm font-medium pr-8">{alert.message}</p>

                    <button
                        onClick={hideAlert}
                        className="absolute right-3 p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
