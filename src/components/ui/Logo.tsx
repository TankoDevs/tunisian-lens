import { Camera } from "lucide-react";
import { cn } from "../../lib/utils";

interface LogoProps {
    className?: string;
    iconSize?: number;
    textSize?: string;
    showText?: boolean;
}

export function Logo({
    className,
    iconSize = 24,
    textSize = "text-2xl",
    showText = true
}: LogoProps) {
    return (
        <div className={cn("flex items-center space-x-3 group", className)}>
            <div className="relative">
                {/* Dark Mode: Gold Icon with subtle glow */}
                <Camera
                    size={iconSize}
                    className="hidden dark:block text-sand-400 transition-transform duration-300 group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
                    strokeWidth={2}
                />

                {/* Light Mode: Professional Dark Icon */}
                <Camera
                    size={iconSize}
                    className="block dark:hidden text-slate-900 transition-transform duration-300 group-hover:rotate-12"
                    strokeWidth={2}
                />
            </div>

            {showText && (
                <span className={cn(
                    "font-sans font-black tracking-tight transition-all duration-300",
                    textSize,
                    // Dark Mode: Gold-White Gradient
                    "dark:bg-gradient-to-r dark:from-white dark:via-sand-200 dark:to-sand-400 dark:bg-clip-text dark:text-transparent",
                    // Light Mode: Midnight Slate Gradient
                    "bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent dark:bg-none"
                )}>
                    Tunisian <span className="dark:from-sand-300 dark:to-sand-500 from-slate-900 to-slate-700">Lens</span>
                </span>
            )}
        </div>
    );
}
