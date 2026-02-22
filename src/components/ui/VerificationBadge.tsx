import { CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface VerificationBadgeProps {
    className?: string;
    size?: number;
}

export function VerificationBadge({ className, size = 16 }: VerificationBadgeProps) {
    return (
        <div className={cn("inline-flex items-center text-primary/80", className)} title="Verified Photographer">
            <CheckCircle2 size={size} strokeWidth={2} />
        </div>
    );
}
