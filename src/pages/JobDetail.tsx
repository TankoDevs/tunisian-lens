import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, Banknote, ShieldCheck, ShieldX, CheckCircle2, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";
import { ConnectsBadge } from "../components/ui/ConnectsBadge";
import { Button } from "../components/ui/button";

function daysUntil(deadline: string): string {
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return 'Expired';
    if (days === 0) return 'Due today';
    return `${days} days left`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function JobDetail() {
    const { id } = useParams<{ id: string }>();
    const { jobs, applyToJob, getJobApplications, getConnects, hasApplied, closeJob } = useMarketplace();
    const { user, isAuthenticated } = useAuth();

    const [coverLetter, setCoverLetter] = useState('');
    const [proposedPrice, setProposedPrice] = useState('');
    const [showApplications, setShowApplications] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const job = jobs.find(j => j.id === id);
    if (!job) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <p className="text-lg font-medium">Job not found</p>
            <Link to="/jobs"><Button variant="outline">Back to Jobs</Button></Link>
        </div>
    );

    const connects = isAuthenticated && user ? getConnects(user.id) : 0;
    const already = isAuthenticated && user ? hasApplied(job.id) : false;
    const applications = getJobApplications(job.id);
    const isOwner = user?.id === job.clientId;
    const { hasAccess } = useTunisianAccess();

    // Check if current user is verified (mock mode check)
    interface MockUser { id: string; email: string; isVerified?: boolean; }
    const mockUsers: MockUser[] = JSON.parse(localStorage.getItem('tunisian_lens_mock_users') || '[]');
    const mockUser = mockUsers.find((u: MockUser) => u.id === user?.id);
    const isVerified = mockUser?.isVerified === true;

    const handleApply = async () => {
        if (!proposedPrice) { setResult({ success: false, message: 'Please enter your proposed price.' }); return; }
        setLoading(true);
        const res = await applyToJob(job.id, coverLetter, parseInt(proposedPrice));
        setResult(res);
        setLoading(false);
    };

    const canApply = isAuthenticated && user?.role === 'photographer' && !already && job.status === 'open';
    const hasEnoughConnects = connects >= job.connectsRequired;

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Back to jobs
                </Link>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wide text-primary/70 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
                                {job.category}
                            </span>
                            {job.status === 'closed' && (
                                <span className="ml-2 text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border">Closed</span>
                            )}
                        </div>
                        <ConnectsBadge count={job.connectsRequired} />
                    </div>
                    <h1 className="font-serif text-3xl font-bold leading-snug mb-1">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                        <span>Posted by <span className="font-medium text-foreground">{job.clientName}</span> · {formatDate(job.createdAt)}</span>
                        {job.verifiedOnly && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <ShieldCheck className="h-3 w-3" strokeWidth={2} /> Verified Only
                            </span>
                        )}
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-sm mb-8">
                        <span className="flex items-center gap-1.5 font-semibold text-foreground">
                            <Banknote className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                            ${job.budget.toLocaleString()} {job.currency}
                        </span>
                        {job.location && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-4 w-4" strokeWidth={2} />
                                {job.location}
                                {job.isRemote && <span className="ml-1 text-xs bg-accent rounded px-1.5 py-0.5">Remote OK</span>}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" strokeWidth={2} />
                            Deadline: {formatDate(job.deadline)} ({daysUntil(job.deadline)})
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="h-4 w-4" strokeWidth={2} />
                            {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm max-w-none text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary/20 pl-4">
                        {job.description}
                    </div>

                    {/* === APPLICATION SECTION === */}
                    <div className="border rounded-2xl p-6 bg-card space-y-4">
                        {/* Owner: View Applications */}
                        {isOwner ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold text-lg">Applications ({applications.length})</h2>
                                    <div className="flex gap-2">
                                        {job.status === 'open' && (
                                            <Button variant="outline" size="sm" onClick={() => closeJob(job.id)}>
                                                Close Job
                                            </Button>
                                        )}
                                        <button
                                            onClick={() => setShowApplications(s => !s)}
                                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                            {showApplications ? <><ChevronUp className="h-3.5 w-3.5" /> Hide</> : <><ChevronDown className="h-3.5 w-3.5" /> View</>}
                                        </button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {showApplications && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3 overflow-hidden"
                                        >
                                            {applications.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No applications yet.</p>
                                            ) : applications.map(app => (
                                                <div key={app.id} className="border rounded-xl p-4 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <img src={app.photographerAvatar} alt={app.photographerName} className="h-8 w-8 rounded-full object-cover" />
                                                        <div>
                                                            <p className="text-sm font-medium">{app.photographerName}</p>
                                                            <p className="text-xs text-muted-foreground">Proposed: <span className="font-semibold text-foreground">${app.proposedPrice}</span></p>
                                                        </div>
                                                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium
                                                            ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                    'bg-amber-100 text-amber-700'}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                    {app.coverLetter && <p className="text-xs text-muted-foreground italic">"{app.coverLetter}"</p>}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : already ? (
                            /* Already applied */
                            <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
                                <div>
                                    <p className="font-semibold">Application submitted</p>
                                    <p className="text-sm text-muted-foreground">The client will review your application shortly.</p>
                                </div>
                            </div>
                        ) : !isAuthenticated ? (
                            /* Not logged in */
                            <div className="text-center space-y-3">
                                <p className="text-sm text-muted-foreground">Log in as a photographer to apply.</p>
                                <div className="flex gap-2 justify-center">
                                    <Link to="/login"><Button variant="outline" size="sm">Log In</Button></Link>
                                    <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
                                </div>
                            </div>
                        ) : !hasAccess ? (
                            /* Logged in but not Tunisian */
                            <div className="flex items-start gap-3 p-4 bg-muted/40 border rounded-xl">
                                <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="font-semibold">Tunisia Marketplace Only</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Applying to jobs is restricted to Tunisian citizens and residents. This marketplace is currently Tunisia-only.
                                    </p>
                                </div>
                            </div>
                        ) : user?.role === 'client' ? (
                            /* Client viewing */
                            <p className="text-sm text-muted-foreground text-center">Client accounts cannot apply to jobs.</p>
                        ) : user?.role === 'photographer' && user?.createdAt && (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24) < 7 ? (
                            /* Account too new */
                            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="font-semibold text-blue-800 dark:text-blue-300">Account Too New</p>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">
                                        Your account must be at least 7 days old to apply.
                                        You can apply in <strong>{Math.ceil(7 - (Date.now() - new Date(user.createdAt!).getTime()) / (1000 * 60 * 60 * 24))} days</strong>.
                                    </p>
                                </div>
                            </div>
                        ) : job.verifiedOnly && !isVerified ? (
                            /* Verified-only job, unverified photographer */
                            <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">Verified Photographers Only</p>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
                                        This client requires a verified photographer.{' '}
                                        <Link to="/dashboard" className="underline font-medium">Request verification →</Link>
                                    </p>
                                </div>
                            </div>
                        ) : !isVerified ? (
                            /* Unverified photographer, general restriction */
                            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <ShieldX className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="font-semibold text-amber-800 dark:text-amber-400">Verification Required</p>
                                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-0.5">
                                        Only verified photographers can apply to jobs.{' '}
                                        <Link to="/dashboard" className="underline font-medium">Request verification →</Link>
                                    </p>
                                </div>
                            </div>
                        ) : job.status === 'closed' ? (
                            /* Job closed */
                            <p className="text-sm text-muted-foreground text-center">This job is no longer accepting applications.</p>
                        ) : (
                            /* Verified photographer: Apply form */
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-green-600" strokeWidth={2} />
                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">You are verified — you can apply</span>
                                </div>

                                {/* Connects cost info */}
                                <div className={`flex items-center justify-between text-sm p-3 rounded-lg border
                                        ${hasEnoughConnects ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'}`}>
                                    <span className={hasEnoughConnects ? 'text-amber-800 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}>
                                        {hasEnoughConnects
                                            ? `Applying costs ${job.connectsRequired} connects. You have ${connects}.`
                                            : `Not enough connects. This job costs ${job.connectsRequired}, you have ${connects}.`}
                                    </span>
                                    <ConnectsBadge count={connects} size="sm" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Your proposed price ($)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={proposedPrice}
                                        onChange={e => setProposedPrice(e.target.value)}
                                        placeholder={`Client budget: $${job.budget}`}
                                        className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Cover letter <span className="text-muted-foreground text-xs">(optional)</span></label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={e => setCoverLetter(e.target.value)}
                                        placeholder="Briefly describe your experience, why you're the right fit, and your availability..."
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                    />
                                </div>

                                {result && (
                                    <div className={`text-sm px-3 py-2 rounded-lg border ${result.success ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'}`}>
                                        {result.message}
                                    </div>
                                )}

                                <Button
                                    onClick={handleApply}
                                    disabled={!hasEnoughConnects || loading || canApply === false}
                                    className="w-full h-11"
                                >
                                    {loading ? 'Submitting...' : `Apply — Use ${job.connectsRequired} Connects`}
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
