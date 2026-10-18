import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
    Zap, Briefcase, ChevronRight, CheckCircle2, XCircle, AlertCircle,
    PlusCircle, ShieldCheck, Clock, Globe, Tag, Image, Download,
    Layers, Sparkles, SlidersHorizontal, Lock, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    if (!userId) return false;
    try { return localStorage.getItem(`tl_intl_${userId}`) === 'true'; } catch { return false; }
}
function setStoredIntl(userId: string, val: boolean) {
    if (!userId) return;
    localStorage.setItem(`tl_intl_${userId}`, val ? 'true' : 'false');
}
function getStoredStyleTags(userId: string): string[] {
    if (!userId) return [];
    try { return JSON.parse(localStorage.getItem(`tl_style_tags_${userId}`) || '[]'); } catch { return []; }
}
function setStoredStyleTags(userId: string, tags: string[]) {
    if (!userId) return;
    localStorage.setItem(`tl_style_tags_${userId}`, JSON.stringify(tags));
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'pending' | 'accepted' | 'rejected' }) {
    const config = {
        pending: { icon: AlertCircle, label: 'Pending Review', cls: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
        accepted: { icon: CheckCircle2, label: 'Commission Accepted', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
        rejected: { icon: XCircle, label: 'Declined', cls: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    }[status] || { icon: AlertCircle, label: status, cls: 'text-mist bg-surface border-edge' };
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${config.cls}`}>
            <Icon className="h-3 w-3" strokeWidth={1.5} />
            {config.label}
        </span>
    );
}

function formatDate(iso?: string): string {
    if (!iso) return 'Recent';
    try {
        const d = new Date(iso);
        return isNaN(d.getTime()) ? 'Recent' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return 'Recent';
    }
}

type TabType = 'overview' | 'proposals' | 'connects' | 'wallpapers' | 'settings';

// ── Main Component ─────────────────────────────────────────────────────────────
export function Dashboard() {
    const { user, isAuthenticated, isLoading, switchRole } = useAuth();
    const { jobs, getMyApplications, getJobApplications, getConnects } = useMarketplace();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestMsg, setRequestMsg] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    // International toggle & style tags (creative only)
    const [intlAvailable, setIntlAvailable] = useState<boolean>(() => user ? getStoredIntl(user.id) : false);
    const [styleTags, setStyleTags] = useState<string[]>(() => user ? getStoredStyleTags(user.id) : []);
    const [prevUserId, setPrevUserId] = useState<string | null>(user?.id || null);

    if (user?.id && user.id !== prevUserId) {
        setPrevUserId(user.id);
        setIntlAvailable(getStoredIntl(user.id));
        setStyleTags(getStoredStyleTags(user.id));
    }

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

    // 1. Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-canvas text-alabaster flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center p-6">
                    <div className="w-10 h-10 rounded-full border-2 border-ochre border-t-transparent animate-spin" />
                    <p className="text-xs font-mono uppercase tracking-widest text-ochre">Hydrating Archival Studio...</p>
                    <p className="text-xs text-mist font-light">Authenticating session credentials</p>
                </div>
            </div>
        );
    }

    // 2. Unauthenticated state
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-canvas text-alabaster flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full border border-edge rounded-3xl p-8 bg-surface space-y-6 shadow-2xl"
                >
                    <div className="w-14 h-14 rounded-2xl bg-ochre/10 border border-ochre/25 flex items-center justify-center mx-auto text-ochre shadow-inner">
                        <Briefcase className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ochre block">Archival Authentication</span>
                        <h2 className="text-2xl md:text-3xl font-serif text-alabaster tracking-tight">Member Access Required</h2>
                        <p className="text-xs text-mist leading-relaxed font-light">
                            Sign in to access your portfolio management, dispatched proposals, connects balance, and digital wallpaper studio.
                        </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <Link to="/login" state={{ from: location }} className="flex-1">
                            <Button className="w-full bg-ochre hover:bg-ochre-light text-canvas font-mono text-xs uppercase tracking-wider rounded-xl h-11">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/signup" state={{ from: location }} className="flex-1">
                            <Button variant="outline" className="w-full border-edge text-alabaster hover:bg-surface-elevated font-mono text-xs uppercase tracking-wider rounded-xl h-11">
                                Join Archive
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const connects = typeof getConnects(user.id) === 'number' ? getConnects(user.id) : 20;
    const myApplications = getMyApplications() || [];
    const myJobs = (jobs || []).filter(j => j.clientId === user.id || (user.id === 'demo-client-1' && j.clientId === 'client-2'));

    const isCreative = user.role === 'creative';
    const isClient = user.role === 'client';
    const isAdmin = user.role === 'admin';
    const isVisitor = user.role === 'visitor';

    const isVerified = isArtistVerified(user.id);
    const allRequests: VerificationRequest[] = getVerificationRequests() || [];
    const myRequest = allRequests.find(r => r.userId === user.id);

    const handleRequestSubmit = () => {
        if (!requestMsg.trim()) return;
        submitVerificationRequest(user.id, user.name, user.email, requestMsg.trim());
        setShowRequestForm(false);
        setRequestSent(true);
    };

    const roleBadgeText = isCreative
        ? 'Verified Creative'
        : isClient
            ? 'Commission Partner'
            : isAdmin
                ? 'Curatorial Director'
                : 'Archival Collector';

    return (
        <div className="min-h-screen bg-canvas text-alabaster py-10 md:py-14">
            <div className="container mx-auto px-6 max-w-5xl space-y-8">
                {/* ── HEADER & WORKSPACE GREETING ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-edge rounded-3xl p-6 md:p-8 bg-surface relative overflow-hidden shadow-sm"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-ochre">Member Workspace</span>
                                <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-ochre/10 border border-ochre/30 text-ochre">
                                    {roleBadgeText}
                                </span>
                                {isVerified && (
                                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Folio Certified
                                    </span>
                                )}
                            </div>
                            <h1 className="font-serif text-3xl md:text-4xl text-alabaster tracking-tight font-normal">
                                Welcome back, {user.name}
                            </h1>
                            <p className="text-xs text-mist font-light">
                                {user.email} · {user.country || 'Tunisia'} · Active Session
                            </p>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            {isCreative && (
                                <>
                                    <Link to={`/artist/${user.id}`}>
                                        <Button variant="outline" size="sm" className="gap-2 text-xs border-edge text-alabaster hover:bg-surface-elevated rounded-xl h-10">
                                            <ArrowUpRight className="h-4 w-4" /> View Public Folio
                                        </Button>
                                    </Link>
                                    <Link to="/jobs">
                                        <Button size="sm" className="gap-2 text-xs bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl h-10">
                                            <Briefcase className="h-4 w-4" /> Browse Briefs
                                        </Button>
                                    </Link>
                                </>
                            )}
                            {(isClient || isAdmin) && (
                                <Link to="/jobs/post">
                                    <Button size="sm" className="gap-2 text-xs bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl h-10">
                                        <PlusCircle className="h-4 w-4" /> Post Assignment
                                    </Button>
                                </Link>
                            )}
                            {isVisitor && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() => switchRole('creative')}
                                        className="gap-2 text-xs bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl h-10"
                                    >
                                        <Sparkles className="h-4 w-4" /> Activate Creative Folio
                                    </Button>
                                    <Link to="/explore">
                                        <Button variant="outline" size="sm" className="gap-2 text-xs border-edge text-alabaster hover:bg-surface-elevated rounded-xl h-10">
                                            <Image className="h-4 w-4" /> Explore Archive
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Quick Role Switcher (Allows testing & dual-role workflow effortlessly) */}
                    <div className="mt-6 pt-5 border-t border-edge/60 flex items-center justify-between flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-2 text-mist text-[11px] font-mono">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-ochre" />
                            <span>Workspace Perspective:</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-canvas border border-edge">
                            {(['creative', 'client', 'visitor'] as const).map(r => (
                                <button
                                    key={r}
                                    onClick={() => switchRole(r)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                                        user.role === r
                                            ? 'bg-ochre text-canvas font-bold shadow-sm'
                                            : 'text-mist hover:text-alabaster hover:bg-surface-elevated'
                                    }`}
                                >
                                    {r === 'creative' ? 'Creative' : r === 'client' ? 'Client' : 'Collector'}
                                </button>
                            ))}
                            {user.role === 'admin' && (
                                <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-ochre font-bold">
                                    Admin
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── WORKSPACE TABS ── */}
                <div className="flex items-center gap-2 border-b border-edge overflow-x-auto pb-1 text-xs font-mono uppercase tracking-wider">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 font-medium flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'overview'
                                ? 'border-ochre text-ochre bg-surface/50'
                                : 'border-transparent text-mist hover:text-alabaster'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('proposals')}
                        className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 font-medium flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'proposals'
                                ? 'border-ochre text-ochre bg-surface/50'
                                : 'border-transparent text-mist hover:text-alabaster'
                        }`}
                    >
                        <Briefcase className="w-3.5 h-3.5" />
                        {isClient ? 'Published Briefs' : 'Proposals & Assignments'}
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-edge text-mist">
                            {isClient ? myJobs.length : myApplications.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('connects')}
                        className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 font-medium flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'connects'
                                ? 'border-ochre text-ochre bg-surface/50'
                                : 'border-transparent text-mist hover:text-alabaster'
                        }`}
                    >
                        <Zap className="w-3.5 h-3.5" fill="currentColor" /> Connects Ledger
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-ochre/20 text-ochre">
                            {connects}⚡
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('wallpapers')}
                        className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 font-medium flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'wallpapers'
                                ? 'border-ochre text-ochre bg-surface/50'
                                : 'border-transparent text-mist hover:text-alabaster'
                        }`}
                    >
                        <Download className="w-3.5 h-3.5" /> Wallpapers &amp; RAW
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 font-medium flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'settings'
                                ? 'border-ochre text-ochre bg-surface/50'
                                : 'border-transparent text-mist hover:text-alabaster'
                        }`}
                    >
                        <Lock className="w-3.5 h-3.5" /> Account &amp; Security
                    </button>
                </div>

                {/* ── TAB 1: OVERVIEW ── */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Connects Card */}
                            <Link to="/buy-connects" className="block group">
                                <div className="border border-edge rounded-2xl p-5 bg-surface group-hover:border-ochre/50 transition-all duration-300 shadow-sm h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between text-mist text-xs mb-2">
                                            <span className="font-mono uppercase tracking-wider text-[10px]">Credits</span>
                                            <Zap className="h-4 w-4 text-ochre" strokeWidth={1.5} fill="currentColor" />
                                        </div>
                                        <div className="text-3xl font-mono font-medium text-ochre">{connects}</div>
                                        <p className="text-xs text-mist mt-1 font-light">Proposal allocation tokens</p>
                                    </div>
                                    <p className="text-[10px] text-ochre font-semibold uppercase tracking-wider mt-4 flex items-center gap-1">
                                        Acquire credits →
                                    </p>
                                </div>
                            </Link>

                            {/* Proposals / Briefs Card */}
                            <div className="border border-edge rounded-2xl p-5 bg-surface shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between text-mist text-xs mb-2">
                                        <span className="font-mono uppercase tracking-wider text-[10px]">
                                            {isClient ? 'Briefs' : 'Proposals'}
                                        </span>
                                        <Briefcase className="h-4 w-4 text-sidi-azure" strokeWidth={1.5} />
                                    </div>
                                    <div className="text-3xl font-mono font-medium text-alabaster">
                                        {isClient ? myJobs.length : myApplications.length}
                                    </div>
                                    <p className="text-xs text-mist mt-1 font-light">
                                        {isClient
                                            ? `${myJobs.reduce((s, j) => s + (j.applicantCount || 0), 0)} treatments received`
                                            : `${myApplications.filter(a => a.status === 'accepted').length} accepted commissions`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('proposals')}
                                    className="text-[10px] text-sidi-azure font-semibold uppercase tracking-wider mt-4 text-left"
                                >
                                    Inspect ledger →
                                </button>
                            </div>

                            {/* Verification Card */}
                            <div className={`border rounded-2xl p-5 bg-surface shadow-sm flex flex-col justify-between ${
                                isVerified ? 'border-emerald-500/30' : myRequest?.status === 'pending' ? 'border-ochre/30' : 'border-edge'
                            }`}>
                                <div>
                                    <div className="flex items-center justify-between text-mist text-xs mb-2">
                                        <span className="font-mono uppercase tracking-wider text-[10px]">Status</span>
                                        {isVerified ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
                                        ) : myRequest?.status === 'pending' ? (
                                            <Clock className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                        ) : (
                                            <ShieldCheck className="h-4 w-4 text-mist" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <div className={`text-base font-semibold truncate ${
                                        isVerified ? 'text-emerald-400' : myRequest?.status === 'pending' ? 'text-ochre' : 'text-mist'
                                    }`}>
                                        {isVerified
                                            ? 'Folio Certified ✓'
                                            : myRequest?.status === 'pending'
                                                ? 'Under Review'
                                                : 'Unverified'}
                                    </div>
                                    <p className="text-xs text-mist mt-1 font-light">
                                        {isVerified
                                            ? 'Full national privileges'
                                            : myRequest?.status === 'pending'
                                                ? 'Board reviewing folio'
                                                : 'Verification enables briefs'}
                                    </p>
                                </div>
                                {!isVerified && myRequest?.status !== 'pending' && (
                                    <button
                                        onClick={() => { setShowRequestForm(true); setRequestSent(false); setRequestMsg(''); }}
                                        className="text-[10px] text-ochre font-semibold uppercase tracking-wider mt-4 text-left"
                                    >
                                        Apply for certification →
                                    </button>
                                )}
                            </div>

                            {/* Archival Downloads / Protected Works */}
                            <div className="border border-edge rounded-2xl p-5 bg-surface shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between text-mist text-xs mb-2">
                                        <span className="font-mono uppercase tracking-wider text-[10px]">Digital Studio</span>
                                        <Download className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                    </div>
                                    <div className="text-3xl font-mono font-medium text-alabaster">3</div>
                                    <p className="text-xs text-mist mt-1 font-light">Canvas formats ready (9:16, 16:9, 1:1)</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('wallpapers')}
                                    className="text-[10px] text-ochre font-semibold uppercase tracking-wider mt-4 text-left"
                                >
                                    Open Wallpaper Studio →
                                </button>
                            </div>
                        </div>

                        {/* Verification Form Modal / Collapsible */}
                        <AnimatePresence>
                            {showRequestForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="border border-ochre/40 rounded-3xl p-6 bg-surface space-y-4 shadow-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-lg font-normal text-alabaster flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5 text-ochre" strokeWidth={1.5} />
                                            Curatorial Certification Folio Submission
                                        </h3>
                                        <button onClick={() => setShowRequestForm(false)} className="text-mist hover:text-alabaster text-xs">
                                            ✕ Close
                                        </button>
                                    </div>
                                    <p className="text-xs text-mist leading-relaxed">
                                        Please provide a concise overview of your photography experience in Tunisia, links to recent editorial publications, exhibition history, or your external portfolio.
                                    </p>
                                    <textarea
                                        className="w-full border border-edge rounded-xl px-4 py-3 text-xs bg-surface-elevated text-alabaster resize-none focus:outline-none focus:border-ochre placeholder:text-mist/40"
                                        rows={4}
                                        placeholder="E.g. Tunis Medina documentarian with 5 years experience. Recent features in national heritage press..."
                                        value={requestMsg}
                                        onChange={e => setRequestMsg(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" size="sm" className="text-xs text-mist" onClick={() => setShowRequestForm(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="text-xs bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl px-5"
                                            onClick={handleRequestSubmit}
                                            disabled={!requestMsg.trim()}
                                        >
                                            Submit Folio
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {requestSent && (
                            <div className="border border-ochre/30 rounded-2xl p-4 bg-ochre/10 text-xs text-ochre flex items-center gap-2">
                                <Clock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                                Your certification application has been lodged. The curatorial team will inspect your credentials shortly.
                            </div>
                        )}

                        {/* Creative Controls: International Availability & Style Descriptors */}
                        {isCreative && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* International Toggle */}
                                <div className="border border-edge rounded-3xl p-6 bg-surface flex flex-col justify-between space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-edge flex items-center justify-center text-ochre flex-shrink-0">
                                                <Globe className="h-5 w-5" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-alabaster">International Assignment Availability</h3>
                                                <p className="text-xs text-mist mt-1 leading-relaxed">
                                                    {intlAvailable
                                                        ? "Active on public directory. Overseas and European agencies can commission your services."
                                                        : "Toggle on to advertise worldwide commission availability to foreign publications."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between border-t border-edge/60">
                                        <span className="text-[11px] font-mono uppercase text-mist">
                                            Status: <strong className={intlAvailable ? "text-emerald-400" : "text-mist"}>{intlAvailable ? "Global Active" : "Domestic Only"}</strong>
                                        </span>
                                        <button
                                            onClick={handleIntlToggle}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none border ${
                                                intlAvailable ? 'bg-ochre border-ochre' : 'bg-surface-elevated border-edge'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                                                    intlAvailable ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Style Descriptors Summary */}
                                <div className="border border-edge rounded-3xl p-6 bg-surface space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                        <h3 className="font-serif text-base text-alabaster">Visual Disciplines &amp; Style Descriptors</h3>
                                    </div>
                                    <p className="text-xs text-mist">
                                        Select photographic aesthetics that reflect your body of work to enhance search discovery.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                                        {ALL_STYLE_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => handleTagToggle(tag)}
                                                className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all ${
                                                    styleTags.includes(tag)
                                                        ? 'bg-ochre text-canvas border-ochre font-semibold shadow-sm'
                                                        : 'bg-surface-elevated text-mist border-edge hover:border-ochre/40 hover:text-alabaster'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    {styleTags.length > 0 && (
                                        <p className="text-[11px] text-ochre font-mono">{styleTags.length} descriptor{styleTags.length !== 1 ? 's' : ''} active</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recent Briefs Spotlight */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-serif text-xl text-alabaster">Marketplace Briefs Spotlight</h2>
                                <Link to="/jobs" className="text-xs font-mono text-ochre hover:underline uppercase tracking-wider">
                                    View All Opportunities →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(jobs || []).slice(0, 4).map(job => (
                                    <Link
                                        key={job.id}
                                        to={`/jobs/${job.id}`}
                                        className="border border-edge rounded-2xl p-5 bg-surface hover:border-ochre/40 transition-all flex flex-col justify-between gap-3 group"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-mono uppercase text-ochre">{job.category}</span>
                                                <span className="text-xs font-mono font-medium text-ochre">${job.budget}</span>
                                            </div>
                                            <h3 className="font-medium text-sm text-alabaster group-hover:text-ochre transition-colors truncate">
                                                {job.title}
                                            </h3>
                                            <p className="text-xs text-mist line-clamp-2 font-light">
                                                {job.description}
                                            </p>
                                        </div>
                                        <div className="pt-2 border-t border-edge/60 flex items-center justify-between text-[11px] text-mist/70 font-mono">
                                            <span>{job.location || 'Remote / Tunisia'}</span>
                                            <span className="text-ochre">{job.connectsRequired} Connects</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: PROPOSALS & BRIEFS ── */}
                {activeTab === 'proposals' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="font-serif text-2xl text-alabaster">
                                    {isClient ? 'Published Commission Briefs' : 'Dispatched Proposals & Treatments'}
                                </h2>
                                <p className="text-xs text-mist font-light mt-1">
                                    {isClient
                                        ? 'Review submitted treatments and commission qualified Tunisian visual creatives'
                                        : 'Track the status and client review updates of your sent folio treatments'}
                                </p>
                            </div>
                            {isClient ? (
                                <Link to="/jobs/post">
                                    <Button size="sm" className="bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl gap-2 text-xs">
                                        <PlusCircle className="w-4 h-4" /> Post New Brief
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/jobs">
                                    <Button size="sm" className="bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl gap-2 text-xs">
                                        <Briefcase className="w-4 h-4" /> Browse Briefs
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* List of Client Briefs or Creative Applications */}
                        {isClient ? (
                            myJobs.length === 0 ? (
                                <div className="border border-edge rounded-3xl p-12 text-center text-mist bg-surface space-y-3">
                                    <Briefcase className="h-10 w-10 mx-auto text-ochre/40" strokeWidth={1.2} />
                                    <p className="text-sm font-medium text-alabaster">No published assignment briefs yet</p>
                                    <p className="text-xs text-mist max-w-sm mx-auto">
                                        Commission experienced photographers and videographers across Tunis, Carthage, Sidi Bou Said, and the Sahara.
                                    </p>
                                    <Link to="/jobs/post" className="inline-block mt-2">
                                        <Button size="sm" className="bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl text-xs">
                                            Post Your First Assignment
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myJobs.map(job => {
                                        const apps = getJobApplications(job.id);
                                        return (
                                            <div
                                                key={job.id}
                                                className="border border-edge rounded-2xl p-5 bg-surface flex items-start justify-between gap-4 hover:border-ochre/40 transition-all"
                                            >
                                                <div className="space-y-1.5 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2.5 flex-wrap">
                                                        <h3 className="font-medium text-sm text-alabaster truncate">{job.title}</h3>
                                                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated border border-edge text-mist">
                                                            {job.category}
                                                        </span>
                                                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                                                            job.status === 'open' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-mist bg-surface border-edge'
                                                        }`}>
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-mist line-clamp-1 font-light">{job.description}</p>
                                                    <div className="flex items-center gap-3 text-xs text-mist/80 pt-1 font-mono">
                                                        <span>Budget: <strong className="text-ochre">${job.budget}</strong></span>
                                                        <span>·</span>
                                                        <span>{apps.length} treatment{apps.length !== 1 ? 's' : ''} received</span>
                                                        <span>·</span>
                                                        <span>Deadline: {formatDate(job.deadline)}</span>
                                                    </div>
                                                </div>
                                                <Link to={`/jobs/${job.id}`}>
                                                    <Button variant="outline" size="sm" className="rounded-xl border-edge text-xs hover:bg-surface-elevated">
                                                        Review Treatments
                                                    </Button>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        ) : (
                            myApplications.length === 0 ? (
                                <div className="border border-edge rounded-3xl p-12 text-center text-mist bg-surface space-y-3">
                                    <Briefcase className="h-10 w-10 mx-auto text-ochre/40" strokeWidth={1.2} />
                                    <p className="text-sm font-medium text-alabaster">No proposals active</p>
                                    <p className="text-xs text-mist max-w-sm mx-auto">
                                        Browse active commercial, documentary, and editorial briefs to dispatch your creative treatments.
                                    </p>
                                    <Link to="/jobs" className="inline-block mt-2">
                                        <Button size="sm" className="bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl text-xs">
                                            Explore Briefs
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myApplications.map(app => {
                                        const job = (jobs || []).find(j => j.id === app.jobId);
                                        return (
                                            <div
                                                key={app.id}
                                                className="border border-edge rounded-2xl p-5 bg-surface flex items-start gap-4 hover:border-ochre/40 transition-all"
                                            >
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <div className="flex items-center gap-2.5 flex-wrap">
                                                        <span className="font-medium text-sm text-alabaster truncate">{job?.title ?? 'Archived Brief'}</span>
                                                        <StatusBadge status={app.status} />
                                                    </div>
                                                    <p className="text-xs text-mist font-light">
                                                        Proposed Price: <span className="font-mono text-ochre font-medium">${app.proposedPrice}</span> · Dispatched {formatDate(app.createdAt)}
                                                    </p>
                                                    {app.coverLetter && (
                                                        <p className="text-xs text-mist/80 italic line-clamp-2 bg-canvas/40 p-2.5 rounded-xl border border-edge/60">
                                                            "{app.coverLetter}"
                                                        </p>
                                                    )}
                                                </div>
                                                {job && (
                                                    <Link to={`/jobs/${job.id}`} className="text-mist hover:text-ochre transition-colors p-2">
                                                        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* ── TAB 3: CONNECTS & CREDITS ── */}
                {activeTab === 'connects' && (
                    <div className="space-y-6">
                        <div className="border border-edge rounded-3xl p-6 md:p-8 bg-surface space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-ochre text-xs font-mono uppercase tracking-wider">
                                        <Zap className="h-4 w-4" fill="currentColor" />
                                        <span>Proposals Ledger &amp; Allocation</span>
                                    </div>
                                    <h2 className="font-serif text-2xl text-alabaster">Available Connects Balance</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl md:text-5xl font-mono text-ochre font-medium">{connects}</span>
                                    <Link to="/buy-connects">
                                        <Button className="bg-ochre hover:bg-ochre-light text-canvas font-medium rounded-xl text-xs h-10 px-5 gap-2">
                                            <Zap className="w-3.5 h-3.5" fill="currentColor" /> Acquire Credits
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <ul className="text-xs text-mist space-y-2 list-disc list-inside font-light border-y border-edge/60 py-4">
                                <li>Each client brief requires a specified number of Connects to transmit a formal treatment.</li>
                                <li>Newly verified Tunisian photographers receive 20 complimentary bonus Connects.</li>
                                <li>Credits never expire and remain permanently tied to your archival credential.</li>
                                <li>If a client cancels an unfilled brief, consumed Connects are automatically reimbursed.</li>
                            </ul>

                            {/* Ledger History */}
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-mist/60 block mb-2 font-mono">
                                    Transaction Ledger
                                </span>
                                <div className="border border-edge rounded-2xl overflow-hidden divide-y divide-edge">
                                    <div className="p-3 bg-surface-elevated/40 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-medium text-alabaster">Welcome Archival Allocation</p>
                                            <p className="text-[10px] text-mist font-mono">Account Initialization</p>
                                        </div>
                                        <span className="font-mono text-emerald-400 font-medium">+20 ⚡</span>
                                    </div>
                                    {myApplications.map(app => {
                                        const job = (jobs || []).find(j => j.id === app.jobId);
                                        return (
                                            <div key={app.id} className="p-3 bg-surface flex items-center justify-between text-xs">
                                                <div>
                                                    <p className="font-medium text-alabaster truncate">Proposal: {job?.title || 'Brief Treatment'}</p>
                                                    <p className="text-[10px] text-mist font-mono">{formatDate(app.createdAt)}</p>
                                                </div>
                                                <span className="font-mono text-rose-400 font-medium">-{job?.connectsRequired || 2} ⚡</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 4: WALLPAPERS & RAW ── */}
                {activeTab === 'wallpapers' && (
                    <div className="space-y-6">
                        <div className="border border-edge rounded-3xl p-6 md:p-8 bg-surface space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-ochre text-xs font-mono uppercase tracking-wider">
                                        <Download className="h-4 w-4" />
                                        <span>Digital Provenance Studio</span>
                                    </div>
                                    <h2 className="font-serif text-2xl text-alabaster mt-1">Multi-Format Wallpaper Generator</h2>
                                    <p className="text-xs text-mist font-light mt-1">
                                        High-fidelity browser-canvas rendering with aspect-ratio adaptive cropping for mobile and desktop screens.
                                    </p>
                                </div>
                            </div>

                            {/* Preset Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border border-edge rounded-2xl p-5 bg-surface-elevated space-y-2">
                                    <div className="flex items-center justify-between text-ochre text-xs font-mono">
                                        <span>Mobile Aspect</span>
                                        <span>9:16</span>
                                    </div>
                                    <h4 className="font-medium text-sm text-alabaster">1080 × 1920 UHD</h4>
                                    <p className="text-xs text-mist font-light">Custom cut for modern OLED smartphone lockscreens.</p>
                                </div>
                                <div className="border border-edge rounded-2xl p-5 bg-surface-elevated space-y-2">
                                    <div className="flex items-center justify-between text-ochre text-xs font-mono">
                                        <span>Desktop 4K</span>
                                        <span>16:9</span>
                                    </div>
                                    <h4 className="font-medium text-sm text-alabaster">3840 × 2160 Display</h4>
                                    <p className="text-xs text-mist font-light">Cinema-grade desktop crop with museum watermark.</p>
                                </div>
                                <div className="border border-edge rounded-2xl p-5 bg-surface-elevated space-y-2">
                                    <div className="flex items-center justify-between text-ochre text-xs font-mono">
                                        <span>Square Crop</span>
                                        <span>1:1</span>
                                    </div>
                                    <h4 className="font-medium text-sm text-alabaster">2048 × 2048 Studio</h4>
                                    <p className="text-xs text-mist font-light">Balanced format for avatar plates and social previews.</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-canvas border border-edge text-xs space-y-2">
                                <div className="flex items-center gap-2 text-ochre font-mono uppercase tracking-wider text-[10px]">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Anti-Screenshot &amp; RAW Digital Provenance Active</span>
                                </div>
                                <p className="text-mist font-light leading-relaxed">
                                    All high-resolution outputs are protected with dynamic micro-watermarks and verified metadata hashes to preserve copyright attribution.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 5: ACCOUNT & SECURITY ── */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="border border-edge rounded-3xl p-6 md:p-8 bg-surface space-y-6">
                            <div>
                                <h2 className="font-serif text-2xl text-alabaster">Account Profile &amp; Hardened Security</h2>
                                <p className="text-xs text-mist font-light mt-1">
                                    NIST SP 800-63B compliant cryptographic standards with brute-force lockout safeguards.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                <div className="p-4 rounded-2xl bg-surface-elevated border border-edge space-y-1">
                                    <span className="text-[10px] text-mist/60 uppercase">Full Name</span>
                                    <p className="text-sm font-sans font-medium text-alabaster">{user.name}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-surface-elevated border border-edge space-y-1">
                                    <span className="text-[10px] text-mist/60 uppercase">Email Address</span>
                                    <p className="text-sm text-alabaster">{user.email}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-surface-elevated border border-edge space-y-1">
                                    <span className="text-[10px] text-mist/60 uppercase">Current Role</span>
                                    <p className="text-sm text-ochre uppercase font-bold">{user.role}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-surface-elevated border border-edge space-y-1">
                                    <span className="text-[10px] text-mist/60 uppercase">Security Hardening</span>
                                    <p className="text-sm text-emerald-400">NIST SP 800-63B Compliant</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-edge flex items-center justify-between">
                                <span className="text-xs text-mist">Need to update your professional contact details?</span>
                                <Link to={`/artist/${user.id}`}>
                                    <Button variant="outline" size="sm" className="rounded-xl border-edge text-xs">
                                        View Public Bio
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
