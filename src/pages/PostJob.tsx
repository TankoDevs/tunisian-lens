import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Briefcase, Lock, ShieldCheck, Info } from "lucide-react";
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
                    <div className="text-3xl">🇹🇳</div>
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
                    <p className="text-lg font-medium">Only clients can post jobs</p>
                    <p className="text-sm text-muted-foreground">Creatives can browse and apply to jobs.</p>
                    <Link to="/jobs"><Button variant="outline">Browse Jobs</Button></Link>
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
        <div className="min-h-screen bg-background py-10">
            <div className="container mx-auto px-4 max-w-2xl">
                <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Back to jobs
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="font-sans text-3xl font-bold mb-1">Post a Job</h1>
                    <p className="text-muted-foreground mb-8">Reach the best creatives in Tunisia.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Job Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="e.g. Wedding Photographer for June Event"
                                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Creative Type Required */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Creative Type Required <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                {(['photographer', 'videographer', 'both'] as CreativeType[]).map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, creativeTypeRequired: t, category: '' }))}
                                        className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-all duration-200 capitalize ${form.creativeTypeRequired === t
                                            ? 'bg-foreground text-background border-foreground'
                                            : 'border-border hover:bg-accent text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {t === 'both' ? 'Both' : t === 'photographer' ? 'Photographer' : 'Videographer'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                            <select
                                value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Describe the job in detail: what you need, the event, your style preference, timeline, etc."
                                rows={5}
                                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                            />
                        </div>

                        {/* Budget + Currency */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Budget <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={form.budget}
                                    onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                                    placeholder="e.g. 800"
                                    className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <select
                                    value={form.currency}
                                    onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                                    className="w-24 h-10 px-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    {['USD', 'EUR', 'TND', 'GBP', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            {/* Budget Guidance */}
                            {budgetRange && (
                                <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 text-xs text-sky-700 dark:text-sky-300">
                                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" strokeWidth={2} />
                                    <span>
                                        Typical <strong>{form.category}</strong> shoot in Tunisia: <strong>${budgetRange[0]}–${budgetRange[1]}</strong>. Helps attract the right creatives.
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Location <span className="text-muted-foreground text-xs">(optional)</span></label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                placeholder="e.g. Tunis, Tunisia"
                                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <label className="flex items-center gap-2 text-sm cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    checked={form.isRemote}
                                    onChange={e => setForm(f => ({ ...f, isRemote: e.target.checked }))}
                                    className="rounded"
                                />
                                Remote / brief coordination only
                            </label>
                        </div>

                        <hr className="border-border my-8" />
                        <h2 className="font-sans text-xl font-bold mb-4">Visibility & Requirements</h2>

                        {/* Deadline */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Deadline <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={form.deadline}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Connects Required */}
                        <div className="space-y-3 p-5 rounded-xl border border-border bg-muted/20">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    Connects Required to Apply
                                </label>
                                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-500 font-bold px-3 py-1 rounded-md text-sm shadow-sm border border-amber-200 dark:border-amber-900/50">
                                    {form.connectsRequired} Connect{form.connectsRequired > 1 ? 's' : ''}
                                </span>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Connects are the platform currency creatives use to apply for jobs. Requiring more connects acts as a filter, ensuring only highly motivated and suitable creatives apply to your job.
                                <br /><span className="mt-1 block"><strong>Recommendation:</strong> 2 for small gigs, up to 6–10 for premium budgets.</span>
                            </p>

                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={form.connectsRequired}
                                onChange={e => setForm(f => ({ ...f, connectsRequired: parseInt(e.target.value) }))}
                                className="w-full accent-amber-500 mt-2"
                            />
                            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                                <span>1 (low barrier)</span>
                                <span>10 (high barrier)</span>
                            </div>
                        </div>

                        {/* Job Visibility Plans */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium">Select a Visibility Plan</label>

                            {/* Standard Plan */}
                            <div
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all",
                                    form.plan === 'standard'
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-card hover:bg-muted border-border"
                                )}
                                onClick={() => setForm(f => ({ ...f, plan: 'standard' }))}
                            >
                                <div className="mt-1">
                                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", form.plan === 'standard' ? "border-background" : "border-muted-foreground")}>
                                        {form.plan === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-background" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-base">Standard Listing</p>
                                    <p className={cn("text-xs mt-1 leading-relaxed", form.plan === 'standard' ? "text-background/80" : "text-muted-foreground")}>
                                        Your job appears in the standard feed. Free to post for verified clients.
                                    </p>
                                </div>
                            </div>

                            {/* Featured Plan */}
                            <div
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all",
                                    form.plan === 'featured'
                                        ? "bg-[hsl(var(--accent))]/10 border-[hsl(var(--accent))]"
                                        : "bg-card hover:bg-muted border-border"
                                )}
                                onClick={() => setForm(f => ({ ...f, plan: 'featured' }))}
                            >
                                <div className="mt-1">
                                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", form.plan === 'featured' ? "border-[hsl(var(--accent))]" : "border-muted-foreground")}>
                                        {form.plan === 'featured' && <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent))]" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className={cn("font-semibold text-base", form.plan === 'featured' && "text-[hsl(var(--accent))]")}>Featured Boost</p>
                                    </div>
                                    <p className={cn("text-xs mt-1 leading-relaxed text-muted-foreground")}>
                                        Highlighted styling and pinned higher in search results to attract top-tier talent faster.
                                    </p>
                                </div>
                            </div>

                            {/* Urgent Plan */}
                            <div
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all",
                                    form.plan === 'urgent'
                                        ? "bg-red-50 dark:bg-red-950/20 border-red-500"
                                        : "bg-card hover:bg-muted border-border"
                                )}
                                onClick={() => setForm(f => ({ ...f, plan: 'urgent' }))}
                            >
                                <div className="mt-1">
                                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", form.plan === 'urgent' ? "border-red-500" : "border-muted-foreground")}>
                                        {form.plan === 'urgent' && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className={cn("font-semibold text-base", form.plan === 'urgent' && "text-red-600 dark:text-red-400")}>Urgent Hire</p>
                                        <span className="text-[10px] uppercase tracking-wider font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-sm">24h Priority</span>
                                    </div>
                                    <p className="text-xs mt-1 leading-relaxed text-muted-foreground">
                                        Absolute top placement and flagged as urgent. Alerts nearby matching creatives immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verified Only Toggle */}
                        <div className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-colors ${form.verifiedOnly
                            ? 'bg-primary/5 border-primary/30 dark:border-primary/40'
                            : 'bg-muted/30 border-border hover:bg-muted/50'
                            }`}
                            onClick={() => setForm(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
                        >
                            <ShieldCheck className={`h-5 w-5 flex-shrink-0 mt-0.5 ${form.verifiedOnly ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={2} />
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${form.verifiedOnly ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    Verified creatives only
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Only verified creatives who passed our manual verification can apply.
                                </p>
                            </div>
                            <div className={`w-10 h-5 rounded-full flex-shrink-0 mt-0.5 relative transition-colors ${form.verifiedOnly ? 'bg-primary' : 'bg-muted-foreground/30'
                                }`}>
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.verifiedOnly ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11" size="lg">
                            Post Job
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
