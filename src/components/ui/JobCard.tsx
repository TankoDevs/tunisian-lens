import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Banknote, Zap, ArrowRight } from "lucide-react";
import { type Job } from "../../data/mockData";
import { ConnectsBadge } from "./ConnectsBadge";
import { cn } from "../../lib/utils";

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
    const isExpired = daysLeft === 'Expired';
    const isNearDeadline = !isExpired && daysLeft !== 'Due today' && parseInt(daysLeft) <= 5;

    return (
        <div
            className={cn(
                "group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[hsl(var(--accent))/40]",
                job.isUrgent && "ring-1 ring-red-500/30"
            )}
        >
            {/* Urgent strip */}
            {job.isUrgent && (
                <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-400" />
            )}

            <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Category + status */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--accent))] bg-[hsl(var(--accent))/10] px-2 py-0.5 rounded-full">
                                {job.category}
                            </span>
                            {job.isUrgent && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">
                                    <Zap className="h-2.5 w-2.5" strokeWidth={2.5} fill="currentColor" />
                                    Urgent
                                </span>
                            )}
                            {job.status === 'closed' && (
                                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    Closed
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <Link to={`/jobs/${job.id}`} className="group/title block">
                            <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover/title:text-[hsl(var(--accent))] transition-colors">
                                {job.title}
                            </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">by {job.clientName}</p>
                    </div>

                    {/* Connects badge */}
                    <ConnectsBadge count={job.connectsRequired} size="sm" />
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {job.description}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                    {/* Budget */}
                    <span className="flex items-center gap-1 font-semibold text-sm text-[hsl(var(--accent))]">
                        <Banknote className="h-3.5 w-3.5" strokeWidth={1.5} />
                        ${job.budget.toLocaleString()}
                        <span className="text-muted-foreground font-normal text-xs">{job.currency}</span>
                    </span>

                    {/* Location */}
                    {job.location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                            <span className="truncate max-w-[120px]">{job.location}</span>
                        </span>
                    )}

                    {/* Deadline */}
                    <span className={cn("flex items-center gap-1 ml-auto", isNearDeadline && "text-amber-500 font-medium", isExpired && "text-muted-foreground/50 line-through")}>
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                        {daysLeft}
                    </span>
                </div>

                {/* Footer: applicants + date + Apply button */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                            {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                        </span>
                        <span>{timeAgo(job.createdAt)}</span>
                    </div>

                    <Link
                        to={`/jobs/${job.id}`}
                        className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200",
                            job.status === 'open'
                                ? "bg-foreground text-background hover:bg-foreground/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                        )}
                    >
                        {job.status === 'open' ? (
                            <>Apply <ArrowRight className="h-3 w-3" /></>
                        ) : 'Closed'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
