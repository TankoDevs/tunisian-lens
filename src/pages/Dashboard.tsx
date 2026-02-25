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
        pending: { icon: AlertCircle, label: 'Pending', cls: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800' },
        accepted: { icon: CheckCircle2, label: 'Accepted', cls: 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800' },
        rejected: { icon: XCircle, label: 'Rejected', cls: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800' },
    }[status];
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${config.cls}`}>
            <Icon className="h-3 w-3" strokeWidth={2} />
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
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-muted-foreground">
                <p className="text-lg font-medium">Please log in to view your dashboard</p>
                <Link to="/login"><Button>Log In</Button></Link>
            </div>
        );
    }

    const connects = getConnects(user.id);
    const myApplications = getMyApplications();
    const myJobs = jobs.filter(j => j.clientId === user.id);

    const isPhotographer = user.role === 'photographer';
    const isClient = user.role === 'client';
    const isAdmin = user.role === 'admin';

    // Verification status
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
        <div className="min-h-screen bg-background py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <h1 className="font-serif text-3xl font-bold mb-0.5">Dashboard</h1>
                            <p className="text-muted-foreground text-sm">
                                Welcome back, <span className="font-medium text-foreground">{user.name}</span> ·
                                <span className="ml-1 text-xs uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{user.role}</span>
                            </p>
                        </div>
                        {isPhotographer && (
                            <Link to="/jobs"><Button variant="outline" className="gap-2">
                                <Briefcase className="h-4 w-4" strokeWidth={2} /> Browse Jobs
                            </Button></Link>
                        )}
                        {(isClient || isAdmin) && (
                            <Link to="/jobs/post"><Button className="gap-2">
                                <PlusCircle className="h-4 w-4" strokeWidth={2} /> Post a Job
                            </Button></Link>
                        )}
                    </div>

                    {/* ── PHOTOGRAPHER DASHBOARD ── */}
                    {isPhotographer && (
                        <div className="space-y-6">
                            {/* Stats row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Connects card */}
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <Zap className="h-4 w-4 text-amber-500" strokeWidth={2} fill="currentColor" />
                                        Connects Balance
                                    </div>
                                    <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{connects}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Used to apply to jobs</p>
                                </div>

                                {/* Applications count */}
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <Briefcase className="h-4 w-4" strokeWidth={2} />
                                        Applications Sent
                                    </div>
                                    <div className="text-4xl font-bold">{myApplications.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {myApplications.filter(a => a.status === 'accepted').length} accepted
                                    </p>
                                </div>

                                {/* Verification */}
                                <div className={`border rounded-2xl p-5 bg-card col-span-1 sm:col-span-1 ${isVerified ? 'border-green-300 dark:border-green-700'
                                    : myRequest?.status === 'pending' ? 'border-blue-300 dark:border-blue-700'
                                        : myRequest?.status === 'denied' ? 'border-red-300 dark:border-red-700'
                                            : 'border-amber-300 dark:border-amber-700'
                                    }`}>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        {isVerified
                                            ? <CheckCircle2 className="h-4 w-4 text-green-600" strokeWidth={2} />
                                            : myRequest?.status === 'pending'
                                                ? <Clock className="h-4 w-4 text-blue-500" strokeWidth={2} />
                                                : myRequest?.status === 'denied'
                                                    ? <XCircle className="h-4 w-4 text-red-500" strokeWidth={2} />
                                                    : <ShieldCheck className="h-4 w-4 text-amber-500" strokeWidth={2} />
                                        }
                                        Verification
                                    </div>
                                    <div className={`text-base font-bold mb-1 ${isVerified ? 'text-green-700 dark:text-green-400'
                                        : myRequest?.status === 'pending' ? 'text-blue-700 dark:text-blue-400'
                                            : myRequest?.status === 'denied' ? 'text-red-700 dark:text-red-400'
                                                : 'text-amber-700 dark:text-amber-400'
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
                                            onClick={() => { setShowRequestForm(true); setRequestSent(false); }}
                                        >
                                            Request Verification
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Verification Request Form */}
                            {showRequestForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border rounded-2xl p-5 bg-card space-y-3"
                                >
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2} />
                                        Request Verification
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tell us a bit about yourself and why you'd like to be verified.
                                    </p>
                                    <textarea
                                        className="w-full border rounded-xl px-3 py-2.5 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        rows={4}
                                        placeholder="E.g. I'm a professional wedding photographer based in Tunis with 5 years of experience…"
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
                                <div className="border border-blue-300 dark:border-blue-700 rounded-2xl p-4 bg-blue-50 dark:bg-blue-950/20 text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                    <Clock className="h-4 w-4 shrink-0" strokeWidth={2} />
                                    Your verification request has been submitted. The admin will review it shortly.
                                </div>
                            )}

                            {/* My Applications */}
                            <div>
                                <h2 className="font-semibold text-lg mb-3">My Applications</h2>
                                {myApplications.length === 0 ? (
                                    <div className="border rounded-2xl p-8 text-center text-muted-foreground bg-card">
                                        <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                                        <p className="font-medium">No applications yet</p>
                                        <p className="text-sm mt-1">Browse jobs and start applying with your Connects.</p>
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
                                                    className="border rounded-xl p-4 bg-card flex items-start gap-4"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-medium text-sm truncate">{job?.title ?? 'Job removed'}</span>
                                                            <StatusBadge status={app.status} />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Proposed: <span className="font-semibold text-foreground">${app.proposedPrice}</span> ·
                                                            Applied {formatDate(app.createdAt)}
                                                        </p>
                                                        {app.coverLetter && (
                                                            <p className="text-xs text-muted-foreground mt-1.5 italic line-clamp-1">"{app.coverLetter}"</p>
                                                        )}
                                                    </div>
                                                    {job && (
                                                        <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                                                            <ChevronRight className="h-4 w-4" strokeWidth={2} />
                                                        </Link>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Connects Info */}
                            <div className="border rounded-2xl p-5 bg-card">
                                <h2 className="font-semibold mb-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-amber-500" strokeWidth={2} fill="currentColor" />
                                    About Connects
                                </h2>
                                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                                    <li>Each job lists how many Connects it costs to apply</li>
                                    <li>New photographers receive {20} free Connects</li>
                                    <li>Connects are deducted when you submit an application</li>
                                    <li>Paid Connects packages coming soon</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ── CLIENT / ADMIN DASHBOARD ── */}
                    {(isClient || isAdmin) && (
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <Briefcase className="h-4 w-4" strokeWidth={2} />
                                        Jobs Posted
                                    </div>
                                    <div className="text-4xl font-bold">{myJobs.length}</div>
                                </div>
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" strokeWidth={2} />
                                        Total Applicants
                                    </div>
                                    <div className="text-4xl font-bold">{myJobs.reduce((s, j) => s + j.applicantCount, 0)}</div>
                                </div>
                            </div>

                            {/* My Jobs */}
                            <div>
                                <h2 className="font-semibold text-lg mb-3">My Posted Jobs</h2>
                                {myJobs.length === 0 ? (
                                    <div className="border rounded-2xl p-8 text-center text-muted-foreground bg-card">
                                        <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                                        <p className="font-medium">No jobs posted yet</p>
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
                                                    className="border rounded-xl p-4 bg-card flex items-start gap-4"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-medium text-sm truncate">{job.title}</span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border
                                                                ${job.status === 'open' ? 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800' : 'text-muted-foreground bg-muted border-border'}`}>
                                                                {job.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Budget: <span className="font-semibold text-foreground">${job.budget}</span> ·
                                                            <span className="ml-1">{apps.length} applicant{apps.length !== 1 ? 's' : ''}</span> ·
                                                            Deadline {formatDate(job.deadline)}
                                                        </p>
                                                    </div>
                                                    <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                                                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
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
