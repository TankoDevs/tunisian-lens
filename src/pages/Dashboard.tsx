import { Link } from "react-router-dom";
import { useState } from "react";
import { Zap, Briefcase, ChevronRight, CheckCircle2, XCircle, AlertCircle, PlusCircle, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
    isArtistVerified,
    getVerificationRequests,
    submitVerificationRequest,
    type VerificationRequest,
} from "../lib/verification";

function StatusBadge({ status }: { status: 'pending' | 'accepted' | 'rejected' }) {
    const config = {
        pending: { icon: AlertCircle, label: 'Pending', cls: 'text-sand-700 bg-sand-50 border-sand-200 dark:text-sand-400 dark:bg-sand-900/20 dark:border-sand-800' },
        accepted: { icon: CheckCircle2, label: 'Accepted', cls: 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800' },
        rejected: { icon: XCircle, label: 'Rejected', cls: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800' },
    }[status];
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${config.cls}`}>
            <Icon className="h-3 w-3" strokeWidth={1.5} />
            {config.label}
        </span>
    );
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const { jobs, getMyApplications, getJobApplications, getConnects } = useMarketplace();
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestMsg, setRequestMsg] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-6 text-muted-foreground">
                <div className="w-12 h-[1.5px] bg-sand-400" />
                <p className="font-sans text-xl font-semibold text-foreground">Please log in to view your dashboard</p>
                <Link to="/login"><Button>Log In</Button></Link>
            </div>
        );
    }

    const connects = getConnects(user.id);
    const myApplications = getMyApplications();
    const myJobs = jobs.filter(j => j.clientId === user.id);

    const isCreative = user.role === 'creative';
    const isClient = user.role === 'client';
    const isAdmin = user.role === 'admin';

    const isVerified = isArtistVerified(user.id);
    const allRequests: VerificationRequest[] = getVerificationRequests();
    const myRequest = allRequests.find(r => r.userId === user.id);

    const handleRequestSubmit = () => {
        if (!requestMsg.trim()) return;
        submitVerificationRequest(user.id, user.name, user.email, requestMsg.trim());
        setShowRequestForm(false);
        setRequestSent(true);
    };

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-12">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-2">Dashboard</p>
                            <h1 className="font-sans text-3xl font-bold mb-1">Welcome back, {user.name}</h1>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-sand-400/10 text-sand-600 dark:text-sand-400">
                                {user.role}
                            </span>
                        </div>
                        {isCreative && (
                            <Link to="/jobs"><Button variant="outline" className="gap-2 text-sm">
                                <Briefcase className="h-4 w-4" strokeWidth={1.5} /> Browse Jobs
                            </Button></Link>
                        )}
                        {(isClient || isAdmin) && (
                            <Link to="/jobs/post"><Button className="gap-2 text-sm">
                                <PlusCircle className="h-4 w-4" strokeWidth={1.5} /> Post a Job
                            </Button></Link>
                        )}
                    </div>

                    {/* ── CREATIVE DASHBOARD ── */}
                    {isCreative && (
                        <div className="space-y-8">
                            {/* Stats row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Connects */}
                                <div className="border border-border rounded-lg p-6 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                                        <Zap className="h-4 w-4 text-sand-500" strokeWidth={1.5} fill="currentColor" />
                                        Connects Balance
                                    </div>
                                    <div className="text-4xl font-sans font-bold text-sand-600 dark:text-sand-400">{connects}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Used to apply to jobs</p>
                                </div>

                                {/* Applications */}
                                <div className="border border-border rounded-lg p-6 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                                        <Briefcase className="h-4 w-4" strokeWidth={1.5} />
                                        Applications Sent
                                    </div>
                                    <div className="text-4xl font-sans font-bold">{myApplications.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {myApplications.filter(a => a.status === 'accepted').length} accepted
                                    </p>
                                </div>

                                {/* Verification */}
                                <div className={`border rounded-lg p-6 bg-card ${isVerified ? 'border-green-200 dark:border-green-800'
                                    : myRequest?.status === 'pending' ? 'border-sand-200 dark:border-sand-700'
                                        : 'border-border'
                                    }`}>
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                                        {isVerified
                                            ? <CheckCircle2 className="h-4 w-4 text-green-600" strokeWidth={1.5} />
                                            : myRequest?.status === 'pending'
                                                ? <Clock className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                                : myRequest?.status === 'denied'
                                                    ? <XCircle className="h-4 w-4 text-red-500" strokeWidth={1.5} />
                                                    : <ShieldCheck className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                        }
                                        Verification
                                    </div>
                                    <div className={`text-base font-semibold mb-1 ${isVerified ? 'text-green-700 dark:text-green-400'
                                        : myRequest?.status === 'pending' ? 'text-sand-700 dark:text-sand-400'
                                            : myRequest?.status === 'denied' ? 'text-red-700 dark:text-red-400'
                                                : 'text-muted-foreground'
                                        }`}>
                                        {isVerified ? 'Verified ✓'
                                            : myRequest?.status === 'pending' ? 'Under Review'
                                                : myRequest?.status === 'denied' ? 'Request Denied'
                                                    : 'Not Verified'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {isVerified ? 'You can apply to any job'
                                            : myRequest?.status === 'pending' ? 'Admin will review your request'
                                                : myRequest?.status === 'denied' ? 'You may resubmit a new request'
                                                    : 'Request verification to apply to jobs'}
                                    </p>
                                    {!isVerified && myRequest?.status !== 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-3 w-full text-xs"
                                            onClick={() => { setShowRequestForm(true); setRequestSent(false); setRequestMsg(''); }}
                                        >
                                            {myRequest?.status === 'denied' ? 'Resubmit Verification Request' : 'Request Verification'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Verification Request Form */}
                            {showRequestForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-border rounded-lg p-6 bg-card space-y-4"
                                >
                                    <h3 className="font-sans font-semibold text-lg flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                        Request Verification
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tell us a bit about yourself and why you'd like to be verified.
                                    </p>
                                    <textarea
                                        className="w-full border border-border rounded-md px-4 py-3 text-sm bg-background resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400"
                                        rows={4}
                                        placeholder="E.g. I'm a professional wedding photographer and videographer based in Tunis with 5 years of experience…"
                                        value={requestMsg}
                                        onChange={e => setRequestMsg(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" size="sm" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                                        <Button size="sm" onClick={handleRequestSubmit} disabled={!requestMsg.trim()}>
                                            Submit Request
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                            {requestSent && (
                                <div className="border border-sand-200 dark:border-sand-800 rounded-lg p-4 bg-sand-50 dark:bg-sand-900/10 text-sm text-sand-700 dark:text-sand-400 flex items-center gap-2">
                                    <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                                    Your verification request has been submitted. The admin will review it shortly.
                                </div>
                            )}

                            {/* My Applications */}
                            <div>
                                <h2 className="font-sans font-semibold text-lg mb-4">My Applications</h2>
                                {myApplications.length === 0 ? (
                                    <div className="border border-border rounded-lg p-12 text-center text-muted-foreground bg-card">
                                        <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-20" strokeWidth={1.2} />
                                        <p className="font-medium text-sm">No applications yet</p>
                                        <p className="text-xs mt-1">Browse jobs and start applying with your Connects.</p>
                                        <Link to="/jobs" className="mt-4 inline-block">
                                            <Button variant="outline" size="sm">Browse Jobs</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {myApplications.map(app => {
                                            const job = jobs.find(j => j.id === app.jobId);
                                            return (
                                                <motion.div
                                                    key={app.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="border border-border rounded-lg p-4 bg-card flex items-start gap-4 card-hover"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-medium text-sm truncate">{job?.title ?? 'Job removed'}</span>
                                                            <StatusBadge status={app.status} />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Proposed: <span className="font-medium text-foreground">${app.proposedPrice}</span> ·
                                                            Applied {formatDate(app.createdAt)}
                                                        </p>
                                                        {app.coverLetter && (
                                                            <p className="text-xs text-muted-foreground mt-1.5 italic line-clamp-1">"{app.coverLetter}"</p>
                                                        )}
                                                    </div>
                                                    {job && (
                                                        <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                                                            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                                                        </Link>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Connects Info */}
                            <div className="border border-border rounded-lg p-6 bg-card">
                                <h2 className="font-sans font-semibold mb-3 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-sand-500" strokeWidth={1.5} fill="currentColor" />
                                    About Connects
                                </h2>
                                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                    <li>Each job lists how many Connects it costs to apply</li>
                                    <li>New creatives receive {20} free Connects</li>
                                    <li>Connects are deducted when you submit an application</li>
                                    <li>Paid Connects packages coming soon</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ── CLIENT / ADMIN DASHBOARD ── */}
                    {(isClient || isAdmin) && (
                        <div className="space-y-8">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-border rounded-lg p-6 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                                        <Briefcase className="h-4 w-4" strokeWidth={1.5} />
                                        Jobs Posted
                                    </div>
                                    <div className="text-4xl font-sans font-bold">{myJobs.length}</div>
                                </div>
                                <div className="border border-border rounded-lg p-6 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" strokeWidth={1.5} />
                                        Total Applicants
                                    </div>
                                    <div className="text-4xl font-sans font-bold">{myJobs.reduce((s, j) => s + j.applicantCount, 0)}</div>
                                </div>
                            </div>

                            {/* My Jobs */}
                            <div>
                                <h2 className="font-sans font-semibold text-lg mb-4">My Posted Jobs</h2>
                                {myJobs.length === 0 ? (
                                    <div className="border border-border rounded-lg p-12 text-center text-muted-foreground bg-card">
                                        <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-20" strokeWidth={1.2} />
                                        <p className="font-medium text-sm">No jobs posted yet</p>
                                        <Link to="/jobs/post" className="mt-4 inline-block">
                                            <Button size="sm">Post Your First Job</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {myJobs.map(job => {
                                            const apps = getJobApplications(job.id);
                                            return (
                                                <motion.div
                                                    key={job.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="border border-border rounded-lg p-4 bg-card flex items-start gap-4 card-hover"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-medium text-sm truncate">{job.title}</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium border
                                                                ${job.status === 'open' ? 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800' : 'text-muted-foreground bg-muted border-border'}`}>
                                                                {job.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Budget: <span className="font-medium text-foreground">${job.budget}</span> ·
                                                            <span className="ml-1">{apps.length} applicant{apps.length !== 1 ? 's' : ''}</span> ·
                                                            Deadline {formatDate(job.deadline)}
                                                        </p>
                                                    </div>
                                                    <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                                                        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
