import { Zap } from "lucide-react";

interface ConnectsBadgeProps {
    count: number;
    size?: 'sm' | 'md';
    className?: string;
}

export function ConnectsBadge({ count, size = 'md', className = '' }: ConnectsBadgeProps) {
    const isSmall = size === 'sm';
    return (
        <span
            className={`inline-flex items-center gap-1 font-semibold rounded-full border
                ${isSmall ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}
                bg-amber-50 text-amber-700 border-amber-200
                dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800
                ${className}`}
        >
            <Zap className={isSmall ? 'h-3 w-3' : 'h-4 w-4'} strokeWidth={2} fill="currentColor" />
            {count} {count === 1 ? 'Connect' : 'Connects'}
        </span>
    );
}
