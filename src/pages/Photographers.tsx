import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Globe, Star, CheckCircle2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ARTISTS, COUNTRIES, CATEGORIES } from "../data/mockData";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { isArtistVerified } from "../lib/verification";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

const COUNTRY_FLAGS: Record<string, string> = {
    "Tunisia": "🇹🇳", "France": "🇫🇷", "UAE": "🇦🇪", "United Kingdom": "🇬🇧",
    "United States": "🇺🇸", "Germany": "🇩🇪", "Morocco": "🇲🇦", "Egypt": "🇪🇬",
    "Spain": "🇪🇸", "Italy": "🇮🇹", "Turkey": "🇹🇷", "Lebanon": "🇱🇧",
};

export function Photographers() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const filteredArtists = useMemo(() => {
        return ARTISTS.filter((artist) => {
            const lowerQuery = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                artist.name.toLowerCase().includes(lowerQuery) ||
                artist.bio.toLowerCase().includes(lowerQuery) ||
                artist.categories.some(c => c.toLowerCase().includes(lowerQuery)) ||
                artist.country.toLowerCase().includes(lowerQuery);
            const matchesCountry = !selectedCountry || artist.country === selectedCountry;
            const matchesCategory = !selectedCategory || artist.categories.includes(selectedCategory);
            const isVerified = isArtistVerified(artist.id);
            const matchesVerified = !verifiedOnly || isVerified;
            const min = minPrice ? parseInt(minPrice) : 0;
            const max = maxPrice ? parseInt(maxPrice) : Infinity;
            const matchesPrice = artist.startingPrice >= min && artist.startingPrice <= max;
            return matchesSearch && matchesCountry && matchesCategory && matchesVerified && matchesPrice;
        });
    }, [searchQuery, selectedCountry, selectedCategory, verifiedOnly, minPrice, maxPrice]);

    const clearFilters = () => {
        setSelectedCountry(null); setSelectedCategory(null);
        setMinPrice(""); setMaxPrice("");
        setVerifiedOnly(false); setSearchQuery("");
    };

    const hasActiveFilters = !!(selectedCountry || selectedCategory || verifiedOnly || minPrice || maxPrice);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="border-b border-border">
                <div className="container mx-auto px-6 py-16 text-center space-y-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500">Directory</p>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
                        Find Your Creative
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Browse verified photography talent worldwide. Filter by style, location, and budget.
                    </p>
                    <div className="max-w-xl mx-auto relative pt-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 mt-1 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <Input
                            placeholder="Search by name, style, or country…"
                            className="pl-11 h-12 text-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-10">
                {/* Filter Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            <span className="font-semibold text-foreground">{filteredArtists.length}</span> creative{filteredArtists.length !== 1 ? "s" : ""}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-xs text-sand-600 hover:text-sand-700 dark:text-sand-400"
                            >
                                <X className="h-3 w-3" /> Clear
                            </button>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => setShowFilters(!showFilters)}>
                        <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Filters
                    </Button>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-8 p-6 border border-border rounded-lg bg-card space-y-5 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                            className={cn(
                                                "text-xs px-2.5 py-1 rounded-md border transition-all duration-200",
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
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Range (USD)</label>
                                <div className="flex gap-2 items-center">
                                    <Input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="h-9 text-sm" />
                                    <span className="text-muted-foreground text-xs">–</span>
                                    <Input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="h-9 text-sm" />
                                </div>
                            </div>
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
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Creative Cards */}
                {filteredArtists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredArtists.map((artist, i) => {
                            const verified = isArtistVerified(artist.id);
                            return (
                                <motion.div
                                    key={artist.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.04 }}
                                    className="group bg-card border border-border rounded-lg p-6 card-hover flex flex-col gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={artist.avatar}
                                            alt={artist.name}
                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-sand-100 dark:ring-sand-900 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-serif font-semibold text-base truncate">{artist.name}</h3>
                                                {verified && <VerificationBadge size={14} />}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                <MapPin className="h-3 w-3 flex-shrink-0" strokeWidth={1.5} />
                                                <span className="truncate">{artist.location}</span>
                                                <span className="mx-0.5">·</span>
                                                <Globe className="h-3 w-3 flex-shrink-0" strokeWidth={1.5} />
                                                <span>{COUNTRY_FLAGS[artist.country] || ""} {artist.country}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-1.5">
                                                <Star className="h-3 w-3 fill-sand-400 text-sand-400" strokeWidth={0} />
                                                <span className="text-xs font-medium">
                                                    {(4.5 + (artist.name.length % 5) * 0.1).toFixed(1)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({(artist.name.charCodeAt(0) % 80) + 20})
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {artist.categories.map(cat => (
                                            <span key={cat} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sand-50 text-sand-700 dark:bg-sand-900/20 dark:text-sand-400 rounded">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{artist.bio}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                        <div>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">From</span>
                                            <p className="text-lg font-serif font-bold">
                                                ${artist.startingPrice}
                                                <span className="text-xs font-sans font-normal text-muted-foreground ml-1">{artist.currency}</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link to={`/artist/${artist.id}`}>
                                                <Button variant="outline" size="sm" className="text-xs">Profile</Button>
                                            </Link>
                                            <Link to={`/hire/${artist.id}`}>
                                                <Button size="sm" className="text-xs">Hire</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-4 text-muted-foreground">
                        <Globe size={40} strokeWidth={1} className="mx-auto opacity-20" />
                        <p className="font-serif text-lg font-semibold text-foreground">No creatives found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                        <Button variant="outline" onClick={clearFilters} className="mt-2 text-xs">Clear all filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
