import { useState } from "react";
import { ArrowRight, Camera, Video, CheckCircle, Shield, Star, Zap, Crown, Heart, Package, Cloud, Layers, Sparkles, Volume2, VolumeX, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ARTISTS, MOCK_JOBS } from "../data/mockData";
import { motion } from "framer-motion";
import { isArtistVerified } from "../lib/verification";
import { useCurrency } from "../lib/useCurrency";
import { ProfileAvatar } from "../components/ui/ProfileAvatar";
import { getPhotosByRegion } from "../data/photos";
import { GalleryGrid } from "../components/GalleryGrid";
import { PhotoModal } from "../components/PhotoModal";
import type { PhotoItem } from "../types/photo";

const FEATURED_ARTISTS = ARTISTS.slice(0, 3);
const RECENT_JOBS = MOCK_JOBS.filter(j => j.status === "open").slice(0, 3);

const CREATIVE_TYPE_ICON = {
    photographer: <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />,
    videographer: <Video className="h-3.5 w-3.5" strokeWidth={1.5} />,
    both: <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />,
};

// deterministic rating from artist data
function getArtistRating(name: string) {
    const rating = parseFloat((4.5 + (name.length % 5) * 0.1).toFixed(1));
    const reviews = (name.charCodeAt(0) % 80) + 20;
    return { rating, reviews };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function Home() {
    const { formatPrice } = useCurrency();
    const [selectedRegion, setSelectedRegion] = useState<string>('All');
    const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
    const [isPlayingSound, setIsPlayingSound] = useState(false);

    const displayedPhotos = getPhotosByRegion(selectedRegion);

    return (
        <div className="space-y-0 bg-canvas text-alabaster">

            {/* ──────── HERO ──────── */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-edge">
                {/* Background with calm film-grade tone */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=85"
                        alt="Tunisian desert twilight"
                        className="h-full w-full object-cover scale-105 filter brightness-[0.45] contrast-[1.1] transition-transform duration-1000 ease-out"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C0E]/70 via-[#0B0C0E]/40 to-[#0B0C0E]" />
                    <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-[#0B0C0E]" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl px-6 py-20 sm:py-28 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        {/* Archival Eyebrow */}
                        <div className="flex justify-center">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ochre bg-surface/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-edge shadow-sm flex items-center gap-2">
                                <Sparkles size={13} className="text-ochre" /> Archival Visual Dispatches • North Africa
                            </span>
                        </div>

                        {/* Headlines */}
                        <div className="space-y-3">
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal tracking-tight text-alabaster leading-[1.06]">
                                Tunisian Lens
                            </h1>
                            <p className="font-serif italic text-2xl sm:text-3xl text-ochre-light font-normal">
                                Framing the Soul of Tunisia
                            </p>
                            <p className="pt-3 text-sm sm:text-base md:text-lg text-mist max-w-2xl mx-auto leading-relaxed font-light">
                                A quiet, museum-grade survey of light, living memory, and architectural heritage from the Mediterranean azure to the Saharan silence.
                            </p>
                        </div>

                        {/* Provenance Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2 text-xs text-mist">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-ochre" />
                                <span className="font-semibold text-alabaster">3,480+</span> Archival Plates
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-sidi" />
                                <span className="font-semibold text-alabaster">24</span> Governorates
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="font-semibold text-alabaster">Verified</span> Heritage Optics
                            </div>
                        </div>

                        {/* Field Audio Note Simulator */}
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => setIsPlayingSound(!isPlayingSound)}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface/90 hover:bg-surface-elevated border border-edge text-xs text-mist transition-all duration-300 hover:border-ochre/40 shadow-sm"
                            >
                                <div className="w-5 h-5 rounded-full bg-ochre/15 text-ochre flex items-center justify-center">
                                    {isPlayingSound ? <Volume2 size={12} className="animate-pulse" /> : <VolumeX size={12} />}
                                </div>
                                <span className="text-[11px] tracking-wide">
                                    {isPlayingSound ? "Ambient: Mediterranean Sea Breeze & Andalusian Oud" : "Field Recording: Sidi Bou Said Atmosphere"}
                                </span>
                                {isPlayingSound && (
                                    <span className="flex items-center gap-0.5 ml-1">
                                        <span className="w-1 h-3 bg-ochre animate-bounce rounded-full" />
                                        <span className="w-1 h-4 bg-ochre animate-bounce delay-75 rounded-full" />
                                        <span className="w-1 h-2 bg-ochre animate-bounce delay-150 rounded-full" />
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                            <a href="#stories" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto rounded-lg h-12 px-8 text-xs uppercase tracking-wider font-semibold bg-ochre hover:bg-ochre-light text-canvas shadow-xl shadow-ochre/15 transition-all">
                                    Explore Cultural Archive
                                </Button>
                            </a>
                            <Link to="/submit" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto bg-surface/80 backdrop-blur-md text-alabaster border-edge hover:bg-surface-elevated hover:border-ochre/30 h-12 px-8 text-xs uppercase tracking-wider font-semibold rounded-lg"
                                >
                                    Submit Photographic Work
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
 
            {/* ──────── CULTURAL STORIES & MASONRY GALLERY ──────── */}
            <section id="stories" className="bg-canvas text-alabaster relative py-24 border-b border-edge scroll-mt-20">
                <div className="container mx-auto px-4 md:px-8">
                    <FadeUp className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ochre flex items-center justify-center gap-2">
                            <Sparkles size={14} /> Curated Cultural Monographs
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-alabaster tracking-tight">
                            Tunisia Through the Lens
                        </h2>
                        <p className="text-mist text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                            A curated visual archive capturing Tunisia’s living civilization—from the blue doors of Sidi Bou Said to the golden Roman arches of El Jem and the silent expanse of the Sahara.
                        </p>

                        {/* Region Filter Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
                            {(['All', 'Tunis & Suburbs', 'Sahel', 'South & Sahara', 'North'] as const).map((reg) => (
                                <button
                                    key={reg}
                                    onClick={() => setSelectedRegion(reg)}
                                    className={`text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200 border ${
                                        selectedRegion === reg
                                            ? 'bg-ochre text-canvas border-ochre shadow-lg shadow-ochre/20 scale-105 font-semibold'
                                            : 'bg-surface text-mist border-edge hover:text-alabaster hover:border-edge/80'
                                    }`}
                                >
                                    {reg}
                                </button>
                            ))}
                        </div>
                    </FadeUp>

                    {/* Responsive Multi-Column Masonry Grid */}
                    <GalleryGrid
                        photos={displayedPhotos}
                        onPhotoClick={(photo) => setActivePhoto(photo)}
                    />

                    {/* Photo Deep-View Modal */}
                    {activePhoto && (
                        <PhotoModal
                            photo={activePhoto}
                            onClose={() => setActivePhoto(null)}
                        />
                    )}
                </div>
            </section>
            {/* ──────── CHROMATIC INDEX & LIGHT STUDY ──────── */}
            <section className="bg-surface border-b border-edge py-20 text-alabaster">
                <div className="container mx-auto px-6 max-w-6xl">
                    <FadeUp className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sidi flex items-center justify-center gap-2">
                            <Compass size={13} /> Optical Spectrum
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-alabaster">
                            Tunisian Chromatic Index
                        </h2>
                        <p className="text-xs sm:text-sm text-mist font-light leading-relaxed">
                            A curatorial register of characteristic pigments and architectural hues extracted directly from Tunisia's Mediterranean coastal lime-wash and Saharan stone.
                        </p>
                    </FadeUp>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { name: "Sidi Bou Said Cobalt", hex: "#1E4B94", desc: "Mediterranean Lime-Wash Azure", bg: "bg-[#1E4B94]" },
                            { name: "Matmata Sandstone", hex: "#C49A6C", desc: "Troglodyte Subterranean Earth", bg: "bg-[#C49A6C]" },
                            { name: "Kairouan Ocher", hex: "#D98E32", desc: "Aghlabid Sunbaked Masonry", bg: "bg-[#D98E32]" },
                            { name: "Carthage Marble", hex: "#E2DCCE", desc: "Punic Limestone & Roman Capitals", bg: "bg-[#E2DCCE]", textDark: true },
                            { name: "Oasis Date Green", hex: "#3C5940", desc: "Douz & Tozeur Palmeries", bg: "bg-[#3C5940]" },
                        ].map((color) => (
                            <div key={color.name} className="p-4 rounded-xl bg-canvas border border-edge space-y-3 hover:border-ochre/40 transition-all shadow-sm">
                                <div className={`h-20 w-full rounded-lg ${color.bg} shadow-inner flex items-end p-2.5`}>
                                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${color.textDark ? 'bg-black/80 text-white' : 'bg-black/40 text-white backdrop-blur-sm'}`}>
                                        {color.hex}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-serif text-sm font-semibold text-alabaster">{color.name}</h4>
                                    <p className="text-[11px] text-mist mt-0.5 leading-snug">{color.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Curatorial Quote */}
                    <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-canvas/90 border border-edge max-w-3xl mx-auto text-center space-y-2">
                        <p className="font-serif italic text-base sm:text-lg text-alabaster/90 leading-relaxed">
                            "Tunisia is a land where Mediterranean light does not merely illuminate stone; it sculpts geometry with an ancient, uncompromising clarity."
                        </p>
                        <p className="text-[11px] text-ochre font-medium uppercase tracking-widest pt-1">
                            — Henri Cartier-Bresson, on North African Light
                        </p>
                    </div>
                </div>
            </section>

            {/* ──────── POPULAR DISCIPLINES ──────── */}
            <section className="py-24 bg-canvas border-b border-edge relative">
                <div className="container mx-auto section-padding">
                    <FadeUp className="text-center mb-16 space-y-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre">Focus Areas</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-normal text-alabaster tracking-tight">Curated Disciplines</h2>
                        <p className="text-mist text-sm md:text-base font-light max-w-xl mx-auto">Explore specialized creators across documentary, architectural, and visual storytelling fields.</p>
                    </FadeUp>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[
                            { icon: <Heart className="h-5 w-5" />, label: "Cultural Ceremonies", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" },
                            { icon: <Layers className="h-5 w-5" />, label: "Documentary Portraits", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" },
                            { icon: <Package className="h-5 w-5" />, label: "Artisan & Crafts", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
                            { icon: <Cloud className="h-5 w-5" />, label: "Topography & Aerial", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80" },
                            { icon: <Video className="h-5 w-5" />, label: "Cinematic Narratives", img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80" },
                        ].map((cat, i) => (
                            <Link
                                key={i}
                                to={`/creatives?category=${cat.label.split(' ')[0]}`}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-edge hover:border-ochre/50 transition-all duration-500 shadow-md"
                            >
                                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                                    <div className="w-12 h-12 rounded-xl bg-surface/80 backdrop-blur-md border border-edge flex items-center justify-center text-ochre mb-3 group-hover:scale-110 group-hover:bg-ochre group-hover:text-canvas transition-all duration-300">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-alabaster font-serif font-normal text-base tracking-tight leading-tight group-hover:text-ochre transition-colors">
                                        {cat.label}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── HOW IT WORKS ──────── */}
            <section className="py-24 bg-surface border-b border-edge relative overflow-hidden">
                <div className="container mx-auto section-padding relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sidi">Seamless Process</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-normal text-alabaster tracking-tight">How Tunisian Lens Works</h2>
                        <p className="text-mist text-sm font-light">Find and commission documentary and cultural visual professionals in three clear steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
                        {[
                            { step: "01", title: "Commission or Post Project", desc: "Share your documentary vision, editorial scope, or regional requirements." },
                            { step: "02", title: "Review Curated Portfolios", desc: "Verified visual artists apply with tailored proposals and verified technical credentials." },
                            { step: "03", title: "Collaborate & Archive", desc: "Work directly with creators and license high-fidelity cultural imagery." },
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4 bg-canvas p-8 rounded-2xl border border-edge shadow-sm hover:border-ochre/30 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-edge flex items-center justify-center text-ochre font-bold text-sm relative">
                                    {item.step}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-serif font-semibold text-lg text-alabaster">{item.title}</h3>
                                    <p className="text-xs text-mist leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── GEAR MARKETPLACE ──────── */}
            <section className="py-24 bg-canvas border-b border-edge">
                <div className="container mx-auto section-padding">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl space-y-3">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sidi">Optical Hardware</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-normal text-alabaster tracking-tight">Pro Gear & Optics Marketplace</h2>
                            <p className="text-mist text-sm font-light">Acquire and pass on documentary cameras, medium-format sensors, vintage prime lenses, and studio lighting in Tunisia.</p>
                        </div>
                        <Link to="/gear">
                            <Button size="lg" className="rounded-lg gap-2 bg-surface hover:bg-surface-elevated text-alabaster border border-edge text-xs font-semibold uppercase tracking-wider">
                                Browse All Optics <ArrowRight className="h-3.5 w-3.5 text-ochre" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: "Bodies & Sensors", cat: "Camera", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
                            { label: "Prime & Cine Lenses", cat: "Lens", img: "https://images.unsplash.com/photo-1617450365226-9bf28c04e130?w=400&q=80" },
                            { label: "Aerial Gimbal Drones", cat: "Drone", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80" },
                            { label: "Location Lighting", cat: "Lighting", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80" },
                            { label: "Archival Accessories", cat: "Accessories", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
                        ].map((item, i) => (
                            <Link key={i} to={`/gear?category=${item.cat}`} className="group relative aspect-square rounded-xl overflow-hidden border border-edge hover:border-ochre/40 transition-all shadow-sm">
                                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                                <div className="absolute inset-x-0 bottom-4 text-center px-2">
                                    <span className="text-alabaster font-medium tracking-wider uppercase text-[11px] block">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── FEATURED CREATIVES ──────── */}
            <section className="py-24 bg-surface border-b border-edge">
                <div className="container mx-auto section-padding">
                    <FadeUp className="flex items-end justify-between mb-14">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre mb-2">Curated Registry</p>
                            <h2 className="text-3xl md:text-4xl font-serif font-normal text-alabaster tracking-tight">Featured Visual Artists</h2>
                        </div>
                        <Link to="/creatives">
                            <Button variant="ghost" className="gap-2 text-mist hover:text-alabaster text-xs font-semibold uppercase tracking-wider hidden sm:flex">
                                View Directory <ArrowRight className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
                            </Button>
                        </Link>
                    </FadeUp>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {FEATURED_ARTISTS.map((artist, i) => {
                            const verified = isArtistVerified(artist.id);
                            const coverImg = artist.portfolioImages?.[0] ?? artist.avatar;
                            const { rating } = getArtistRating(artist.name);
                            return (
                                <FadeUp key={artist.id} delay={i * 0.1}>
                                    <Link to={`/artist/${artist.id}`} className="group block">
                                        <div className="relative rounded-2xl overflow-hidden bg-canvas border border-edge transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-ochre/40">
                                            {/* Cover image */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={coverImg}
                                                    alt={artist.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                {/* Creative type badge */}
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-alabaster text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md capitalize border border-white/10">
                                                    {CREATIVE_TYPE_ICON[artist.creativeType]}
                                                    {artist.creativeType}
                                                </div>

                                                {/* Rating badge top right */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                                                    <Star className="h-3 w-3 fill-ochre text-ochre" strokeWidth={0} />
                                                    <span className="text-alabaster text-[10px] font-bold">{rating}</span>
                                                </div>

                                                {/* Avatar + name overlay */}
                                                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                                    <ProfileAvatar
                                                        src={artist.avatar}
                                                        alt={artist.name}
                                                        className="w-10 h-10 ring-2 ring-edge"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-alabaster font-semibold text-sm">{artist.name}</p>
                                                            {verified && (
                                                                <CheckCircle className="h-3.5 w-3.5 text-ochre" strokeWidth={2} fill="currentColor" />
                                                            )}
                                                        </div>
                                                        <p className="text-mist text-xs">{artist.location}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card footer */}
                                            <div className="px-4 py-3.5 flex items-center justify-between border-t border-edge/60 bg-canvas">
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {artist.categories.slice(0, 2).map(c => (
                                                        <span key={c} className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 bg-surface text-mist rounded border border-edge">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-mist">
                                                    <span className="font-semibold text-alabaster">
                                                        from <span className="text-ochre">{formatPrice(artist.startingPrice)}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeUp>
                            );
                        })}
                    </div>

                    <div className="mt-10 text-center sm:hidden">
                        <Link to="/creatives">
                            <Button variant="outline" className="border-edge text-alabaster">Browse Directory</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ──────── CREATIVE OF THE MONTH ──────── */}
            {
                (() => {
                    const cotmId = localStorage.getItem('tunisian_lens_cotm');
                    const cotmArtist = cotmId ? ARTISTS.find(a => a.id === cotmId) : null;
                    if (!cotmArtist) return null;
                    const coverImg = cotmArtist.portfolioImages?.[0] ?? `https://picsum.photos/seed/${cotmArtist.id}/1200/600`;
                    return (
                        <section className="py-24 bg-canvas border-b border-edge">
                            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                                <FadeUp className="flex items-center gap-3 mb-10">
                                    <Crown className="h-5 w-5 text-ochre" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ochre">Spotlight</p>
                                        <h2 className="text-2xl font-serif font-normal text-alabaster">Creative of the Month</h2>
                                    </div>
                                </FadeUp>
                                <FadeUp>
                                    <Link to={`/artist/${cotmArtist.id}`} className="group block">
                                        <div className="relative rounded-2xl overflow-hidden border border-edge shadow-xl">
                                            <img src={coverImg} alt={cotmArtist.name}
                                                className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                                            <div className="absolute inset-0 flex items-end p-8">
                                                <div className="flex items-end gap-5">
                                                    <ProfileAvatar
                                                        src={cotmArtist.avatar}
                                                        alt={cotmArtist.name}
                                                        className="w-16 h-16 ring-2 ring-ochre/60 flex-shrink-0"
                                                    />
                                                    <div>
                                                        <p className="text-ochre text-xs font-semibold uppercase tracking-widest mb-1">Archival Spotlight</p>
                                                        <h3 className="text-alabaster font-serif text-2xl font-normal">{cotmArtist.name}</h3>
                                                        <p className="text-mist text-xs sm:text-sm">{cotmArtist.location} · {cotmArtist.categories.slice(0, 2).join(" / ")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeUp>
                            </div>
                        </section>
                    );
                })()
            }

            {/* ──────── OPEN PROJECTS ──────── */}
            {
                RECENT_JOBS.length > 0 && (
                    <section className="py-24 bg-canvas border-b border-edge">
                        <div className="container mx-auto section-padding">
                            <FadeUp className="flex items-end justify-between mb-14">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sidi mb-2">Field Opportunities</p>
                                    <h2 className="text-3xl md:text-4xl font-serif font-normal text-alabaster tracking-tight">Active Commissions</h2>
                                </div>
                                <Link to="/jobs">
                                    <Button variant="ghost" className="gap-2 text-mist hover:text-alabaster text-xs font-semibold uppercase tracking-wider hidden sm:flex">
                                        View All <ArrowRight className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
                                    </Button>
                                </Link>
                            </FadeUp>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {RECENT_JOBS.map((job, i) => (
                                    <FadeUp key={job.id} delay={i * 0.08}>
                                        <Link to={`/jobs/${job.id}`} className="group block">
                                            <div className="border border-edge rounded-xl p-5 bg-surface hover:border-ochre/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl space-y-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-ochre bg-ochre/10 border border-ochre/20 px-2 py-0.5 rounded inline-block mb-2">
                                                            {job.category}
                                                        </span>
                                                        <h3 className="font-serif font-semibold text-sm leading-snug line-clamp-2 text-alabaster">{job.title}</h3>
                                                    </div>
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-medium flex-shrink-0">
                                                        Open
                                                    </span>
                                                </div>
                                                <p className="text-xs text-mist line-clamp-2 leading-relaxed">{job.description}</p>
                                                <div className="flex items-center justify-between pt-3 border-t border-edge">
                                                    <div className="flex items-center gap-3 text-xs text-mist">
                                                        <span className="font-bold text-ochre text-sm">{formatPrice(job.budget)}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Zap className="h-3 w-3 text-ochre" strokeWidth={2} fill="currentColor" />
                                                            {job.connectsRequired} connects
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-mist">{job.location}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </FadeUp>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* ──────── TRUST SECTION ──────── */}
            <section className="py-24 bg-surface border-b border-edge">
                <div className="container mx-auto section-padding">
                    <FadeUp className="text-center mb-16 space-y-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre">Guaranteed Provenance</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-normal text-alabaster tracking-tight">Curated with Discipline</h2>
                    </FadeUp>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                icon: Shield,
                                title: "Verified Optical Authors",
                                desc: "Every contributor is reviewed by curatorial fellows. We examine portfolio provenance, raw RAW integrity, and storytelling ethics."
                            },
                            {
                                icon: CheckCircle,
                                title: "Transparent Collaboration",
                                desc: "Commission terms, licensing, and usage rights are clear upfront — with zero hidden broker fees or commission cuts."
                            },
                            {
                                icon: Star,
                                title: "Museum-Grade Standard",
                                desc: "We celebrate quality over volume. Every photograph in the archive undergoes optical and historical curation."
                            },
                        ].map(({ icon: Icon, title, desc }, i) => (
                            <FadeUp key={title} delay={i * 0.1} className="text-center space-y-3 bg-canvas p-6 rounded-2xl border border-edge">
                                <div className="w-12 h-12 rounded-xl bg-surface border border-edge flex items-center justify-center mx-auto text-ochre shadow-sm">
                                    <Icon className="h-5 w-5 text-ochre" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif font-semibold text-base text-alabaster">{title}</h3>
                                <p className="text-xs text-mist leading-relaxed font-light">{desc}</p>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── CTA BANNER ──────── */}
            <section className="py-28 bg-canvas relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-ochre/5 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto px-6 text-center space-y-6 max-w-2xl relative z-10">
                    <FadeUp className="space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-surface border border-edge flex items-center justify-center mx-auto text-ochre shadow-sm">
                            <Camera className="h-6 w-6 text-ochre" strokeWidth={1.4} />
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-alabaster leading-tight">
                            Do You Document Tunisia?
                        </h2>
                        <p className="text-mist leading-relaxed text-xs sm:text-sm font-light max-w-lg mx-auto">
                            Submit your visual monograph or photo essay to the national registry. Connect with international publications, galleries, and cultural institutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Link to="/submit">
                                <Button size="lg" className="w-full sm:w-auto bg-ochre hover:bg-ochre-light text-canvas font-semibold h-12 px-8 text-xs uppercase tracking-wider rounded-lg shadow-xl shadow-ochre/15">
                                    Submit Monograph
                                </Button>
                            </Link>
                            <Link to="/explore">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-surface border-edge text-alabaster hover:bg-surface-elevated h-12 px-8 text-xs uppercase tracking-wider font-semibold rounded-lg">
                                    Explore Archive
                                </Button>
                            </Link>
                        </div>
                    </FadeUp>
                </div>
            </section>

        </div>
    );
}
