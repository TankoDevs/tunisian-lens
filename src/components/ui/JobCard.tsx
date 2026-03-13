import { Link } from "react-router-dom";
import { Clock, Users, Zap, ArrowRight } from "lucide-react";
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
                "group relative bg-card border border-border/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-[#C8A97E]/30",
                job.isUrgent && "border-red-500/20"
            )}
        >
            <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Category + status */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C8A97E] bg-[#C8A97E]/10 px-2.5 py-1 rounded-full border border-[#C8A97E]/20">
                                {job.category}
                            </span>
                            {job.isUrgent && (
                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                    <Zap className="h-3 w-3" strokeWidth={3} fill="currentColor" />
                                    Urgent
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <Link to={`/jobs/${job.id}`} className="group/title block">
                            <h3 className="font-bold text-lg md:text-xl leading-snug line-clamp-2 group-hover/title:text-[#C8A97E] transition-colors duration-300">
                                {job.title}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                                {job.clientName?.[0]}
                            </div>
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{job.clientName}</p>
                        </div>
                    </div>

                    {/* Connects badge */}
                    <div className="flex-shrink-0">
                        <ConnectsBadge count={job.connectsRequired} size="sm" />
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-light">
                    {job.description}
                </p>

                {/* Meta row */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/40">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Budget</p>
                        <span className="flex items-center gap-1 font-bold text-lg text-foreground">
                            ${job.budget.toLocaleString()}
                            <span className="text-muted-foreground font-normal text-xs">{job.currency}</span>
                        </span>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Deadline</p>
                        <span className={cn("inline-flex items-center gap-1 text-sm font-bold",
                            isNearDeadline ? "text-amber-500" : isExpired ? "text-muted-foreground/30 line-through" : "text-foreground"
                        )}>
                            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                            {daysLeft}
                        </span>
                    </div>
                </div>

                {/* Footer: applicants + Apply button */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                            <Users className="h-3.5 w-3.5" strokeWidth={2} />
                            {job.applicantCount} {job.applicantCount === 1 ? 'Applicant' : 'Applicants'}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">{timeAgo(job.createdAt)}</span>
                    </div>

                    <Link
                        to={`/jobs/${job.id}`}
                        className={cn(
                            "inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300",
                            job.status === 'open'
                                ? "bg-foreground text-background hover:bg-[#C8A97E] hover:text-white shadow-sm hover:shadow-lg"
                                : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                        )}
                    >
                        {job.status === 'open' ? (
                            <>Apply Now <ArrowRight className="h-3.5 w-3.5" /></>
                        ) : 'Closed'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
