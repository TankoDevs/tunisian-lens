import { type BadgeLevel } from "../../data/mockData";
import { cn } from "../../lib/utils";
import { ShieldCheck, Star, Crown } from "lucide-react";

interface BadgePillProps {
    level: BadgeLevel;
    size?: 'sm' | 'md';
    className?: string;
}

const BADGE_CONFIG: Record<BadgeLevel, {
    label: string;
    Icon: React.ElementType;
    classes: string;
    iconClass: string;
}> = {
    verified: {
        label: "Verified",
        Icon: ShieldCheck,
        classes: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800",
        iconClass: "text-sky-500",
    },
    pro: {
        label: "Pro",
        Icon: Star,
        classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
        iconClass: "text-amber-500",
    },
    elite: {
        label: "Elite",
        Icon: Crown,
        classes: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800",
        iconClass: "text-violet-500",
    },
};

export function BadgePill({ level, size = 'md', className }: BadgePillProps) {
    const cfg = BADGE_CONFIG[level];
    const Icon = cfg.Icon;
    const isSm = size === 'sm';

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 font-semibold border rounded-full",
                isSm ? "text-[9px] px-1.5 py-0.5 tracking-wide" : "text-[10px] px-2 py-0.5 tracking-wider",
                cfg.classes,
                className
            )}
            title={`${cfg.label} creator`}
        >
            <Icon className={cn(isSm ? "h-2.5 w-2.5" : "h-3 w-3", cfg.iconClass)} strokeWidth={2} />
            {cfg.label.toUpperCase()}
        </span>
    );
}
