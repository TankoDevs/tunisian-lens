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
            className="group block bg-card border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-200"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary/70 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
                            {job.category}
                        </span>
                        {job.status === 'closed' && (
                            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border">
                                Closed
                            </span>
                        )}
                    </div>
                    <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {job.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">by {job.clientName}</p>
                </div>
                <ConnectsBadge count={job.connectsRequired} size="sm" />
            </div>

            {/* Description preview */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {job.description}
            </p>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Banknote className="h-3.5 w-3.5" strokeWidth={2} />
                    ${job.budget.toLocaleString()} {job.currency}
                </span>
                {job.location && (
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                        {job.location}
                    </span>
                )}
                <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-500 font-medium' : ''}`}>
                    <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                    {daysLeft}
                </span>
                <span className="flex items-center gap-1 ml-auto">
                    <Users className="h-3.5 w-3.5" strokeWidth={2} />
                    {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                </span>
                <span className="text-muted-foreground/60">{timeAgo(job.createdAt)}</span>
            </div>
        </Link>
    );
}
