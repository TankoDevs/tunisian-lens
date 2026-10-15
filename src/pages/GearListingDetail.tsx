import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ShieldCheck, MessageSquare, Share2, Tag, Calendar, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_GEAR_LISTINGS } from "../data/mockData";
import { GearMarketCard } from "../components/ui/GearMarketCard";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useCurrency } from "../lib/useCurrency";

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
        <div className="min-h-screen bg-canvas text-alabaster">
            {/* Back nav */}
            <div className="border-b border-edge bg-surface/50 backdrop-blur-md sticky top-16 z-30">
                <div className="container mx-auto px-4 sm:px-6 h-12 flex items-center">
                    <button
                        onClick={() => navigate('/gear')}
                        className="flex items-center gap-1.5 text-mist hover:text-ochre transition-colors text-xs font-semibold uppercase tracking-wider"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                        Gear Exchange
                    </button>
                    <span className="text-edge mx-2.5 text-xs">/</span>
                    <span className="text-xs font-mono text-alabaster/80 line-clamp-1">{listing.category}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
                    {/* ── Image Gallery ── */}
                    <div className="space-y-3">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] bg-surface.elevated border border-edge rounded-2xl overflow-hidden">
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
                            <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-md bg-canvas/80 text-ochre border border-edge backdrop-blur-md">
                                {listing.condition}
                            </span>

                            {/* Navigation arrows (if multiple images) */}
                            {listing.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImage(i => (i - 1 + listing.images.length) % listing.images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-canvas/80 rounded-full flex items-center justify-center text-alabaster border border-edge hover:bg-canvas transition-colors backdrop-blur-md"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setActiveImage(i => (i + 1) % listing.images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-canvas/80 rounded-full flex items-center justify-center text-alabaster border border-edge hover:bg-canvas transition-colors backdrop-blur-md"
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
                                            activeImage === i ? "border-ochre shadow-sm" : "border-edge hover:border-mist/40"
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
                                <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-surface border border-edge rounded-md text-ochre">
                                    {listing.category}
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-surface border border-edge rounded-md text-mist">
                                    {listing.brand}
                                </span>
                            </div>
                            <h1 className="font-serif text-2xl md:text-3xl font-normal tracking-tight text-alabaster mb-4 leading-snug">
                                {listing.title}
                            </h1>
                            <p className="font-mono text-3xl font-medium text-ochre">
                                {formatPrice(listing.price)}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-surface border border-edge">
                                <MapPin className="h-4 w-4 text-sidi.azure flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-mist/60 font-semibold">Location</p>
                                    <p className="text-xs font-medium text-alabaster truncate">{listing.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-surface border border-edge">
                                <Tag className="h-4 w-4 text-ochre flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-mist/60 font-semibold">Condition</p>
                                    <p className="text-xs font-medium text-alabaster">{listing.condition}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-surface border border-edge col-span-2">
                                <Calendar className="h-4 w-4 text-mist flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-mist/60 font-semibold">Listed On</p>
                                    <p className="text-xs font-medium text-alabaster">{daysSince === 0 ? 'Today' : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-5 rounded-2xl bg-surface border border-edge">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-ochre mb-2">Technical Condition &amp; Provenance</h3>
                            <p className="text-xs md:text-sm text-mist leading-relaxed font-light">{listing.description}</p>
                        </div>

                        {/* Seller Card */}
                        <div className="p-4 rounded-2xl border border-edge bg-surface">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-mist/60 mb-3">Equipment Custodian</h3>
                            <div className="flex items-center gap-3">
                                <Link to={`/artist/${listing.sellerId}`}>
                                    <img
                                        src={listing.sellerAvatar}
                                        alt={listing.sellerName}
                                        className="h-12 w-12 rounded-full object-cover ring-1 ring-edge hover:ring-ochre transition-all"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/artist/${listing.sellerId}`} className="font-medium text-sm text-alabaster hover:text-ochre transition-colors">
                                        {listing.sellerName}
                                    </Link>
                                    {listing.isVerifiedSeller && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                                            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Verified Seller</span>
                                        </div>
                                    )}
                                </div>
                                <Link to={`/artist/${listing.sellerId}`}>
                                    <Button variant="outline" size="sm" className="text-xs border-edge text-alabaster hover:bg-surface.elevated">
                                        View Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <Button
                                className="flex-1 h-12 text-sm font-semibold gap-2 bg-ochre hover:bg-ochre/90 text-canvas border-none rounded-xl"
                                onClick={() => setShowContact(v => !v)}
                            >
                                <MessageSquare className="h-4 w-4" strokeWidth={1.8} />
                                Contact Custodian
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-4 border-edge text-alabaster hover:bg-surface.elevated rounded-xl"
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
                                className="p-4 rounded-xl border border-ochre/30 bg-ochre/10 text-sm space-y-2"
                            >
                                <p className="font-semibold text-alabaster mb-1">Inquire with {listing.sellerName}</p>
                                <p className="text-mist text-xs">
                                    Direct messages are securely encrypted on Tunisian Lens:
                                </p>
                                <Link
                                    to="/messages"
                                    className="flex items-center gap-2 text-ochre font-medium hover:underline text-xs"
                                >
                                    <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                                    Open Encrypted Chat
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ── Related Listings ── */}
                {related.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-edge">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-xl font-normal text-alabaster">More {listing.category}s in Circulation</h2>
                            <Link to="/gear" className="text-xs text-ochre hover:underline uppercase tracking-wider font-semibold">
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
