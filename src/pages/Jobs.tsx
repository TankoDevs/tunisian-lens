import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle, Briefcase, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";
import { JOB_CATEGORIES, CITIES } from "../data/mockData";
import { JobCard } from "../components/ui/JobCard";
import { ConnectsBadge } from "../components/ui/ConnectsBadge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/Skeleton";

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

    const connects = isAuthenticated && user ? getConnects(user.id) : 0;

    // We allow everyone to view jobs, but restrict posting/applying

    const filtered = jobs.filter(job => {
        if (showOpen && job.status !== 'open') return false;
        if (selectedCategory !== 'All' && job.category !== selectedCategory) return false;
        if (maxBudget && job.budget > parseInt(maxBudget)) return false;
        if (location && job.location && !job.location.toLowerCase().includes(location.toLowerCase())) return false;
        if (maxConnects && job.connectsRequired > parseInt(maxConnects)) return false;
        if (search && !job.title.toLowerCase().includes(search.toLowerCase()) &&
            !job.description.toLowerCase().includes(search.toLowerCase()) &&
            (!job.location || !job.location.toLowerCase().includes(search.toLowerCase()))) return false;
        return true;
    });

    const showTunisiaRestrictionBanner = !hasAccess && filtered.length > 0;

    // Sort urgent to top
    const sortedJobs = [
        ...filtered.filter(j => j.isUrgent),
        ...filtered.filter(j => !j.isUrgent),
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border">
                <div className="container mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-2">Marketplace</p>
                            <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-2">Find Jobs</h1>
                            <p className="text-muted-foreground max-w-xl">
                                Browse photography jobs from Tunisian clients. Apply with Connects.
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

            <div className="container mx-auto px-6 py-10">
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-3 mb-8 bg-card border border-border rounded-xl p-3 shadow-sm">
                    <div className="relative flex-[2]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                        <input
                            type="text"
                            placeholder="Search jobs or locations..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 h-11 rounded-lg border-none bg-muted/40 text-sm transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-sand-400 placeholder:text-muted-foreground/60"
                        />
                    </div>

                    <div className="hidden lg:block w-px h-8 bg-border self-center" />

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-[3]">
                        <select
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            className="flex-1 min-w-[130px] h-11 px-3 rounded-lg border-none bg-muted/40 text-sm transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-sand-400 text-muted-foreground cursor-pointer"
                        >
                            <option value="">Any Location</option>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <input
                            type="number"
                            placeholder="Max Budget $"
                            value={maxBudget}
                            onChange={e => setMaxBudget(e.target.value)}
                            className="flex-1 w-24 sm:w-auto h-11 px-4 rounded-lg border-none bg-muted/40 text-sm transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-sand-400 placeholder:text-muted-foreground/60"
                        />

                        <input
                            type="number"
                            placeholder="Max Connects"
                            value={maxConnects}
                            onChange={e => setMaxConnects(e.target.value)}
                            className="flex-1 w-28 sm:w-auto h-11 px-4 rounded-lg border-none bg-muted/40 text-sm transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-sand-400 placeholder:text-muted-foreground/60"
                        />

                        <div className="hidden sm:block w-px h-8 bg-border self-center" />

                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-foreground font-medium pl-1 pr-2 whitespace-nowrap">
                            <input
                                type="checkbox"
                                checked={showOpen}
                                onChange={e => setShowOpen(e.target.checked)}
                                className="w-4 h-4 rounded text-sand-500 accent-sand-500 border-border focus:ring-sand-500"
                            />
                            Open only
                        </label>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {['All', ...JOB_CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex-shrink-0 px-4 py-2 rounded-md text-xs font-medium transition-all duration-300
                                ${selectedCategory === cat
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider mt-6">
                    {sortedJobs.length} job{sortedJobs.length !== 1 ? 's' : ''} found
                    {sortedJobs.filter(j => j.isUrgent).length > 0 && (
                        <span className="ml-3 text-red-500 font-semibold">
                            · {sortedJobs.filter(j => j.isUrgent).length} urgent
                        </span>
                    )}
                </p>

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

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-border rounded-xl p-6 bg-card space-y-4">
                                <div className="flex justify-between gap-4">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <div className="pt-4 border-t border-border flex justify-between">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sortedJobs.length === 0 ? (
                    <div className="text-center py-32 text-muted-foreground">
                        <Briefcase className="h-10 w-10 mx-auto mb-4 opacity-20" strokeWidth={1.2} />
                        <p className="font-sans text-lg font-semibold mb-1">No jobs match your filters</p>
                        <p className="text-sm">Try adjusting the category or search term</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {sortedJobs.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.04 }}
                                className="relative"
                            >
                                {job.isUrgent && (
                                    <div className="absolute -top-2 left-4 z-10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white bg-red-500 px-2.5 py-1 rounded-full shadow">
                                        <Zap className="h-2.5 w-2.5" strokeWidth={2} fill="currentColor" />
                                        Urgent
                                    </div>
                                )}
                                <JobCard job={job} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
