import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle, Briefcase, Lock, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";
import { JOB_CATEGORIES, CITIES, type Job } from "../data/mockData";
import { JobCard } from "../components/ui/JobCard";
import { ConnectsBadge } from "../components/ui/ConnectsBadge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

const DEADLINE_OPTIONS = [
    { label: "Any time", value: "" },
    { label: "This week", value: "7" },
    { label: "This month", value: "30" },
    { label: "3 months", value: "90" },
];

const SORT_OPTIONS = [
    { value: "recent", label: "Recently Added" },
    { value: "urgent", label: "Urgent First" },
    { value: "budget_desc", label: "Highest Budget" },
];

export function Jobs() {
    const { jobs, getConnects, isLoading } = useMarketplace();
    const { user, isAuthenticated } = useAuth();
    const { hasAccess } = useTunisianAccess();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [maxBudget, setMaxBudget] = useState('');
    const [location, setLocation] = useState('');
    const [maxConnects, setMaxConnects] = useState('');
    const [showOpen, setShowOpen] = useState(true);
    const [deadlineDays, setDeadlineDays] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("urgent"); // Keep urgent first as default but make it switchable
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const connects = isAuthenticated && user ? getConnects(user.id) : 0;

    const activeFilterCount = [
        maxBudget, location, maxConnects, deadlineDays,
        !showOpen ? 'all' : ''
    ].filter(Boolean).length;

    const clearFilters = () => {
        setMaxBudget(''); setLocation(''); setMaxConnects('');
        setDeadlineDays(''); setShowOpen(true);
    };

    const filtered = jobs.filter(job => {
        if (showOpen && job.status !== 'open') return false;
        if (selectedCategory !== 'All' && job.category !== selectedCategory) return false;
        if (maxBudget && job.budget > parseInt(maxBudget)) return false;
        if (location && job.location && !job.location.toLowerCase().includes(location.toLowerCase())) return false;
        if (maxConnects && job.connectsRequired > parseInt(maxConnects)) return false;
        if (deadlineDays) {
            const daysUntil = (new Date(job.deadline).getTime() - Date.now()) / 86400000;
            if (daysUntil > parseInt(deadlineDays)) return false;
        }
        if (search && !job.title.toLowerCase().includes(search.toLowerCase()) &&
            !job.description.toLowerCase().includes(search.toLowerCase()) &&
            (!job.location || !job.location.toLowerCase().includes(search.toLowerCase()))) return false;
        return true;
    });

    const showTunisiaRestrictionBanner = !hasAccess && filtered.length > 0;

    // sorting logic
    const sortedJobs = useMemo(() => {
        let list = [...filtered] as Job[];
        if (sortBy === "urgent") {
            list = [
                ...list.filter((j: Job) => j.isUrgent),
                ...list.filter((j: Job) => !j.isUrgent),
            ];
        } else if (sortBy === "budget_desc") {
            list = [...list].sort((a: Job, b: Job) => b.budget - a.budget);
        } else {
            // Default: recently added
            list = [...list].sort((a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return list;
    }, [filtered, sortBy]);

    const currentSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? "Urgent First";

    // Close sort menu on outside click
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setShowSortMenu(false);
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* ── Header ── */}
            <div className="border-b border-border bg-background">
                <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-2">Marketplace</p>
                            <h1 className="font-sans text-3xl md:text-5xl font-bold tracking-tight mb-2">Find Jobs</h1>
                            <p className="text-muted-foreground max-w-xl text-sm">
                                Browse photography &amp; videography jobs. Apply with Connects.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {isAuthenticated && user?.role === 'creative' && (
                                <ConnectsBadge count={connects} />
                            )}
                            {(user?.role === 'client' || user?.role === 'admin') && (
                                <Link to="/jobs/post">
                                    <Button className="gap-2">
                                        <PlusCircle className="h-4 w-4" strokeWidth={1.5} />
                                        Post a Job
                                    </Button>
                                </Link>
                            )}
                            {!isAuthenticated && (
                                <Link to="/signup">
                                    <Button variant="outline" className="gap-2">
                                        <PlusCircle className="h-4 w-4" strokeWidth={1.5} />
                                        Post a Job
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                {/* ── Search + Filter Row ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <input
                            type="text"
                            placeholder="Search jobs, locations…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 h-11 rounded-xl border border-border bg-card text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative" ref={sortRef}>
                        <Button
                            variant="outline"
                            className="gap-2 h-11 rounded-xl px-4 flex-shrink-0"
                            onClick={() => setShowSortMenu(v => !v)}
                        >
                            <ArrowUpDown className="h-4 w-4" strokeWidth={1.5} />
                            <span className="hidden sm:inline">{currentSortLabel}</span>
                        </Button>
                        <AnimatePresence>
                            {showSortMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center justify-between",
                                                sortBy === opt.value ? "font-semibold text-[hsl(var(--accent))]" : "text-muted-foreground"
                                            )}
                                        >
                                            {opt.label}
                                            {sortBy === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Filter toggle button */}
                    <Button
                        variant="outline"
                        className={cn("gap-2 h-11 rounded-xl px-5 flex-shrink-0", activeFilterCount > 0 && "border-[hsl(var(--accent))] text-[hsl(var(--accent))]")}
                        onClick={() => setShowFilters(v => !v)}
                    >
                        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-[hsl(var(--accent))] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* ── Expanded Filters ── */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="p-5 border border-border rounded-xl bg-card space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</label>
                                        <select
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))/50] text-muted-foreground cursor-pointer"
                                        >
                                            <option value="">Any Location</option>
                                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    {/* Max Budget */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Budget (USD)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 1000"
                                            value={maxBudget}
                                            onChange={e => setMaxBudget(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60"
                                        />
                                    </div>

                                    {/* Deadline */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deadline</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {DEADLINE_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setDeadlineDays(opt.value)}
                                                    className={cn(
                                                        "text-xs px-2.5 py-1 rounded-lg border transition-all duration-200",
                                                        deadlineDays === opt.value
                                                            ? "bg-foreground text-background border-foreground"
                                                            : "border-border hover:bg-muted"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Max Connects + Open only */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Connects</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 4"
                                            value={maxConnects}
                                            onChange={e => setMaxConnects(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60"
                                        />
                                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none mt-2">
                                            <input
                                                type="checkbox"
                                                checked={showOpen}
                                                onChange={e => setShowOpen(e.target.checked)}
                                                className="w-4 h-4 rounded accent-[hsl(var(--accent))]"
                                            />
                                            <span className="text-xs font-medium">Open jobs only</span>
                                        </label>
                                    </div>
                                </div>

                                {activeFilterCount > 0 && (
                                    <div className="pt-3 border-t border-border">
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1.5 text-xs text-[hsl(var(--accent))] hover:opacity-80 transition-opacity font-medium"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Category Tabs ── */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {['All', ...JOB_CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border",
                                selectedCategory === cat
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── Results count ── */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        <span className="font-semibold text-foreground text-sm">{sortedJobs.length}</span>
                        {' '}job{sortedJobs.length !== 1 ? 's' : ''} found
                        {sortedJobs.filter(j => j.isUrgent).length > 0 && (
                            <span className="ml-3 text-red-500 font-semibold">
                                · {sortedJobs.filter(j => j.isUrgent).length} urgent
                            </span>
                        )}
                    </p>
                </div>

                {/* ── Access restriction banner ── */}
                {showTunisiaRestrictionBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-muted/30 border border-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-3">
                            <Lock className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                            <div>
                                <p className="text-sm font-semibold">Viewing as Guest / Non-Resident</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    You can browse the job board, but <strong>applying to jobs</strong> is restricted to verified Tunisian residents.
                                </p>
                            </div>
                        </div>
                        {!isAuthenticated && (
                            <Link to="/signup">
                                <Button variant="outline" size="sm">Create Account</Button>
                            </Link>
                        )}
                    </motion.div>
                )}

                {/* ── Job Grid ── */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-border rounded-xl p-5 bg-card space-y-4">
                                <div className="flex justify-between gap-4">
                                    <Skeleton className="h-4 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-12 rounded-full" />
                                </div>
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <div className="pt-3 border-t border-border flex justify-between items-center">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-8 w-20 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sortedJobs.length === 0 ? (
                    <div className="text-center py-32 text-muted-foreground">
                        <Briefcase className="h-10 w-10 mx-auto mb-4 opacity-20" strokeWidth={1.2} />
                        <p className="text-lg font-semibold mb-1">No jobs match your filters</p>
                        <p className="text-sm">Try adjusting the category or search term</p>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="mt-4 text-xs text-[hsl(var(--accent))] underline underline-offset-2">
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {sortedJobs.map((job: Job, i: number) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.04 }}
                            >
                                <JobCard job={job} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
