import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Banknote } from "lucide-react";
import { type Job } from "../../data/mockData";
import { ConnectsBadge } from "./ConnectsBadge";

interface JobCardProps {
    job: Job;
}

function daysUntil(deadline: string): string {
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return 'Expired';
    if (days === 0) return 'Due today';
    return `${days}d left`;
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export function JobCard({ job }: JobCardProps) {
    const daysLeft = daysUntil(job.deadline);
    const isUrgent = daysLeft !== 'Expired' && parseInt(daysLeft) <= 7;

    return (
        <Link
            to={`/jobs/${job.id}`}
            className="group block bg-card border border-border rounded-lg p-6 card-hover transition-all duration-300 hover:border-sand-300 dark:hover:border-sand-700"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-sand-600 dark:text-sand-400 bg-sand-50 dark:bg-sand-900/20 px-2 py-0.5 rounded">
                            {job.category}
                        </span>
                        {job.status === 'closed' && (
                            <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                Closed
                            </span>
                        )}
                    </div>
                    <h3 className="font-sans font-semibold text-lg leading-snug line-clamp-2">
                        {job.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">by {job.clientName}</p>
                </div>
                <ConnectsBadge count={job.connectsRequired} size="sm" />
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                {job.description}
            </p>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-4 border-t border-border">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Banknote className="h-3.5 w-3.5 text-sand-500" strokeWidth={1.5} />
                    ${job.budget.toLocaleString()} {job.currency}
                </span>
                {job.location && (
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {job.location}
                    </span>
                )}
                <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-500 font-medium' : ''}`}>
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {daysLeft}
                </span>
                <span className="flex items-center gap-1 ml-auto">
                    <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {job.applicantCount}
                </span>
                <span className="text-muted-foreground/50">{timeAgo(job.createdAt)}</span>
            </div>
        </Link>
    );
}
