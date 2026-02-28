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
            className={`inline-flex items-center gap-1 font-medium rounded-md
                ${isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}
                bg-sand-50 text-sand-700 border border-sand-200
                dark:bg-sand-900/20 dark:text-sand-400 dark:border-sand-800
                ${className}`}
        >
            <Zap className={isSmall ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} strokeWidth={1.8} fill="currentColor" />
            {count}
        </span>
    );
}
