import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle, ShoppingBag, SlidersHorizontal, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_GEAR_LISTINGS, GEAR_CATEGORIES, GEAR_BRANDS, CITIES } from "../data/mockData";
import type { GearCondition, GearCategory } from "../data/mockData";
import { GearMarketCard } from "../components/ui/GearMarketCard";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

const CONDITIONS: GearCondition[] = ["New", "Like New", "Used"];

const conditionBadgeClass: Record<GearCondition, string> = {
    "New": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-300/40",
    "Like New": "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-300/40",
    "Used": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-300/40",
};

export function GearMarket() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<GearCategory | 'All'>('All');
    const [selectedConditions, setSelectedConditions] = useState<GearCondition[]>([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [location, setLocation] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading] = useState(false);

    const toggleCondition = (c: GearCondition) => {
        setSelectedConditions(prev =>
            prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
        );
    };

    const activeFilterCount = [
        selectedBrand, minPrice, maxPrice, location,
        selectedConditions.length > 0 ? 'conditions' : ''
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSelectedBrand(''); setMinPrice(''); setMaxPrice('');
        setLocation(''); setSelectedConditions([]);
    };

    const filtered = MOCK_GEAR_LISTINGS.filter(item => {
        if (!item.isAvailable) return false;
        if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
        if (selectedConditions.length > 0 && !selectedConditions.includes(item.condition)) return false;
        if (selectedBrand && item.brand !== selectedBrand) return false;
        if (minPrice && item.price < parseInt(minPrice)) return false;
        if (maxPrice && item.price > parseInt(maxPrice)) return false;
        if (location && !item.location.toLowerCase().includes(location.toLowerCase())) return false;
        if (search) {
            const q = search.toLowerCase();
            if (!item.title.toLowerCase().includes(q) &&
                !item.description.toLowerCase().includes(q) &&
                !item.brand.toLowerCase().includes(q) &&
                !item.location.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* ── Header ── */}
            <div className="border-b border-border bg-background">
                <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-2">
                                Marketplace
                            </p>
                            <h1 className="font-sans text-3xl md:text-5xl font-bold tracking-tight mb-2">
                                Gear Market
                            </h1>
                            <p className="text-muted-foreground max-w-xl text-sm">
                                Buy &amp; sell photography and videography equipment from verified creatives.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Stats pill */}
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border text-sm">
                                <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--accent))]" strokeWidth={2} />
                                <span className="text-muted-foreground text-xs">{MOCK_GEAR_LISTINGS.filter(g => g.isVerifiedSeller).length} verified sellers</span>
                            </div>
                            <Link to="/gear/sell">
                                <Button className="gap-2 font-semibold">
                                    <PlusCircle className="h-4 w-4" strokeWidth={1.8} />
                                    Sell Gear
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                {/* ── Search + Filter Row ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <input
                            type="text"
                            placeholder="Search gear, brand, location…"
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
                                    {/* Brand */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand</label>
                                        <select
                                            value={selectedBrand}
                                            onChange={e => setSelectedBrand(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))/50] text-muted-foreground cursor-pointer"
                                        >
                                            <option value="">Any Brand</option>
                                            {GEAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Range (USD)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={e => setMinPrice(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={e => setMaxPrice(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60"
                                            />
                                        </div>
                                    </div>

                                    {/* Condition */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Condition</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {CONDITIONS.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => toggleCondition(c)}
                                                    className={cn(
                                                        "text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200",
                                                        selectedConditions.includes(c)
                                                            ? conditionBadgeClass[c]
                                                            : "border-border hover:bg-muted"
                                                    )}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

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
                    {(['All', ...GEAR_CATEGORIES] as const).map(cat => (
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
                        <span className="font-semibold text-foreground text-sm">{filtered.length}</span>
                        {' '}listing{filtered.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* ── Grid ── */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-border rounded-2xl overflow-hidden bg-card">
                                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32 text-muted-foreground">
                        <ShoppingBag className="h-10 w-10 mx-auto mb-4 opacity-20" strokeWidth={1.2} />
                        <p className="text-lg font-semibold mb-1">No listings match your filters</p>
                        <p className="text-sm">Try adjusting the category or search term</p>
                        {(activeFilterCount > 0 || search) && (
                            <button onClick={() => { clearFilters(); setSearch(''); }} className="mt-4 text-xs text-[hsl(var(--accent))] underline underline-offset-2">
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                            >
                                <GearMarketCard listing={item} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
