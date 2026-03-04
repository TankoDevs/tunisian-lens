import { Link } from "react-router-dom";
import { useState } from "react";
import { Zap, Briefcase, ChevronRight, CheckCircle2, XCircle, AlertCircle, PlusCircle, ShieldCheck, Clock, Globe, Tag } from "lucide-react";
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

// ── Style Tags config ──────────────────────────────────────────────────────────
const ALL_STYLE_TAGS = [
    'Street', 'Documentary', 'Black & White', 'Cinematic', 'Wedding', 'Romantic',
    'Fine Art', 'Fashion', 'Editorial', 'Luxury', 'Portrait', 'Commercial',
    'Landscape', 'Aerial', 'Golden Hour', 'Architecture', 'Cityscape', 'Twilight',
    'Food', 'Lifestyle', 'Warm Tones', 'Brand Video', 'Social Media', 'Music Video',
    'Drone', 'Emotional', 'Minimalist', 'Moody', 'Vibrant',
];

function getStoredIntl(userId: string): boolean {
    try { return localStorage.getItem(`tl_intl_${userId}`) === 'true'; } catch { return false; }
}
function setStoredIntl(userId: string, val: boolean) {
    localStorage.setItem(`tl_intl_${userId}`, val ? 'true' : 'false');
}
function getStoredStyleTags(userId: string): string[] {
    try { return JSON.parse(localStorage.getItem(`tl_style_tags_${userId}`) || '[]'); } catch { return []; }
}
function setStoredStyleTags(userId: string, tags: string[]) {
    localStorage.setItem(`tl_style_tags_${userId}`, JSON.stringify(tags));
}

// ── Sub-components ─────────────────────────────────────────────────────────────
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

// ── Main Component ─────────────────────────────────────────────────────────────
export function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const { jobs, getMyApplications, getJobApplications, getConnects } = useMarketplace();
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestMsg, setRequestMsg] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    // International toggle & style tags (creative only)
    const [intlAvailable, setIntlAvailable] = useState(() => user ? getStoredIntl(user.id) : false);
    const [styleTags, setStyleTags] = useState<string[]>(() => user ? getStoredStyleTags(user.id) : []);

    const handleIntlToggle = () => {
        if (!user) return;
        const next = !intlAvailable;
        setIntlAvailable(next);
        setStoredIntl(user.id, next);
    };

    const handleTagToggle = (tag: string) => {
        if (!user) return;
        const next = styleTags.includes(tag) ? styleTags.filter(t => t !== tag) : [...styleTags, tag];
        setStyleTags(next);
        setStoredStyleTags(user.id, next);
    };

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
                                <Link to="/buy-connects" className="block group">
                                    <div className="border border-border rounded-lg p-6 bg-card group-hover:border-[hsl(var(--accent))/40] transition-all duration-300 cursor-pointer">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                                            <Zap className="h-4 w-4 text-sand-500" strokeWidth={1.5} fill="currentColor" />
                                            Connects Balance
                                        </div>
                                        <div className="text-4xl font-sans font-bold text-sand-600 dark:text-sand-400">{connects}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Used to apply to jobs</p>
                                        <p className="text-[10px] text-[hsl(var(--accent))] font-semibold mt-3 flex items-center gap-1">
                                            Buy more →
                                        </p>
                                    </div>
                                </Link>

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

                            {/* Connects Section */}
                            <div className="border border-border rounded-lg p-6 bg-card space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-sans font-semibold flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-sand-500" strokeWidth={1.5} fill="currentColor" />
                                        Connects
                                    </h2>
                                    <Link to="/buy-connects">
                                        <Button size="sm" className="gap-1.5 text-xs h-8">
                                            <Zap className="h-3 w-3" strokeWidth={2} fill="currentColor" />
                                            Buy More
                                        </Button>
                                    </Link>
                                </div>
                                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                    <li>Each job lists how many Connects it costs to apply</li>
                                    <li>New verified creatives receive {20} free Connects</li>
                                    <li>Connects are deducted when you submit an application</li>
                                    <li>Connects never expire once purchased</li>
                                </ul>
                                {/* Mock transaction history */}
                                <div className="pt-3 border-t border-border space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Activity</p>
                                    {[
                                        { type: 'bonus', label: 'Welcome Bonus', amount: +20, date: 'Today' },
                                    ].map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 text-sm">
                                            <div>
                                                <p className="font-medium">{tx.label}</p>
                                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                                            </div>
                                            <span className={`font-semibold text-sm ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount} ⚡
                                            </span>
                                        </div>
                                    ))}
                                    {myApplications.map(app => {
                                        const job = jobs.find(j => j.id === app.jobId);
                                        if (!job) return null;
                                        return (
                                            <div key={app.id} className="flex items-center justify-between py-2 text-sm border-t border-border/50">
                                                <div>
                                                    <p className="font-medium line-clamp-1">Applied: {job.title}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                                <span className="font-semibold text-sm text-red-500">-{job.connectsRequired} ⚡</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── INTERNATIONAL AVAILABILITY TOGGLE ── */}
                            <div className="border border-border rounded-lg p-6 bg-card">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Globe className={`h-5 w-5 flex-shrink-0 ${intlAvailable ? 'text-blue-500' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                                        <div>
                                            <p className="text-sm font-semibold">Available for International Projects</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {intlAvailable ? "Shown on your profile — clients worldwide can see you're open." : 'Toggle on to advertise global availability.'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleIntlToggle}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none border ${intlAvailable ? 'bg-blue-500 border-blue-500' : 'bg-muted border-border'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${intlAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* ── STYLE TAGS ── */}
                            <div className="border border-border rounded-lg p-6 bg-card space-y-4">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                    <h2 className="font-sans font-semibold">Style Tags</h2>
                                </div>
                                <p className="text-xs text-muted-foreground">Select the styles that describe your work. These are shown on your public profile.</p>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_STYLE_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${styleTags.includes(tag)
                                                ? 'bg-foreground text-background border-foreground'
                                                : 'bg-muted text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                {styleTags.length > 0 && (
                                    <p className="text-xs text-muted-foreground">{styleTags.length} tag{styleTags.length !== 1 ? 's' : ''} selected</p>
                                )}
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
