import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, PlusCircle, Briefcase, Lock } from "lucide-react";
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
                    className="text-center max-w-md mx-auto px-6 space-y-6"
                >
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto">
                        <Lock className="h-9 w-9 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="text-4xl mb-3">🇹🇳</div>
                        <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">Tunisia Marketplace Only</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            The job marketplace is exclusively available to <strong>Tunisian citizens and residents</strong>.
                            This keeps the platform focused, payment-friendly, and locally trusted.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border bg-muted/40 text-sm text-muted-foreground text-left space-y-2">
                        <p className="font-medium text-foreground">Why this restriction?</p>
                        <ul className="space-y-1 list-disc list-inside">
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
            {/* Hero Banner */}
            <div className="border-b bg-gradient-to-br from-background via-background to-primary/5">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium mb-2">
                                <Briefcase className="h-4 w-4" strokeWidth={2} />
                                Photography Marketplace
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-2">Find Jobs</h1>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Browse photography jobs from Tunisian clients. Apply with Connects.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {isAuthenticated && user?.role === 'photographer' && (
                                <ConnectsBadge count={connects} />
                            )}
                            {(user?.role === 'client' || user?.role === 'admin') && (
                                <Link to="/jobs/post">
                                    <Button className="gap-2">
                                        <PlusCircle className="h-4 w-4" strokeWidth={2} />
                                        Post a Job
                                    </Button>
                                </Link>
                            )}
                            {!isAuthenticated && (
                                <Link to="/signup">
                                    <Button variant="outline" className="gap-2">
                                        <PlusCircle className="h-4 w-4" strokeWidth={2} />
                                        Post a Job
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 h-10 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                        <input
                            type="number"
                            placeholder="Max budget $"
                            value={maxBudget}
                            onChange={e => setMaxBudget(e.target.value)}
                            className="w-32 h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showOpen}
                                onChange={e => setShowOpen(e.target.checked)}
                                className="rounded"
                            />
                            Open only
                        </label>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
                    {['All', ...JOB_CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                                ${selectedCategory === cat
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-accent border-border'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-sm text-muted-foreground mb-4">
                    {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
                </p>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" strokeWidth={1.5} />
                        <p className="text-lg font-medium">No jobs match your filters</p>
                        <p className="text-sm mt-1">Try adjusting the category or search term</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
