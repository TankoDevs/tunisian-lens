import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Tag } from "lucide-react";
import { motion } from "framer-motion";
import type { GearListing } from "../../data/mockData";
import { useCurrency } from "../../lib/useCurrency";

interface GearMarketCardProps {
    listing: GearListing;
}

const conditionColors: Record<GearListing["condition"], string> = {
    "New": "bg-emerald-500/90 text-white",
    "Like New": "bg-sky-500/90 text-white",
    "Used": "bg-amber-500/90 text-white",
};

export function GearMarketCard({ listing }: GearMarketCardProps) {
    const { formatPrice } = useCurrency();
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
        >
            <Link
                to={`/gear/${listing.id}`}
                className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-foreground/10 transition-all duration-300"
            >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Condition badge */}
                    <span
                        className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${conditionColors[listing.condition]}`}
                    >
                        {listing.condition}
                    </span>
                    {/* Category badge */}
                    <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                        {listing.category}
                    </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-[hsl(var(--accent))] transition-colors duration-200">
                        {listing.title}
                    </h3>

                    {/* Price */}
                    <p className="text-xl font-bold tracking-tight text-foreground">
                        {formatPrice(listing.price)}
                    </p>

                    {/* Brand & Location */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                            <span className="text-xs truncate">{listing.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0">
                            <Tag className="h-3.5 w-3.5" strokeWidth={1.5} />
                            <span className="text-xs">{listing.brand}</span>
                        </div>
                    </div>

                    {/* Seller */}
                    <div className="pt-3 border-t border-border flex items-center gap-2.5">
                        <img
                            src={listing.sellerAvatar}
                            alt={listing.sellerName}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                        />
                        <span className="text-xs text-muted-foreground truncate flex-1">{listing.sellerName}</span>
                        {listing.isVerifiedSeller && (
                            <div className="flex items-center gap-1 text-[hsl(var(--accent))] flex-shrink-0" title="Verified Seller">
                                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                                <span className="text-[10px] font-semibold">Verified</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
