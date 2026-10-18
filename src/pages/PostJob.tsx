import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Briefcase, Lock, ShieldCheck, Info, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";
import { JOB_CATEGORIES, PHOTO_CATEGORIES, VIDEO_CATEGORIES, type CreativeType } from "../data/mockData";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

// Smart budget guidance lookup
const BUDGET_RANGES: Record<string, [number, number]> = {
    "Wedding": [500, 1200],
    "Fashion": [400, 1500],
    "Portrait": [150, 400],
    "Event": [200, 600],
    "Product": [200, 800],
    "Commercial": [600, 2500],
    "Documentary": [300, 900],
    "Architecture": [400, 1800],
    "Landscape": [150, 500],
    "Wedding Film": [700, 2000],
    "Commercial Video": [800, 3000],
    "Music Video": [500, 2000],
    "Event Coverage": [300, 800],
    "Social Media Content": [200, 600],
};

export function PostJob() {
    const { postJob } = useMarketplace();
    const { user, isAuthenticated } = useAuth();
    const { hasAccess } = useTunisianAccess();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        budget: '',
        currency: 'USD',
        location: '',
        isRemote: false,
        category: JOB_CATEGORIES[0],
        deadline: '',
        connectsRequired: 4,
        verifiedOnly: false,
        creativeTypeRequired: 'both' as CreativeType,
        plan: 'standard' as 'standard' | 'featured' | 'urgent',
    });
    const [submitted, setSubmitted] = useState(false);
    const { showAlert } = useAlert();

    const budgetRange = useMemo(() => BUDGET_RANGES[form.category], [form.category]);

    if (!isAuthenticated || !hasAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4 max-w-sm px-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
                        <Lock className="h-7 w-7 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mx-auto">
                        <MapPin className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <p className="text-lg font-medium">Tunisia Marketplace Only</p>
                    <p className="text-sm text-muted-foreground">
                        Posting jobs is restricted to Tunisian citizens and residents.
                    </p>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {!isAuthenticated ? (
                            <Link to="/signup"><Button>Create Account</Button></Link>
                        ) : (
                            <Link to="/jobs"><Button variant="outline">Back to Jobs</Button></Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (user?.role === 'creative') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-40" strokeWidth={1.5} />
                    <p className="text-lg font-medium">Only clients can post assignments</p>
                    <p className="text-sm text-muted-foreground">Videographers and photographers can browse and apply to assignments.</p>
                    <Link to="/jobs"><Button variant="outline">Browse Assignments</Button></Link>
                </div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim() || !form.budget || !form.deadline) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }
        postJob({
            title: form.title.trim(),
            description: form.description.trim(),
            budget: parseInt(form.budget),
            currency: form.currency,
            location: form.location.trim() || undefined,
            isRemote: form.isRemote,
            category: form.category,
            deadline: form.deadline,
            connectsRequired: form.connectsRequired,
            verifiedOnly: form.verifiedOnly,
            creativeTypeRequired: form.creativeTypeRequired,
            isUrgent: form.plan === 'urgent',
        });
        setSubmitted(true);
        setTimeout(() => navigate('/jobs'), 1800);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    <div className="text-5xl">🎉</div>
                    <p className="text-xl font-semibold">Job posted successfully!</p>
                    <p className="text-muted-foreground text-sm">Redirecting to the job board...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas text-alabaster py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-2xl">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist hover:text-ochre transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Return to assignments
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre mb-2">Commission Briefing</p>
                    <h1 className="font-serif text-3xl md:text-4xl font-normal text-alabaster mb-2">Post a Production Call</h1>
                    <p className="text-mist text-sm mb-8 leading-relaxed">Engage verified documentary, commercial, and architectural creatives across the Tunisian territory.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Assignment Title <span className="text-ochre">*</span></label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="e.g. Architectural & Aerial Study: Djerba Dwellings"
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-sm text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40"
                            />
                        </div>

                        {/* Creative Type Required */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Creative Discipline <span className="text-ochre">*</span></label>
                            <div className="flex gap-2.5">
                                {(['photographer', 'videographer', 'both'] as CreativeType[]).map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, creativeTypeRequired: t, category: '' }))}
                                        className={`flex-1 h-11 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-200 capitalize ${form.creativeTypeRequired === t
                                            ? 'bg-ochre text-canvas border-ochre shadow-sm'
                                            : 'bg-surface border-edge text-mist hover:text-alabaster hover:border-ochre/40'
                                            }`}
                                    >
                                        {t === 'both' ? 'Both' : t === 'photographer' ? 'Photographer' : 'Cinematographer'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Curatorial Category <span className="text-ochre">*</span></label>
                            <select
                                value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre cursor-pointer"
                            >
                                {(form.creativeTypeRequired === 'photographer'
                                    ? PHOTO_CATEGORIES
                                    : form.creativeTypeRequired === 'videographer'
                                        ? VIDEO_CATEGORIES
                                        : JOB_CATEGORIES
                                ).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Creative Brief &amp; Scope <span className="text-ochre">*</span></label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Detail the shoot context, expected deliverables (RAW/graded), location nuances, and timeline..."
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre resize-none placeholder:text-mist/40"
                            />
                        </div>

                        {/* Budget + Currency */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Allocated Budget <span className="text-ochre">*</span></label>
                            <div className="flex gap-2.5">
                                <input
                                    type="number"
                                    min="1"
                                    value={form.budget}
                                    onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                                    placeholder="e.g. 1200"
                                    className="flex-1 h-11 px-4 rounded-xl border border-edge bg-surface text-sm text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40"
                                />
                                <select
                                    value={form.currency}
                                    onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                                    className="w-28 h-11 px-3 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre cursor-pointer"
                                >
                                    {['USD', 'EUR', 'TND', 'GBP', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            {/* Budget Guidance */}
                            {budgetRange && (
                                <div className="flex items-start gap-2.5 mt-2 p-3.5 rounded-xl bg-sidi.azure/10 border border-sidi.azure/20 text-xs text-sidi.azure">
                                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <span className="text-alabaster/90">
                                        Standard bracket for <strong>{form.category}</strong> production: <strong className="text-ochre">${budgetRange[0]}–${budgetRange[1]}</strong>. Ensures high-caliber submissions.
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Governorate / Location <span className="text-mist/50 lowercase">(optional)</span></label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                placeholder="e.g. Sidi Bou Said, Tunis"
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-sm text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40"
                            />
                            <label className="flex items-center gap-2 text-xs cursor-pointer mt-1 text-mist">
                                <input
                                    type="checkbox"
                                    checked={form.isRemote}
                                    onChange={e => setForm(f => ({ ...f, isRemote: e.target.checked }))}
                                    className="rounded accent-ochre"
                                />
                                Remote post-production / editing only
                            </label>
                        </div>

                        <hr className="border-edge my-8" />
                        <h2 className="font-serif text-xl font-normal text-alabaster mb-4">Quality &amp; Discretion Settings</h2>

                        {/* Deadline */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Filing Deadline <span className="text-ochre">*</span></label>
                            <input
                                type="date"
                                value={form.deadline}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre"
                            />
                        </div>

                        {/* Connects Required */}
                        <div className="space-y-3 p-5 rounded-2xl border border-edge bg-surface">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-alabaster">
                                    Proposal Connects Threshold
                                </label>
                                <span className="bg-ochre/10 text-ochre font-mono font-medium px-3 py-1 rounded-md text-xs border border-ochre/20">
                                    {form.connectsRequired} Connect{form.connectsRequired > 1 ? 's' : ''}
                                </span>
                            </div>

                            <p className="text-xs text-mist leading-relaxed">
                                Connects act as a quality filter, ensuring only serious photographers with capacity submit comprehensive proposals.
                            </p>

                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={form.connectsRequired}
                                onChange={e => setForm(f => ({ ...f, connectsRequired: parseInt(e.target.value) }))}
                                className="w-full accent-ochre mt-2"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-mist">
                                <span>1 (broad open call)</span>
                                <span>10 (exclusive masterclass)</span>
                            </div>
                        </div>

                        {/* Job Visibility Plans */}
                        <div className="space-y-3 pt-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Placement Elevation</label>

                            {/* Standard Plan */}
                            <div
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-2xl border cursor-pointer select-none transition-all",
                                    form.plan === 'standard'
                                        ? "bg-surface.elevated border-ochre shadow-sm"
                                        : "bg-surface hover:bg-surface.elevated border-edge"
                                )}
                                onClick={() => setForm(f => ({ ...f, plan: 'standard' }))}
                            >
                                <div className="mt-1">
                                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", form.plan === 'standard' ? "border-ochre" : "border-edge")}>
                                        {form.plan === 'standard' && <div className="w-2 h-2 rounded-full bg-ochre" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-alabaster">Standard Curation</p>
                                    <p className="text-xs mt-0.5 text-mist leading-relaxed">
                                        Included in community assignment feed. Free for registered production partners.
                                    </p>
                                </div>
                            </div>

                            {/* Featured Plan */}
                            <div
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-2xl border cursor-pointer select-none transition-all",
                                    form.plan === 'featured'
                                        ? "bg-ochre/10 border-ochre shadow-sm"
                                        : "bg-surface hover:bg-surface.elevated border-edge"
                                )}
                                onClick={() => setForm(f => ({ ...f, plan: 'featured' }))}
                            >
                                <div className="mt-1">
                                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", form.plan === 'featured' ? "border-ochre" : "border-edge")}>
                                        {form.plan === 'featured' && <div className="w-2 h-2 rounded-full bg-ochre" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-ochre">Curatorial Spotlight</p>
                                    <p className="text-xs mt-0.5 text-mist leading-relaxed">
                                        Pinned header banner across the marketplace and highlighted in weekly creative dispatch.
                                    </p>
                                </div>
                            </div>

                            {/* Urgent Plan */}
                            <div
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-2xl border cursor-pointer select-none transition-all",
                                    form.plan === 'urgent'
                                        ? "bg-red-500/10 border-red-500 shadow-sm"
                                        : "bg-surface hover:bg-surface.elevated border-edge"
                                )}
                                onClick={() => setForm(f => ({ ...f, plan: 'urgent' }))}
                            >
                                <div className="mt-1">
                                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", form.plan === 'urgent' ? "border-red-500" : "border-edge")}>
                                        {form.plan === 'urgent' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm text-red-400">Urgent Dispatch</p>
                                        <span className="text-[9px] uppercase tracking-wider font-semibold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-sm">24h Priority</span>
                                    </div>
                                    <p className="text-xs mt-0.5 text-mist leading-relaxed">
                                        Immediate push notification dispatched to nearby verified creatives.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verified Only Toggle */}
                        <div className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer select-none transition-colors ${form.verifiedOnly
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-surface border-edge hover:bg-surface.elevated'
                            }`}
                            onClick={() => setForm(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
                        >
                            <ShieldCheck className={`h-5 w-5 flex-shrink-0 mt-0.5 ${form.verifiedOnly ? 'text-emerald-400' : 'text-mist'}`} strokeWidth={1.5} />
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wider text-alabaster">
                                    Verified Creatives Only
                                </p>
                                <p className="text-xs text-mist mt-0.5">
                                    Restrict submissions exclusively to creators whose identity and portfolio have been vetted.
                                </p>
                            </div>
                            <div className={`w-9 h-5 rounded-full flex-shrink-0 mt-0.5 relative transition-colors ${form.verifiedOnly ? 'bg-emerald-500' : 'bg-surface.elevated border border-edge'
                                }`}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.verifiedOnly ? 'translate-x-4' : 'translate-x-0'
                                    }`} />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-ochre hover:bg-ochre/90 text-canvas font-semibold rounded-xl border-none shadow-md" size="lg">
                            Publish Assignment Call
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
