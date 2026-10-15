import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Tag } from "lucide-react";
import { motion } from "framer-motion";
import type { GearListing } from "../../data/mockData";
import { useCurrency } from "../../lib/useCurrency";

interface GearMarketCardProps {
    listing: GearListing;
}

const conditionColors: Record<GearListing["condition"], string> = {
    "New": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    "Like New": "bg-sidi.azure/20 text-sidi.azure border border-sidi.azure/30",
    "Used": "bg-ochre/20 text-ochre border border-ochre/30",
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
                className="group block bg-surface border border-edge rounded-2xl overflow-hidden hover:shadow-2xl hover:border-ochre/40 transition-all duration-300"
            >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface.elevated">
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Condition badge */}
                    <span
                        className={`absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md ${conditionColors[listing.condition]}`}
                    >
                        {listing.condition}
                    </span>
                    {/* Category badge */}
                    <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-canvas/80 text-alabaster border border-edge backdrop-blur-md">
                        {listing.category}
                    </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    {/* Title */}
                    <h3 className="font-sans text-sm font-medium leading-snug line-clamp-2 text-alabaster group-hover:text-ochre transition-colors duration-200">
                        {listing.title}
                    </h3>

                    {/* Price */}
                    <p className="font-mono text-xl font-medium tracking-tight text-ochre">
                        {formatPrice(listing.price)}
                    </p>

                    {/* Brand & Location */}
                    <div className="flex items-center justify-between gap-2 text-mist">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin className="h-3.5 w-3.5 text-sidi.azure flex-shrink-0" strokeWidth={1.5} />
                            <span className="text-xs truncate">{listing.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Tag className="h-3.5 w-3.5 text-mist/60" strokeWidth={1.5} />
                            <span className="text-xs font-mono">{listing.brand}</span>
                        </div>
                    </div>

                    {/* Seller */}
                    <div className="pt-3 border-t border-edge flex items-center gap-2.5">
                        <img
                            src={listing.sellerAvatar}
                            alt={listing.sellerName}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-edge"
                        />
                        <span className="text-xs text-mist truncate flex-1">{listing.sellerName}</span>
                        {listing.isVerifiedSeller && (
                            <div className="flex items-center gap-1 text-emerald-400 flex-shrink-0" title="Verified Seller">
                                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">Verified</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
