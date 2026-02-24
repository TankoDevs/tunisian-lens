import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Globe, Star, CheckCircle2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ARTISTS, COUNTRIES, CATEGORIES } from "../data/mockData";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { isArtistVerified } from "./ArtistProfile";
import { cn } from "../lib/utils";

const COUNTRY_FLAGS: Record<string, string> = {
    "Tunisia": "🇹🇳",
    "France": "🇫🇷",
    "UAE": "🇦🇪",
    "United Kingdom": "🇬🇧",
    "United States": "🇺🇸",
    "Germany": "🇩🇪",
    "Morocco": "🇲🇦",
    "Egypt": "🇪🇬",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹",
    "Turkey": "🇹🇷",
    "Lebanon": "🇱🇧",
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
            const matchesSearch =
                !searchQuery ||
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
        setSelectedCountry(null);
        setSelectedCategory(null);
        setMinPrice("");
        setMaxPrice("");
        setVerifiedOnly(false);
        setSearchQuery("");
    };

    const hasActiveFilters = !!(selectedCountry || selectedCategory || verifiedOnly || minPrice || maxPrice);

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <section className="bg-gradient-to-b from-muted/60 to-background border-b">
                <div className="container mx-auto px-4 py-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
                        Hire a Professional Photographer
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Browse verified photography talent worldwide. Filter by style, location, and budget.
                    </p>
                    {/* Search bar */}
                    <div className="max-w-xl mx-auto relative pt-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 mt-1 h-5 w-5 text-muted-foreground" strokeWidth={2} />
                        <Input
                            placeholder="Search by name, style, or country…"
                            className="pl-12 h-12 text-base rounded-full border-2 focus-visible:ring-0 focus-visible:border-foreground"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                {/* Filter Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{filteredArtists.length}</span> photographer{filteredArtists.length !== 1 ? "s" : ""} found
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                            >
                                <X className="h-3 w-3" /> Clear filters
                            </button>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
                        <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
                        Filters {hasActiveFilters && <span className="ml-1 w-4 h-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-bold">!</span>}
                    </Button>
                </div>

                {/* Expanded Filters Panel */}
                {showFilters && (
                    <div className="mb-8 p-5 border rounded-xl bg-card space-y-5 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Country</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {COUNTRIES.map(country => (
                                        <button
                                            key={country}
                                            onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                                            className={cn(
                                                "text-xs px-2.5 py-1 rounded-full border transition-colors",
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
                                <label className="text-sm font-semibold">Category</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                            className={cn(
                                                "text-xs px-2.5 py-1 rounded-full border transition-colors",
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
                                <label className="text-sm font-semibold">Price Range (USD)</label>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                    <span className="text-muted-foreground text-sm">–</span>
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Verified Only */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Verification</label>
                                <button
                                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                                    className={cn(
                                        "flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors w-full",
                                        verifiedOnly
                                            ? "bg-foreground text-background border-foreground"
                                            : "hover:bg-muted border-border"
                                    )}
                                >
                                    <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                                    Verified Professionals Only
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photographer Cards */}
                {filteredArtists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArtists.map((artist) => {
                            const verified = isArtistVerified(artist.id);
                            return (
                                <div
                                    key={artist.id}
                                    className="group bg-card border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
                                >
                                    {/* Header */}
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={artist.avatar}
                                            alt={artist.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-border flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-base truncate">{artist.name}</h3>
                                                {verified && <VerificationBadge size={16} />}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                                                <span className="truncate">{artist.location}</span>
                                                <span className="mx-1">·</span>
                                                <Globe className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                                                <span>{COUNTRY_FLAGS[artist.country] || ""} {artist.country}</span>
                                            </div>
                                            {/* Mock rating */}
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" strokeWidth={0} />
                                                <span className="text-xs font-medium">
                                                    {(4.5 + Math.random() * 0.4).toFixed(1)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({Math.floor(Math.random() * 80 + 20)} reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {artist.categories.map(cat => (
                                            <span key={cat} className="text-xs px-2 py-0.5 bg-secondary rounded-full">{cat}</span>
                                        ))}
                                    </div>

                                    {/* Bio snippet */}
                                    <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t mt-auto">
                                        <div>
                                            <span className="text-xs text-muted-foreground">Starting from</span>
                                            <p className="text-lg font-bold">${artist.startingPrice} <span className="text-sm font-normal text-muted-foreground">{artist.currency}</span></p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link to={`/artist/${artist.id}`}>
                                                <Button variant="outline" size="sm">Profile</Button>
                                            </Link>
                                            <Link to={`/hire/${artist.id}`}>
                                                <Button size="sm">Hire Me</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-3 text-muted-foreground">
                        <Globe size={48} strokeWidth={1} className="mx-auto opacity-30" />
                        <p className="text-xl font-semibold text-foreground">No photographers found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                        <Button variant="outline" onClick={clearFilters} className="mt-2">Clear all filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
