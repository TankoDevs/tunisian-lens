import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ShieldCheck, MessageSquare, Share2, Tag, Calendar, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_GEAR_LISTINGS } from "../data/mockData";
import { GearMarketCard } from "../components/ui/GearMarketCard";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useCurrency } from "../lib/useCurrency";

const conditionColors = {
    "New": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    "Like New": "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    "Used": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export function GearListingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(0);
    const [showContact, setShowContact] = useState(false);
    const { formatPrice } = useCurrency();

    const listing = MOCK_GEAR_LISTINGS.find(g => g.id === id);

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div>
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" strokeWidth={1.2} />
                    <h2 className="text-xl font-semibold mb-2">Listing not found</h2>
                    <p className="text-sm text-muted-foreground mb-6">This item may have been sold or removed.</p>
                    <Link to="/gear"><Button>Back to Gear Market</Button></Link>
                </div>
            </div>
        );
    }

    const related = MOCK_GEAR_LISTINGS.filter(g => g.id !== listing.id && g.category === listing.category).slice(0, 3);
    const daysSince = Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / 86400000);

    return (
        <div className="min-h-screen bg-background">
            {/* Back nav */}
            <div className="border-b border-border bg-background sticky top-16 z-30">
                <div className="container mx-auto px-4 sm:px-6 h-12 flex items-center">
                    <button
                        onClick={() => navigate('/gear')}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                        Gear Market
                    </button>
                    <span className="text-muted-foreground mx-2 text-xs">/</span>
                    <span className="text-sm font-medium line-clamp-1 text-foreground">{listing.category}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
                    {/* ── Image Gallery ── */}
                    <div className="space-y-3">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] bg-muted rounded-2xl overflow-hidden">
                            <motion.img
                                key={activeImage}
                                src={listing.images[activeImage]}
                                alt={listing.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full object-cover"
                            />

                            {/* Condition overlay */}
                            <span className={cn("absolute top-4 left-4 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full", conditionColors[listing.condition])}>
                                {listing.condition}
                            </span>

                            {/* Navigation arrows (if multiple images) */}
                            {listing.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImage(i => (i - 1 + listing.images.length) % listing.images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setActiveImage(i => (i + 1) % listing.images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {listing.images.length > 1 && (
                            <div className="flex gap-2">
                                {listing.images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={cn(
                                            "relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200",
                                            activeImage === i ? "border-[hsl(var(--accent))]" : "border-transparent hover:border-border"
                                        )}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Listing Info ── */}
                    <div className="space-y-6">
                        {/* Title + Price */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
                                    {listing.category}
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
                                    {listing.brand}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 leading-snug">
                                {listing.title}
                            </h1>
                            <p className="text-3xl font-bold text-foreground">
                                {formatPrice(listing.price)}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Location</p>
                                    <p className="text-sm font-medium">{listing.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
                                <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Condition</p>
                                    <p className="text-sm font-medium">{listing.condition}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border border-border col-span-2">
                                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Listed</p>
                                    <p className="text-sm font-medium">{daysSince === 0 ? 'Today' : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
                        </div>

                        {/* Seller Card */}
                        <div className="p-4 rounded-2xl border border-border bg-card">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Seller</h3>
                            <div className="flex items-center gap-3">
                                <Link to={`/artist/${listing.sellerId}`}>
                                    <img
                                        src={listing.sellerAvatar}
                                        alt={listing.sellerName}
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-border hover:ring-[hsl(var(--accent))] transition-all"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/artist/${listing.sellerId}`} className="font-semibold text-sm hover:text-[hsl(var(--accent))] transition-colors">
                                        {listing.sellerName}
                                    </Link>
                                    {listing.isVerifiedSeller && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--accent))]" strokeWidth={2} />
                                            <span className="text-xs text-[hsl(var(--accent))] font-semibold">Verified Seller</span>
                                        </div>
                                    )}
                                </div>
                                <Link to={`/artist/${listing.sellerId}`}>
                                    <Button variant="outline" size="sm" className="text-xs">
                                        View Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <Button
                                className="flex-1 h-12 text-base font-semibold gap-2"
                                onClick={() => setShowContact(v => !v)}
                            >
                                <MessageSquare className="h-4 w-4" strokeWidth={1.8} />
                                Contact Seller
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-4"
                                title="Share listing"
                                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                            >
                                <Share2 className="h-4 w-4" strokeWidth={1.5} />
                            </Button>
                        </div>

                        {/* Contact info reveal */}
                        {showContact && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl border border-[hsl(var(--accent))/30] bg-[hsl(var(--accent))/5] text-sm space-y-2"
                            >
                                <p className="font-semibold text-foreground mb-1">Contact {listing.sellerName}</p>
                                <p className="text-muted-foreground text-xs">
                                    Send a message through the platform or use the information below:
                                </p>
                                <Link
                                    to="/messages"
                                    className="flex items-center gap-2 text-[hsl(var(--accent))] font-medium hover:underline text-sm"
                                >
                                    <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                                    Open Messages
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ── Related Listings ── */}
                {related.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">More {listing.category}s</h2>
                            <Link to="/gear" className="text-xs text-[hsl(var(--accent))] hover:underline font-medium">
                                View all
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {related.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.3 }}
                                >
                                    <GearMarketCard listing={item} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
