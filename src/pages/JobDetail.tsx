import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, Banknote, ShieldCheck, ShieldX, CheckCircle2, ChevronDown, ChevronUp, Lock, MessageCircle, Send, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";
import { ConnectsBadge } from "../components/ui/ConnectsBadge";
import { Button } from "../components/ui/button";
import { ARTISTS } from "../data/mockData";
import { useCurrency } from "../lib/useCurrency";

function daysUntil(deadline: string, now: number): string {
    const diff = new Date(deadline).getTime() - now;
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return 'Expired';
    if (days === 0) return 'Due today';
    return `${days} days left`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Haversine formula — distance in km between two lat/lng points
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Rough city → coordinate mapping for Tunisian cities
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    "Tunis": { lat: 36.8065, lng: 10.1815 },
    "Sfax": { lat: 34.7473, lng: 10.7596 },
    "Sousse": { lat: 35.8256, lng: 10.6369 },
    "Hammamet": { lat: 36.4004, lng: 10.6133 },
    "Sidi Bou Said": { lat: 36.8693, lng: 10.3420 },
    "La Marsa": { lat: 36.8779, lng: 10.3231 },
    "Nabeul": { lat: 36.4512, lng: 10.7355 },
    "Tozeur": { lat: 33.9197, lng: 8.1339 },
    "Djerba": { lat: 33.8075, lng: 10.8451 },
    "Bizerte": { lat: 37.2744, lng: 9.8739 },
    "Monastir": { lat: 35.7643, lng: 10.8113 },
    "Gabes": { lat: 33.8828, lng: 10.0982 },
};

function getJobCityCoords(location?: string): { lat: number; lng: number } | null {
    if (!location) return null;
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
        if (location.toLowerCase().includes(city.toLowerCase())) return coords;
    }
    return null;
}

const FREE_QUESTIONS_KEY = 'tl_free_questions';

function getFreeQuestions(): Record<string, string> {
    try { return JSON.parse(localStorage.getItem(FREE_QUESTIONS_KEY) || '{}'); } catch { return {}; }
}

function saveFreeQuestion(key: string, question: string) {
    const all = getFreeQuestions();
    all[key] = question;
    localStorage.setItem(FREE_QUESTIONS_KEY, JSON.stringify(all));
}

export function JobDetail() {
    const { id } = useParams<{ id: string }>();
    const [now] = useState(() => Date.now());
    const { jobs, applyToJob, getJobApplications, getConnects, hasApplied, closeJob } = useMarketplace();
    const { user, isAuthenticated } = useAuth();
    const { formatPrice, symbol } = useCurrency();

    const [coverLetter, setCoverLetter] = useState('');
    const [proposedPrice, setProposedPrice] = useState('');
    const [showApplications, setShowApplications] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // Free question state
    const questionKey = user && id ? `${user.id}-${id}` : '';
    const existingQuestion = questionKey ? getFreeQuestions()[questionKey] : undefined;
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [questionText, setQuestionText] = useState('');
    const [questionSubmitted, setQuestionSubmitted] = useState(!!existingQuestion);
    const { hasAccess } = useTunisianAccess();

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

    // Nearby creatives (Haversine from job location)
    const jobCoords = getJobCityCoords(job.location);
    const nearbyCreatives = jobCoords
        ? ARTISTS
            .filter(a => a.coordinates)
            .map(a => ({ artist: a, km: haversineKm(jobCoords.lat, jobCoords.lng, a.coordinates!.lat, a.coordinates!.lng) }))
            .sort((a, b) => a.km - b.km)
            .slice(0, 3)
        : [];

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

    const handleSubmitQuestion = () => {
        if (!questionText.trim() || !questionKey) return;
        saveFreeQuestion(questionKey, questionText.trim());
        setQuestionSubmitted(true);
        setShowQuestionForm(false);
    };

    const canApply = isAuthenticated && user?.role === 'creative' && !already && job.status === 'open';
    const hasEnoughConnects = connects >= job.connectsRequired;

    return (
        <div className="min-h-screen bg-canvas text-alabaster py-10 md:py-16">
            <div className="container mx-auto section-padding max-w-4xl">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist hover:text-ochre transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Return to assignments
                </Link>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ochre bg-ochre/10 border border-ochre/20 px-3 py-1 rounded-md">
                                {job.category}
                            </span>
                            {job.status === 'closed' && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-mist bg-surface.elevated px-2.5 py-1 rounded-md border border-edge">Closed</span>
                            )}
                            {job.isUrgent && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
                                    ⚡ Urgent Brief
                                </span>
                            )}
                        </div>
                        <ConnectsBadge count={job.connectsRequired} />
                    </div>

                    <h1 className="font-serif text-3xl md:text-4xl font-normal leading-tight text-alabaster mb-3">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-mist mb-8">
                        <span>Commissioned by <span className="font-medium text-alabaster">{job.clientName}</span> · {formatDate(job.createdAt)}</span>
                        {job.verifiedOnly && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <ShieldCheck className="h-3 w-3" strokeWidth={2} /> Verified Creatives Only
                            </span>
                        )}
                    </div>

                    {/* Meta row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl bg-surface border border-edge mb-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-mist/60">Estimated Budget</p>
                            <p className="font-mono text-base font-medium text-alabaster flex items-center gap-1.5">
                                <Banknote className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                {formatPrice(job.budget)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-mist/60">Assignment Location</p>
                            <p className="text-xs font-medium text-alabaster flex items-center gap-1.5 truncate">
                                <MapPin className="h-4 w-4 text-sidi.azure" strokeWidth={1.5} />
                                {job.location || 'Tunisia'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-mist/60">Filing Deadline</p>
                            <p className="text-xs font-medium text-alabaster flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-mist" strokeWidth={1.5} />
                                {daysUntil(job.deadline, now)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-mist/60">Proposals Filed</p>
                            <p className="font-mono text-xs font-medium text-alabaster flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-mist" strokeWidth={1.5} />
                                {job.applicantCount} {job.applicantCount === 1 ? 'creative' : 'creatives'}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-6 md:p-8 rounded-2xl bg-surface border border-edge mb-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre mb-3">Creative Brief &amp; Deliverables</p>
                        <p className="text-sm md:text-base text-alabaster/90 leading-relaxed font-light whitespace-pre-line">
                            {job.description}
                        </p>
                    </div>

                    {/* ── FREE PRE-APPLICATION QUESTION ── */}
                    {isAuthenticated && user?.role === 'creative' && hasAccess && !already && !isOwner && job.status === 'open' && (
                        <div className="mb-8 border border-edge rounded-2xl bg-surface overflow-hidden">
                            <div className="px-5 py-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="h-4 w-4 text-sidi.azure flex-shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-semibold text-alabaster">Pre-Application Direct Question</p>
                                        <p className="text-xs text-mist">Clarify logistical constraints before applying — free of charge.</p>
                                    </div>
                                </div>
                                {!questionSubmitted && !showQuestionForm && (
                                    <Button size="sm" variant="outline" className="text-xs gap-1.5 flex-shrink-0 border-edge text-alabaster hover:bg-surface.elevated"
                                        onClick={() => setShowQuestionForm(true)}>
                                        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                                        Inquire
                                    </Button>
                                )}
                            </div>

                            <AnimatePresence>
                                {questionSubmitted && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-edge px-5 pb-4 pt-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-mist mb-2">Inquiry Dispatched</p>
                                        <p className="text-sm text-alabaster/90 italic bg-surface.elevated border border-edge rounded-xl px-4 py-3">
                                            "{existingQuestion || getFreeQuestions()[questionKey]}"
                                        </p>
                                        <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                                            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                                            Forwarded to client — 0 Connects deducted
                                        </p>
                                    </motion.div>
                                )}
                                {showQuestionForm && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-edge px-5 pb-4 pt-3 space-y-3">
                                        <textarea
                                            value={questionText}
                                            onChange={e => setQuestionText(e.target.value)}
                                            placeholder="Ask about shoot schedule, lighting conditions, licensing rights or permits..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-edge bg-surface.elevated text-alabaster text-xs focus:outline-none focus:border-ochre resize-none placeholder:text-mist/40"
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="ghost" className="text-xs text-mist hover:text-alabaster" onClick={() => setShowQuestionForm(false)}>Cancel</Button>
                                            <Button size="sm" className="text-xs gap-1.5 bg-ochre hover:bg-ochre/90 text-canvas font-semibold border-none" disabled={!questionText.trim()} onClick={handleSubmitQuestion}>
                                                <Send className="h-3 w-3" strokeWidth={2} />
                                                Send Inquiry
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* ── NEARBY CREATIVES ── */}
                    {nearbyCreatives.length > 0 && (
                        <div className="mb-8 border border-edge rounded-2xl overflow-hidden bg-surface">
                            <div className="px-5 py-4 border-b border-edge flex items-center gap-2">
                                <Navigation className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                <p className="text-xs font-semibold uppercase tracking-wider text-alabaster">Nearby Local Creatives</p>
                                <p className="text-xs text-mist">— based on regional proximity</p>
                            </div>
                            <div className="divide-y divide-edge">
                                {nearbyCreatives.map(({ artist, km }) => (
                                    <Link key={artist.id} to={`/artist/${artist.id}`}
                                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface.elevated transition-colors group">
                                        <img src={artist.avatar} alt={artist.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-edge" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-alabaster truncate group-hover:text-ochre transition-colors">{artist.name}</p>
                                            <p className="text-[11px] text-mist truncate">{artist.categories.slice(0, 2).join(' · ')}</p>
                                        </div>
                                        <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-ochre bg-ochre/10 border border-ochre/20 px-2 py-0.5 rounded-md flex-shrink-0">
                                            <MapPin className="h-2.5 w-2.5" strokeWidth={2} />
                                            {km} km away
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === APPLICATION SECTION === */}
                    <div id="application-form" className="border border-edge rounded-2xl p-6 md:p-8 bg-surface space-y-5 shadow-sm scroll-mt-24">
                        {/* Owner: View Applications */}
                        {isOwner ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="font-serif text-xl font-normal text-alabaster">Proposals Received ({applications.length})</h2>
                                    <div className="flex gap-2">
                                        {job.status === 'open' && (
                                            <Button variant="outline" size="sm" onClick={() => closeJob(job.id)} className="border-edge text-mist hover:text-alabaster">
                                                Close Brief
                                            </Button>
                                        )}
                                        <button
                                            onClick={() => setShowApplications(s => !s)}
                                            className="flex items-center gap-1 text-xs text-ochre hover:underline uppercase tracking-wider font-semibold"
                                        >
                                            {showApplications ? <><ChevronUp className="h-3.5 w-3.5" />Hide</> : <><ChevronDown className="h-3.5 w-3.5" />Review</>}
                                        </button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {showApplications && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3 overflow-hidden pt-2"
                                        >
                                            {applications.length === 0 ? (
                                                <p className="text-xs text-mist">No proposals received yet.</p>
                                            ) : applications.map(app => (
                                                <div key={app.id} className="border border-edge rounded-xl p-4 bg-surface.elevated space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <img src={app.creativeAvatar} alt={app.creativeName} className="h-8 w-8 rounded-full object-cover border border-edge" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-alabaster">{app.creativeName}</p>
                                                            <p className="text-[11px] text-mist">Proposed: <span className="font-mono font-medium text-ochre">${app.proposedPrice}</span></p>
                                                        </div>
                                                        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider
                                                            ${app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                                app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                                    'bg-ochre/10 text-ochre border border-ochre/20'}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                    {app.coverLetter && <p className="text-xs text-mist italic">"{app.coverLetter}"</p>}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : already ? (
                            /* Already applied */
                            <div className="flex items-center gap-3.5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" strokeWidth={2} />
                                <div>
                                    <p className="text-sm font-semibold text-alabaster">Proposal Successfully Submitted</p>
                                    <p className="text-xs text-mist">The commissioning client has received your treatment and quote.</p>
                                </div>
                            </div>
                        ) : !isAuthenticated ? (
                            /* Not logged in */
                            <div className="text-center py-6 space-y-3">
                                <p className="font-serif text-lg font-normal text-alabaster">Ready to submit a treatment?</p>
                                <p className="text-xs text-mist max-w-sm mx-auto">Sign in with your creative credentials or apply for a verified artist membership.</p>
                                <div className="flex gap-3 justify-center pt-2">
                                    <Link to="/login"><Button variant="outline" size="sm" className="border-edge text-alabaster hover:bg-surface.elevated">Log In</Button></Link>
                                    <Link to="/signup"><Button size="sm" className="bg-ochre hover:bg-ochre/90 text-canvas font-semibold border-none">Sign Up</Button></Link>
                                </div>
                            </div>
                        ) : !hasAccess ? (
                            /* Logged in but not Tunisian */
                            <div className="flex items-start gap-3 p-4 bg-surface.elevated border border-edge rounded-xl">
                                <Lock className="h-5 w-5 text-ochre flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="text-sm font-semibold text-alabaster">Tunisian Creative Exchange</p>
                                    <p className="text-xs text-mist mt-1">
                                        Proposal submissions are reserved for verified Tunisian photographers and production crews.
                                    </p>
                                </div>
                            </div>
                        ) : user?.role === 'client' ? (
                            /* Client viewing */
                            <p className="text-xs text-mist text-center py-4">Client accounts commission briefs and cannot submit proposals.</p>
                        ) : user?.role === 'creative' && user?.createdAt && (now - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24) < 7 ? (
                            /* Account too new */
                            <div className="flex items-start gap-3 p-4 bg-sidi.azure/10 border border-sidi.azure/30 rounded-xl">
                                <Clock className="h-5 w-5 text-sidi.azure flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="text-sm font-semibold text-alabaster">Account Maturation Period</p>
                                    <p className="text-xs text-mist mt-0.5">
                                        New creative accounts must mature for 7 days before bidding on production calls. Available in <strong>{Math.ceil(7 - (now - new Date(user.createdAt!).getTime()) / (1000 * 60 * 60 * 24))} days</strong>.
                                    </p>
                                </div>
                            </div>
                        ) : job.verifiedOnly && !isVerified ? (
                            /* Verified-only job, unverified creative */
                            <div className="flex items-start gap-3 p-4 bg-ochre/10 border border-ochre/30 rounded-xl">
                                <ShieldCheck className="h-5 w-5 text-ochre flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="text-sm font-semibold text-alabaster">Curatorial Verification Required</p>
                                    <p className="text-xs text-mist mt-0.5">
                                        This commissioning client requires verified credentials.{' '}
                                        <Link to="/dashboard" className="text-ochre underline font-medium">Submit verification portfolio →</Link>
                                    </p>
                                </div>
                            </div>
                        ) : !isVerified ? (
                            /* Unverified creative, general restriction */
                            <div className="flex items-start gap-3 p-4 bg-ochre/10 border border-ochre/30 rounded-xl">
                                <ShieldX className="h-5 w-5 text-ochre flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <p className="text-sm font-semibold text-alabaster">Verification Status Needed</p>
                                    <p className="text-xs text-mist mt-0.5">
                                        To protect client productions, verified status is required.{' '}
                                        <Link to="/dashboard" className="text-ochre underline font-medium">Verify your profile →</Link>
                                    </p>
                                </div>
                            </div>
                        ) : job.status === 'closed' ? (
                            /* Job closed */
                            <p className="text-xs text-mist text-center py-4">This assignment brief is now closed to new proposals.</p>
                        ) : (
                            /* Verified creative: Apply form */
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Verified Creative Active</span>
                                </div>

                                {/* Connects cost info */}
                                <div className={`flex items-center justify-between text-xs p-3.5 rounded-xl border ${hasEnoughConnects ? 'bg-ochre/10 border-ochre/30 text-ochre' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                    <span>
                                        {hasEnoughConnects
                                            ? `Filing requires ${job.connectsRequired} connects. Available balance: ${connects}.`
                                            : `Insufficient connects. Required: ${job.connectsRequired}, balance: ${connects}.`}
                                    </span>
                                    <ConnectsBadge count={connects} size="sm" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-mist">Your Proposed Quote ({symbol})</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={proposedPrice}
                                        onChange={e => setProposedPrice(e.target.value)}
                                        placeholder={`Target client budget: ${formatPrice(job.budget)}`}
                                        className="w-full h-11 px-4 rounded-xl border border-edge bg-surface.elevated text-sm text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-mist">Creative Treatment &amp; Experience <span className="text-mist/50 lowercase">(optional)</span></label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={e => setCoverLetter(e.target.value)}
                                        placeholder="Outline your stylistic approach, relevant past projects, and camera package..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-edge bg-surface.elevated text-xs text-alabaster focus:outline-none focus:border-ochre resize-none placeholder:text-mist/40"
                                    />
                                </div>

                                {result && (
                                    <div className={`text-xs px-4 py-3 rounded-xl border ${result.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                        {result.message}
                                    </div>
                                )}

                                <Button
                                    onClick={handleApply}
                                    disabled={!hasEnoughConnects || loading || canApply === false}
                                    className="w-full h-12 bg-ochre hover:bg-ochre/90 text-canvas font-semibold rounded-xl border-none shadow-md transition-all"
                                >
                                    {loading ? 'Transmitting Proposal...' : `Submit Proposal (${job.connectsRequired} Connects)`}
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ── MOBILE STICKY FAB ── */}
            <AnimatePresence>
                {canApply && !already && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-6 right-6 z-50 md:hidden"
                    >
                        <Button
                            size="lg"
                            className="w-full shadow-2xl h-14 text-sm font-semibold rounded-2xl gap-2 bg-ochre text-canvas border-none"
                            onClick={() => {
                                const form = document.getElementById('application-form');
                                if (form) form.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <Send className="h-4 w-4" />
                            Submit Proposal
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
