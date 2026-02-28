import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle, Briefcase, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { useTunisianAccess } from "../lib/useTunisianAccess";
import { JOB_CATEGORIES } from "../data/mockData";
import { JobCard } from "../components/ui/JobCard";
import { ConnectsBadge } from "../components/ui/ConnectsBadge";
import { Button } from "../components/ui/button";

export function Jobs() {
    const { jobs, getConnects } = useMarketplace();
    const { user, isAuthenticated } = useAuth();
    const { hasAccess } = useTunisianAccess();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [maxBudget, setMaxBudget] = useState('');
    const [showOpen, setShowOpen] = useState(true);

    const connects = isAuthenticated && user ? getConnects(user.id) : 0;

    // Tunisia-only marketplace gate
    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-md mx-auto px-6 space-y-8"
                >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto">
                        <Lock className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🇹🇳</div>
                        <h1 className="font-sans text-3xl font-bold tracking-tight mb-3">Tunisia Marketplace Only</h1>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            The job marketplace is exclusively available to <strong>Tunisian citizens and residents</strong>.
                            This keeps the platform focused, payment-friendly, and locally trusted.
                        </p>
                    </div>
                    <div className="p-5 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground text-left space-y-2">
                        <p className="font-medium text-foreground">Why this restriction?</p>
                        <ul className="space-y-1 list-disc list-inside text-xs">
                            <li>Tunisian currency &amp; payment regulations</li>
                            <li>Local trust and identity verification</li>
                            <li>Simplified moderation &amp; dispute handling</li>
                        </ul>
                    </div>
                    <div className="flex gap-3 justify-center flex-wrap">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/signup"><Button>Create Account</Button></Link>
                                <Link to="/login"><Button variant="outline">Log In</Button></Link>
                            </>
                        ) : (
                            <Link to="/explore"><Button variant="outline">Browse Portfolios</Button></Link>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    const filtered = jobs.filter(job => {
        if (showOpen && job.status !== 'open') return false;
        if (selectedCategory !== 'All' && job.category !== selectedCategory) return false;
        if (maxBudget && job.budget > parseInt(maxBudget)) return false;
        if (search && !job.title.toLowerCase().includes(search.toLowerCase()) &&
            !job.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

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
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 rounded-md border border-border bg-background text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400 placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            placeholder="Max budget $"
                            value={maxBudget}
                            onChange={e => setMaxBudget(e.target.value)}
                            className="w-32 h-11 px-4 rounded-md border border-border bg-background text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400 placeholder:text-muted-foreground/50"
                        />
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-muted-foreground">
                            <input
                                type="checkbox"
                                checked={showOpen}
                                onChange={e => setShowOpen(e.target.checked)}
                                className="rounded accent-sand-400"
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
                <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider">
                    {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
                </p>

                {filtered.length === 0 ? (
                    <div className="text-center py-32 text-muted-foreground">
                        <Briefcase className="h-10 w-10 mx-auto mb-4 opacity-20" strokeWidth={1.2} />
                        <p className="font-sans text-lg font-semibold mb-1">No jobs match your filters</p>
                        <p className="text-sm">Try adjusting the category or search term</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((job, i) => (
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
