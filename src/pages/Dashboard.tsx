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
        <div className="min-h-screen bg-canvas text-alabaster py-12 md:py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre mb-2">Member Workspace</p>
                            <h1 className="font-serif text-3xl md:text-4xl font-normal text-alabaster mb-2">Welcome back, {user.name}</h1>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-surface border border-edge text-ochre">
                                {user.role === 'creative' ? 'Verified Creative' : user.role === 'client' ? 'Commission Partner' : 'Curatorial Director'}
                            </span>
                        </div>
                        {isCreative && (
                            <Link to="/jobs"><Button variant="outline" className="gap-2 text-xs border-edge text-alabaster hover:bg-surface.elevated rounded-xl">
                                <Briefcase className="h-4 w-4" strokeWidth={1.5} /> Browse Briefs
                            </Button></Link>
                        )}
                        {(isClient || isAdmin) && (
                            <Link to="/jobs/post"><Button className="gap-2 text-xs bg-ochre hover:bg-ochre/90 text-canvas font-semibold border-none rounded-xl">
                                <PlusCircle className="h-4 w-4" strokeWidth={1.5} /> Post Assignment
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
                                    <div className="border border-edge rounded-2xl p-6 bg-surface group-hover:border-ochre/50 transition-all duration-300 cursor-pointer shadow-sm">
                                        <div className="flex items-center gap-2 text-mist text-xs mb-3">
                                            <Zap className="h-4 w-4 text-ochre" strokeWidth={1.5} fill="currentColor" />
                                            Connects Balance
                                        </div>
                                        <div className="text-4xl font-mono font-medium text-ochre">{connects}</div>
                                        <p className="text-xs text-mist mt-1 font-light">Allocated proposal credits</p>
                                        <p className="text-[10px] text-ochre font-semibold uppercase tracking-wider mt-3 flex items-center gap-1">
                                            Acquire credits →
                                        </p>
                                    </div>
                                </Link>

                                {/* Applications */}
                                <div className="border border-edge rounded-2xl p-6 bg-surface shadow-sm">
                                    <div className="flex items-center gap-2 text-mist text-xs mb-3">
                                        <Briefcase className="h-4 w-4 text-sidi.azure" strokeWidth={1.5} />
                                        Proposals Dispatched
                                    </div>
                                    <div className="text-4xl font-mono font-medium text-alabaster">{myApplications.length}</div>
                                    <p className="text-xs text-mist mt-1 font-light">
                                        {myApplications.filter(a => a.status === 'accepted').length} accepted commissions
                                    </p>
                                </div>

                                {/* Verification */}
                                <div className={`border rounded-2xl p-6 bg-surface shadow-sm ${isVerified ? 'border-emerald-500/30'
                                    : myRequest?.status === 'pending' ? 'border-ochre/30'
                                        : 'border-edge'
                                    }`}>
                                    <div className="flex items-center gap-2 text-mist text-xs mb-3">
                                        {isVerified
                                            ? <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
                                            : myRequest?.status === 'pending'
                                                ? <Clock className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                                : myRequest?.status === 'denied'
                                                    ? <XCircle className="h-4 w-4 text-red-400" strokeWidth={1.5} />
                                                    : <ShieldCheck className="h-4 w-4 text-mist" strokeWidth={1.5} />
                                        }
                                        Curatorial Status
                                    </div>
                                    <div className={`text-base font-semibold mb-1 ${isVerified ? 'text-emerald-400'
                                        : myRequest?.status === 'pending' ? 'text-ochre'
                                            : myRequest?.status === 'denied' ? 'text-red-400'
                                                : 'text-mist'
                                        }`}>
                                        {isVerified ? 'Verified Creative ✓'
                                            : myRequest?.status === 'pending' ? 'Under Curatorial Review'
                                                : myRequest?.status === 'denied' ? 'Review Rejected'
                                                    : 'Unverified Account'}
                                    </div>
                                    <p className="text-xs text-mist font-light">
                                        {isVerified ? 'Eligible for all national briefs'
                                            : myRequest?.status === 'pending' ? 'Board reviewing submitted folio'
                                                : myRequest?.status === 'denied' ? 'Folio may be resubmitted'
                                                    : 'Submit verification to file proposals'}
                                    </p>
                                    {!isVerified && myRequest?.status !== 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-3 w-full text-xs border-edge text-alabaster hover:bg-surface.elevated rounded-xl"
                                            onClick={() => { setShowRequestForm(true); setRequestSent(false); setRequestMsg(''); }}
                                        >
                                            {myRequest?.status === 'denied' ? 'Resubmit Verification' : 'Request Verification'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Verification Request Form */}
                            {showRequestForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-edge rounded-2xl p-6 bg-surface space-y-4"
                                >
                                    <h3 className="font-serif text-lg font-normal text-alabaster flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                        Curatorial Verification Application
                                    </h3>
                                    <p className="text-xs text-mist">
                                        Please summarize your photographic background, recent editorial or commercial publications, and web portfolio link.
                                    </p>
                                    <textarea
                                        className="w-full border border-edge rounded-xl px-4 py-3 text-xs bg-surface.elevated text-alabaster resize-none focus:outline-none focus:border-ochre placeholder:text-mist/40"
                                        rows={4}
                                        placeholder="E.g. Documentarian & architectural photographer based in Tunis with 6 years experience covering the Medina and Djerba..."
                                        value={requestMsg}
                                        onChange={e => setRequestMsg(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" size="sm" className="text-xs text-mist hover:text-alabaster" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                                        <Button size="sm" className="text-xs bg-ochre hover:bg-ochre/90 text-canvas font-semibold border-none rounded-xl" onClick={handleRequestSubmit} disabled={!requestMsg.trim()}>
                                            Submit Folio
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                            {requestSent && (
                                <div className="border border-ochre/30 rounded-2xl p-4 bg-ochre/10 text-xs text-ochre flex items-center gap-2">
                                    <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                                    Your portfolio submission has been lodged. The curatorial team will inspect your credentials shortly.
                                </div>
                            )}

                            {/* My Applications */}
                            <div className="space-y-4">
                                <h2 className="font-serif text-xl font-normal text-alabaster">Dispatched Proposals</h2>
                                {myApplications.length === 0 ? (
                                    <div className="border border-edge rounded-2xl p-12 text-center text-mist bg-surface">
                                        <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-30 text-ochre" strokeWidth={1.2} />
                                        <p className="font-medium text-sm text-alabaster">No proposals active</p>
                                        <p className="text-xs mt-1 text-mist">Browse active production briefs and submit treatments using your Connects.</p>
                                        <Link to="/jobs" className="mt-4 inline-block">
                                            <Button variant="outline" size="sm" className="border-edge text-alabaster hover:bg-surface.elevated rounded-xl">Browse Briefs</Button>
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
                                                    className="border border-edge rounded-2xl p-5 bg-surface flex items-start gap-4 hover:border-ochre/40 transition-all"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                                                            <span className="font-medium text-sm text-alabaster truncate">{job?.title ?? 'Brief closed'}</span>
                                                            <StatusBadge status={app.status} />
                                                        </div>
                                                        <p className="text-xs text-mist">
                                                            Proposed: <span className="font-mono text-ochre font-medium">${app.proposedPrice}</span> ·
                                                            Filed {formatDate(app.createdAt)}
                                                        </p>
                                                        {app.coverLetter && (
                                                            <p className="text-xs text-mist/80 mt-1.5 italic line-clamp-1">"{app.coverLetter}"</p>
                                                        )}
                                                    </div>
                                                    {job && (
                                                        <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-mist hover:text-ochre transition-colors">
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
                            <div className="border border-edge rounded-2xl p-6 bg-surface space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-serif text-lg font-normal text-alabaster flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-ochre" strokeWidth={1.5} fill="currentColor" />
                                        Connects Ledger &amp; Terms
                                    </h2>
                                    <Link to="/buy-connects">
                                        <Button size="sm" className="gap-1.5 text-xs h-8 bg-ochre hover:bg-ochre/90 text-canvas font-semibold border-none rounded-xl">
                                            <Zap className="h-3 w-3" strokeWidth={2} fill="currentColor" />
                                            Acquire Credits
                                        </Button>
                                    </Link>
                                </div>
                                <ul className="text-xs text-mist space-y-2 list-disc list-inside font-light">
                                    <li>Each assignment brief displays its required proposal connects threshold</li>
                                    <li>Newly verified Tunisian photographers receive 20 complimentary bonus Connects</li>
                                    <li>Connects are deducted upon transmitting a treatment to client review</li>
                                    <li>Acquired Connects remain permanently valid without expiration</li>
                                </ul>
                                {/* Mock transaction history */}
                                <div className="pt-3 border-t border-edge space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-mist/60 mb-3">Recent Transactions</p>
                                    {[
                                        { type: 'bonus', label: 'Welcome Creative Allocation', amount: +20, date: 'Account Activation' },
                                    ].map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 text-xs">
                                            <div>
                                                <p className="font-medium text-alabaster">{tx.label}</p>
                                                <p className="text-[10px] text-mist">{tx.date}</p>
                                            </div>
                                            <span className="font-mono font-medium text-xs text-emerald-400">
                                                +{tx.amount} ⚡
                                            </span>
                                        </div>
                                    ))}
                                    {myApplications.map(app => {
                                        const job = jobs.find(j => j.id === app.jobId);
                                        if (!job) return null;
                                        return (
                                            <div key={app.id} className="flex items-center justify-between py-2 text-xs border-t border-edge">
                                                <div>
                                                    <p className="font-medium text-alabaster line-clamp-1">Applied: {job.title}</p>
                                                    <p className="text-[10px] text-mist">{new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                                <span className="font-mono font-medium text-xs text-red-400">-{job.connectsRequired} ⚡</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── INTERNATIONAL AVAILABILITY TOGGLE ── */}
                            <div className="border border-edge rounded-2xl p-6 bg-surface">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Globe className={`h-5 w-5 flex-shrink-0 ${intlAvailable ? 'text-sidi.azure' : 'text-mist'}`} strokeWidth={1.5} />
                                        <div>
                                            <p className="text-sm font-semibold text-alabaster">Available for International Assignments</p>
                                            <p className="text-xs text-mist mt-0.5">
                                                {intlAvailable ? "Active on public directory — European and overseas agencies can commission you." : 'Toggle on to advertise worldwide commission availability.'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleIntlToggle}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none border ${intlAvailable ? 'bg-sidi.azure border-sidi.azure' : 'bg-surface.elevated border-edge'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${intlAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* ── STYLE TAGS ── */}
                            <div className="border border-edge rounded-2xl p-6 bg-surface space-y-4">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                    <h2 className="font-serif text-lg font-normal text-alabaster">Visual Disciplines &amp; Style Descriptors</h2>
                                </div>
                                <p className="text-xs text-mist">Select photographic aesthetics that reflect your body of work to enhance search discovery.</p>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_STYLE_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all duration-200 ${styleTags.includes(tag)
                                                ? 'bg-ochre text-canvas border-ochre font-semibold shadow-sm'
                                                : 'bg-surface.elevated text-mist border-edge hover:border-ochre/40 hover:text-alabaster'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                {styleTags.length > 0 && (
                                    <p className="text-xs text-ochre font-mono">{styleTags.length} descriptor{styleTags.length !== 1 ? 's' : ''} active</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── CLIENT / ADMIN DASHBOARD ── */}
                    {(isClient || isAdmin) && (
                        <div className="space-y-8">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-edge rounded-2xl p-6 bg-surface shadow-sm">
                                    <div className="flex items-center gap-2 text-mist text-xs mb-3">
                                        <Briefcase className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                        Commission Briefs Published
                                    </div>
                                    <div className="text-4xl font-mono font-medium text-alabaster">{myJobs.length}</div>
                                </div>
                                <div className="border border-edge rounded-2xl p-6 bg-surface shadow-sm">
                                    <div className="flex items-center gap-2 text-mist text-xs mb-3">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
                                        Total Treatments Received
                                    </div>
                                    <div className="text-4xl font-mono font-medium text-ochre">{myJobs.reduce((s, j) => s + j.applicantCount, 0)}</div>
                                </div>
                            </div>

                            {/* My Jobs */}
                            <div className="space-y-4">
                                <h2 className="font-serif text-xl font-normal text-alabaster">My Published Assignments</h2>
                                {myJobs.length === 0 ? (
                                    <div className="border border-edge rounded-2xl p-12 text-center text-mist bg-surface">
                                        <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-30 text-ochre" strokeWidth={1.2} />
                                        <p className="font-medium text-sm text-alabaster">No published briefs</p>
                                        <Link to="/jobs/post" className="mt-4 inline-block">
                                            <Button size="sm" className="bg-ochre hover:bg-ochre/90 text-canvas font-semibold border-none rounded-xl">Post Your First Assignment</Button>
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
                                                    className="border border-edge rounded-2xl p-5 bg-surface flex items-start gap-4 hover:border-ochre/40 transition-all"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                                                            <span className="font-medium text-sm text-alabaster truncate">{job.title}</span>
                                                            <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold uppercase tracking-wider border
                                                                ${job.status === 'open' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-mist bg-surface.elevated border-edge'}`}>
                                                                {job.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-mist">
                                                            Budget: <span className="font-mono text-ochre font-medium">${job.budget}</span> ·
                                                            <span className="ml-1">{apps.length} treatment{apps.length !== 1 ? 's' : ''}</span> ·
                                                            Deadline {formatDate(job.deadline)}
                                                        </p>
                                                    </div>
                                                    <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-mist hover:text-ochre transition-colors">
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
