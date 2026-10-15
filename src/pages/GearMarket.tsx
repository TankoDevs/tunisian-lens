import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<GearCategory | 'All'>('All');
    const [selectedConditions, setSelectedConditions] = useState<GearCondition[]>([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [location, setLocation] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading] = useState(false);

    useEffect(() => {
        const raw = searchParams.get("category") || searchParams.get("cat");
        if (raw) {
            const normalized = raw.toLowerCase().trim();
            const found = GEAR_CATEGORIES.find(c => 
                c.toLowerCase() === normalized || 
                c.toLowerCase().startsWith(normalized) || 
                normalized.startsWith(c.toLowerCase())
            );
            if (found) {
                setSelectedCategory(found);
            }
        }
    }, [searchParams]);

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
        <div className="min-h-screen bg-canvas text-alabaster">
            {/* ── Header ── */}
            <div className="border-b border-edge bg-surface/40 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre mb-2">
                                Hardware &amp; Optics Exchange
                            </p>
                            <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-alabaster mb-2">
                                Gear Exchange
                            </h1>
                            <p className="text-mist max-w-xl text-sm leading-relaxed">
                                Acquire and trade verified camera bodies, prime cinema glass, drones, and studio lighting within the Tunisian creative collective.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Stats pill */}
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-edge text-sm">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                                <span className="text-mist text-xs">{MOCK_GEAR_LISTINGS.filter(g => g.isVerifiedSeller).length} verified equipment owners</span>
                            </div>
                            <Link to="/gear/sell">
                                <Button className="gap-2 bg-ochre hover:bg-ochre/90 text-canvas font-semibold border-none rounded-xl">
                                    <PlusCircle className="h-4 w-4" strokeWidth={1.8} />
                                    List Equipment
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
                {/* ── Search + Filter Row ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/60" strokeWidth={1.5} />
                        <input
                            type="text"
                            placeholder="Search bodies, focal lengths, brands, governorates…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 h-11 rounded-xl border border-edge bg-surface text-sm text-alabaster transition-all duration-200 focus:outline-none focus:border-ochre placeholder:text-mist/40"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-alabaster transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        className={cn("gap-2 h-11 rounded-xl px-5 flex-shrink-0 bg-surface border-edge text-alabaster hover:bg-surface.elevated", activeFilterCount > 0 && "border-ochre text-ochre")}
                        onClick={() => setShowFilters(v => !v)}
                    >
                        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
                        <span className="text-xs font-medium">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="bg-ochre text-canvas rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
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
                            <div className="p-5 border border-edge rounded-2xl bg-surface space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {/* Brand */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mist">Brand / Manufacturer</label>
                                        <select
                                            value={selectedBrand}
                                            onChange={e => setSelectedBrand(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-edge bg-surface.elevated text-xs text-alabaster focus:outline-none focus:border-ochre cursor-pointer"
                                        >
                                            <option value="">All Brands</option>
                                            {GEAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mist">Price Bracket (USD)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={e => setMinPrice(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-edge bg-surface.elevated text-xs text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={e => setMaxPrice(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-edge bg-surface.elevated text-xs text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40"
                                            />
                                        </div>
                                    </div>

                                    {/* Condition */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mist">Physical Condition</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {CONDITIONS.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => toggleCondition(c)}
                                                    className={cn(
                                                        "text-[11px] px-3 py-1.5 rounded-lg border font-medium transition-all duration-200",
                                                        selectedConditions.includes(c)
                                                            ? conditionBadgeClass[c]
                                                            : "bg-surface.elevated border-edge text-mist hover:text-alabaster"
                                                    )}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mist">Governorate</label>
                                        <select
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-edge bg-surface.elevated text-xs text-alabaster focus:outline-none focus:border-ochre cursor-pointer"
                                        >
                                            <option value="">All Regions</option>
                                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {activeFilterCount > 0 && (
                                    <div className="pt-3 border-t border-edge">
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1.5 text-xs text-ochre hover:opacity-80 transition-opacity font-medium"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Reset filters
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
                                "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border",
                                selectedCategory === cat
                                    ? 'bg-ochre text-canvas border-ochre shadow-sm'
                                    : 'bg-surface border-edge text-mist hover:text-alabaster hover:border-ochre/40'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── Results count ── */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs text-mist uppercase tracking-widest">
                        <span className="font-mono font-medium text-alabaster text-sm">{filtered.length}</span>
                        {' '}item{filtered.length !== 1 ? 's' : ''} listed
                    </p>
                </div>

                {/* ── Grid ── */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="border border-edge rounded-2xl overflow-hidden bg-surface">
                                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                                <div className="p-5 space-y-3">
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                    <Skeleton className="h-6 w-1/3 rounded-md" />
                                    <Skeleton className="h-3 w-1/2 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32 text-mist">
                        <ShoppingBag className="h-10 w-10 mx-auto mb-4 opacity-30 text-ochre" strokeWidth={1.2} />
                        <p className="font-serif text-lg font-normal text-alabaster mb-1">No equipment matches your filter criteria</p>
                        <p className="text-sm text-mist">Try adjusting the brand, price bracket, or keyword search</p>
                        {(activeFilterCount > 0 || search) && (
                            <button onClick={() => { clearFilters(); setSearch(''); }} className="mt-4 text-xs text-ochre underline underline-offset-4">
                                Reset active filters
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
