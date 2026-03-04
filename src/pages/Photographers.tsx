import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Search, SlidersHorizontal, MapPin, Star, CheckCircle2, X,
    Camera, Video, Blend, ChevronLeft, ChevronRight, ArrowUpDown,
    Sparkles, Globe
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ARTISTS, COUNTRIES, CATEGORIES } from "../data/mockData";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { BadgePill } from "../components/ui/BadgePill";
import { Skeleton } from "../components/ui/Skeleton";
import { Tooltip } from "../components/ui/Tooltip";
import { isArtistVerified } from "../lib/verification";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { computeCreativeScore } from "../lib/creativeScore";


const COUNTRY_FLAGS: Record<string, string> = {
    "Tunisia": "🇹🇳", "France": "🇫🇷", "UAE": "🇦🇪", "United Kingdom": "🇬🇧",
    "United States": "🇺🇸", "Germany": "🇩🇪", "Morocco": "🇲🇦", "Egypt": "🇪🇬",
    "Spain": "🇪🇸", "Italy": "🇮🇹", "Turkey": "🇹🇷", "Lebanon": "🇱🇧",
};

const CREATIVE_TYPE_ICONS: Record<string, React.ReactNode> = {
    photographer: <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />,
    videographer: <Video className="h-3.5 w-3.5" strokeWidth={1.5} />,
    both: <Blend className="h-3.5 w-3.5" strokeWidth={1.5} />,
};

const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Lowest Price" },
    { value: "price_desc", label: "Highest Price" },
    { value: "rating_desc", label: "Highest Rated" },
];

const PAGE_SIZE = 9;

// deterministic rating from artist data
function getArtistRating(_artistId: string, name: string) {
    const rating = parseFloat((4.5 + (name.length % 5) * 0.1).toFixed(1));
    const reviews = (name.charCodeAt(0) % 80) + 20;
    return { rating, reviews };
}

// Cover image: first portfolio image
function getCoverImage(artist: typeof ARTISTS[number]) {
    return artist.portfolioImages?.[0] ?? artist.avatar;
}

export function Photographers() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [intlOnly, setIntlOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("relevance");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [page, setPage] = useState(1);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate network delay for skeletons
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const searchRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setShowSortMenu(false);
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    // Autosuggestions — match artist names
    const suggestions = useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        const q = searchQuery.toLowerCase();
        return ARTISTS
            .filter(a =>
                a.name.toLowerCase().includes(q) ||
                a.categories.some(c => c.toLowerCase().includes(q)) ||
                a.country.toLowerCase().includes(q)
            )
            .slice(0, 5);
    }, [searchQuery]);

    const filteredArtists = useMemo(() => {
        let list = ARTISTS.filter((artist) => {
            const lq = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                artist.name.toLowerCase().includes(lq) ||
                artist.bio.toLowerCase().includes(lq) ||
                artist.categories.some(c => c.toLowerCase().includes(lq)) ||
                artist.country.toLowerCase().includes(lq);
            const matchesCountry = !selectedCountry || artist.country === selectedCountry;
            const matchesCategory = !selectedCategory || artist.categories.includes(selectedCategory);
            const matchesType = !selectedType || artist.creativeType === selectedType || (selectedType === "both" && artist.creativeType === "both");
            const matchesVerified = !verifiedOnly || isArtistVerified(artist.id);
            const matchesIntl = !intlOnly || artist.internationalAvailable === true;
            const min = minPrice ? parseInt(minPrice) : 0;
            const max = maxPrice ? parseInt(maxPrice) : Infinity;
            const matchesPrice = artist.startingPrice >= min && artist.startingPrice <= max;
            return matchesSearch && matchesCountry && matchesCategory && matchesType && matchesVerified && matchesIntl && matchesPrice;
        });

        // Sorting
        if (sortBy === "relevance") {
            // Use creative score algorithm for internal relevance ranking
            list = [...list].sort((a, b) => {
                const scoreA = computeCreativeScore({
                    rating: getArtistRating(a.id, a.name).rating,
                    reviewCount: getArtistRating(a.id, a.name).reviews,
                    jobsCompleted: a.stats?.jobsCompleted,
                    successRate: a.stats?.successRate,
                    avgResponseHours: a.stats?.avgResponseHours,
                    portfolioCount: a.portfolioImages?.length,
                    badgeLevel: a.badgeLevel,
                });
                const scoreB = computeCreativeScore({
                    rating: getArtistRating(b.id, b.name).rating,
                    reviewCount: getArtistRating(b.id, b.name).reviews,
                    jobsCompleted: b.stats?.jobsCompleted,
                    successRate: b.stats?.successRate,
                    avgResponseHours: b.stats?.avgResponseHours,
                    portfolioCount: b.portfolioImages?.length,
                    badgeLevel: b.badgeLevel,
                });
                return scoreB - scoreA;
            });
        } else if (sortBy === "price_asc") list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
        else if (sortBy === "price_desc") list = [...list].sort((a, b) => b.startingPrice - a.startingPrice);
        else if (sortBy === "rating_desc") list = [...list].sort((a, b) => getArtistRating(b.id, b.name).rating - getArtistRating(a.id, a.name).rating);

        return list;
    }, [searchQuery, selectedCountry, selectedCategory, selectedType, verifiedOnly, intlOnly, minPrice, maxPrice, sortBy]);



    const totalPages = Math.ceil(filteredArtists.length / PAGE_SIZE);
    const pagedArtists = filteredArtists.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSelectedCountry(null); setSelectedCategory(null); setSelectedType(null);
        setMinPrice(""); setMaxPrice(""); setVerifiedOnly(false); setIntlOnly(false); setSearchQuery(""); setPage(1);
    };


    const hasActiveFilters = !!(selectedCountry || selectedCategory || selectedType || verifiedOnly || intlOnly || minPrice || maxPrice);

    const currentSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? "Relevance";

    // Reset page on filter/sort change
    useEffect(() => { setPage(1); }, [searchQuery, selectedCountry, selectedCategory, selectedType, verifiedOnly, minPrice, maxPrice, sortBy]);

    return (
        <div className="min-h-screen bg-background">
            {/* ── Hero Header ── */}
            <section className="relative overflow-hidden border-b border-border">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "28px 28px" }}
                />
                <div className="container mx-auto px-6 py-20 text-center relative z-10 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                            <Sparkles className="h-3 w-3" strokeWidth={2} />
                            <span>Creative Directory</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                            Find Your Creative
                        </h1>
                        <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed">
                            Browse world-class photographers and videographers. Filter by style, location, and budget to find your perfect match.
                        </p>
                    </motion.div>

                    {/* Search with autosuggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="max-w-xl mx-auto relative"
                        ref={searchRef}
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                        <Input
                            placeholder="Search by name, style, location…"
                            className="pl-12 h-14 text-base md:text-sm pr-10 shadow-sm rounded-xl"
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                            onFocus={() => setShowSuggestions(true)}
                            autoComplete="off"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {/* Suggestion Dropdown */}
                        <AnimatePresence>
                            {showSuggestions && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                                >
                                    {suggestions.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => { setSearchQuery(s.name); setShowSuggestions(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-left transition-colors"
                                        >
                                            <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{s.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{s.categories.slice(0, 2).join(" · ")} · {s.country}</p>
                                            </div>
                                            {CREATIVE_TYPE_ICONS[s.creativeType]}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Quick stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-6 text-xs text-muted-foreground"
                    >
                        {[
                            { label: "creatives", value: ARTISTS.length },
                            { label: "countries", value: COUNTRIES.length },
                            { label: "specialities", value: CATEGORIES.length },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center gap-1.5">
                                <span className="font-semibold text-foreground text-sm">{value}+</span>
                                <span>{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-8">
                {/* ── Sticky Toolbar ── */}
                <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-sm border-b border-border -mx-6 px-6 py-3 mb-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Left: Count + clear */}
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground text-sm">{filteredArtists.length}</span>
                                {" "}creative{filteredArtists.length !== 1 ? "s" : ""}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-xs text-[hsl(var(--accent))] hover:opacity-80 transition-opacity"
                                >
                                    <X className="h-3 w-3" /> Clear filters
                                </button>
                            )}
                        </div>

                        {/* Right: Type pills + Sort + Filter toggle */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Creative type quick filters */}
                            {["photographer", "videographer", "both"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                                    className={cn(
                                        "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 capitalize",
                                        selectedType === type
                                            ? "bg-foreground text-background border-foreground"
                                            : "border-border hover:bg-muted"
                                    )}
                                >
                                    {CREATIVE_TYPE_ICONS[type]} {type}
                                </button>
                            ))}

                            <div className="relative" ref={sortRef}>
                                <button
                                    onClick={() => setShowSortMenu(v => !v)}
                                    className="flex items-center gap-2 text-sm md:text-xs px-4 py-2 bg-background rounded-full border border-border hover:bg-muted transition-colors shadow-sm"
                                >
                                    <ArrowUpDown className="h-4 w-4 md:h-3 md:w-3" strokeWidth={2} />
                                    {currentSortLabel}
                                </button>
                                <AnimatePresence>
                                    {showSortMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                            transition={{ duration: 0.12 }}
                                            className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-md shadow-lg z-50 py-1 overflow-hidden"
                                        >
                                            {SORT_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors",
                                                        sortBy === opt.value ? "font-semibold text-foreground" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Filters toggle */}
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("gap-2 text-sm md:text-xs h-9 md:h-8 rounded-full px-4 shadow-sm", hasActiveFilters && "border-[hsl(var(--accent))] text-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5")}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="h-4 w-4 md:h-3.5 md:w-3.5" strokeWidth={1.5} />
                                Filters {hasActiveFilters ? "·" : ""}
                                {hasActiveFilters && (
                                    <span className="bg-[hsl(var(--accent))] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                        {[selectedCountry, selectedCategory, verifiedOnly || undefined, minPrice || undefined, maxPrice || undefined].filter(Boolean).length}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Expanded Filters ── */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="p-5 border border-border rounded-xl bg-card space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {/* Country */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {COUNTRIES.map(country => (
                                                <button
                                                    key={country}
                                                    onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                                                    className={cn(
                                                        "text-xs px-2.5 py-1 rounded-md border transition-all duration-200",
                                                        selectedCountry === country
                                                            ? "bg-foreground text-background border-foreground"
                                                            : "hover:bg-muted border-border"
                                                    )}
                                                >
                                                    {COUNTRY_FLAGS[country] || "🌍"} {country}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Category */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-hide">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                                    className={cn(
                                                        "text-xs px-2.5 py-1 rounded-md border transition-all duration-200 whitespace-nowrap",
                                                        selectedCategory === cat
                                                            ? "bg-foreground text-background border-foreground"
                                                            : "hover:bg-muted border-border"
                                                    )}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Price Range */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Range (USD)</label>
                                        <div className="flex gap-2 items-center">
                                            <Input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="h-9 text-sm" />
                                            <span className="text-muted-foreground text-xs">–</span>
                                            <Input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="h-9 text-sm" />
                                        </div>
                                    </div>
                                    {/* Verification */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification</label>
                                        <button
                                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                                            className={cn(
                                                "flex items-center gap-2 text-xs px-3 py-2 rounded-md border transition-all duration-200 w-full",
                                                verifiedOnly ? "bg-foreground text-background border-foreground" : "hover:bg-muted border-border"
                                            )}
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                                            Verified Only
                                        </button>
                                        {/* International filter */}
                                        <button
                                            onClick={() => setIntlOnly(!intlOnly)}
                                            className={cn(
                                                "flex items-center gap-2 text-xs px-3 py-2 rounded-md border transition-all duration-200 w-full mt-1",
                                                intlOnly ? "bg-blue-500 text-white border-blue-500" : "hover:bg-muted border-border"
                                            )}
                                        >
                                            <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                                            International Available
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Gallery Grid ── */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="group relative bg-card rounded-2xl overflow-hidden border border-border">
                                {/* Image Area */}
                                <div className="relative aspect-[4/3] w-full">
                                    <Skeleton className="w-full h-full" />
                                </div>
                                {/* Content Area */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-16 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : pagedArtists.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pagedArtists.map((artist, i) => {
                                const verified = isArtistVerified(artist.id);
                                const { rating, reviews } = getArtistRating(artist.id, artist.name);
                                const coverImg = getCoverImage(artist);
                                const isHovered = hoveredCard === artist.id;

                                return (
                                    <motion.div
                                        key={artist.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: i * 0.05 }}
                                        className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
                                        style={{
                                            transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                                            boxShadow: isHovered
                                                ? "0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08)"
                                                : "0 1px 4px rgba(0,0,0,0.04)",
                                            transition: "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s cubic-bezier(.25,.8,.25,1)"
                                        }}
                                        onMouseEnter={() => setHoveredCard(artist.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        {/* ── Cover Image ── */}
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={coverImg}
                                                alt={artist.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700"
                                                style={{ transform: isHovered ? "scale(1.06)" : "scale(1)" }}
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                            {/* Creative type badge */}
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full capitalize">
                                                {CREATIVE_TYPE_ICONS[artist.creativeType]}
                                                {artist.creativeType}
                                            </div>

                                            {/* Verified badge */}
                                            {verified && (
                                                <div className="absolute top-3 right-3">
                                                    <VerificationBadge size={16} />
                                                </div>
                                            )}

                                            {/* Bottom of cover: avatar + name */}
                                            <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                                <img
                                                    src={artist.avatar}
                                                    alt={artist.name}
                                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/80 flex-shrink-0"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <p className="text-white font-semibold text-sm leading-tight">{artist.name}</p>
                                                        {artist.badgeLevel && (
                                                            <BadgePill level={artist.badgeLevel} size="sm" />
                                                        )}
                                                    </div>
                                                    <p className="text-white/70 text-xs flex items-center gap-1">
                                                        <MapPin className="h-2.5 w-2.5" strokeWidth={1.5} />
                                                        {artist.location}, {COUNTRY_FLAGS[artist.country] || ""} {artist.country}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Hover portfolio strip */}
                                            <AnimatePresence>
                                                {isHovered && artist.portfolioImages?.length > 1 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 8 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute bottom-0 left-0 right-0 flex gap-0.5 p-0.5"
                                                    >
                                                        {artist.portfolioImages.slice(1).map((img, idx) => (
                                                            <div key={idx} className="flex-1 h-12 overflow-hidden rounded">
                                                                <img
                                                                    src={img}
                                                                    alt="portfolio"
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* ── Card Body ── */}
                                        <div className="p-4 space-y-3">
                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-1">
                                                {artist.categories.map(cat => (
                                                    <span
                                                        key={cat}
                                                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded-md"
                                                    >
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Bio */}
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {artist.bio}
                                            </p>

                                            {/* Footer: rating + price + actions */}
                                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                                <div className="flex items-center gap-3">
                                                    {/* Rating */}
                                                    <Tooltip content={`${reviews} verified client reviews`}>
                                                        <div className="flex items-center gap-1 cursor-help">
                                                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" strokeWidth={0} />
                                                            <span className="text-sm font-bold text-foreground">{rating}</span>
                                                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">({reviews} reviews)</span>
                                                        </div>
                                                    </Tooltip>
                                                    {/* Price */}
                                                    <div className="text-xs text-muted-foreground">
                                                        from <span className="font-bold text-foreground text-sm">${artist.startingPrice}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Link to={`/artist/${artist.id}`}>
                                                        <Button variant="outline" size="sm" className="text-xs h-8 px-3">
                                                            View Profile
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/hire/${artist.id}`}>
                                                        <Button size="sm" className="text-xs h-8 px-3 font-semibold shadow-sm">
                                                            Hire
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* ── Pagination ── */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-12">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="gap-1.5 text-xs"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                                </Button>
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={cn(
                                                "w-8 h-8 rounded-full text-xs font-medium transition-all",
                                                p === page
                                                    ? "bg-foreground text-background"
                                                    : "hover:bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="gap-1.5 text-xs"
                                >
                                    Next <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    /* ── Empty State ── */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-24 flex flex-col items-center text-center space-y-5 max-w-sm mx-auto"
                    >
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Search className="h-7 w-7 text-muted-foreground" strokeWidth={1.2} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-semibold">No creatives found</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                We couldn't find any creatives matching your search. Try adjusting your filters or explore all available talent.
                            </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={clearFilters} className="text-xs">
                                Clear all filters
                            </Button>
                            <Button onClick={() => { setSearchQuery(""); setShowFilters(false); }} className="text-xs">
                                Browse all
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
