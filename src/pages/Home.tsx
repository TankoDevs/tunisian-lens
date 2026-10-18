import { useState } from "react";
import { ArrowRight, Camera, Video, CheckCircle, Shield, Star, Zap, Sparkles, Volume2, VolumeX, Compass, Sliders, Maximize2, ShieldCheck, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ARTISTS, MOCK_JOBS } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { isArtistVerified } from "../lib/verification";
import { useCurrency } from "../lib/useCurrency";
import { ProfileAvatar } from "../components/ui/ProfileAvatar";
import { getPhotosByRegion, CULTURAL_PHOTOS } from "../data/photos";
import { GalleryGrid } from "../components/GalleryGrid";
import { PhotoModal } from "../components/PhotoModal";
import { ProtectedImage } from "../components/ui/ProtectedImage";
import type { PhotoItem } from "../types/photo";

const FEATURED_ARTISTS = ARTISTS.slice(0, 3);
const RECENT_JOBS = MOCK_JOBS.filter(j => j.status === "open").slice(0, 3);

const CREATIVE_TYPE_ICON = {
    photographer: <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />,
    videographer: <Video className="h-3.5 w-3.5" strokeWidth={1.5} />,
    both: <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />,
};

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
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
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
    
    // Interactive Hero Viewfinder Plate Switcher
    const heroPlates = CULTURAL_PHOTOS.slice(0, 3);
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const currentHeroPlate = heroPlates[activeHeroIndex] || heroPlates[0];

    const displayedPhotos = getPhotosByRegion(selectedRegion);

    return (
        <div className="space-y-0 bg-[#0C0D0E] text-[#F4F4F5] font-sans">

            {/* ──────── 1. ASYMMETRIC SPLIT HERO ──────── */}
            <section className="relative min-h-[92vh] flex items-center border-b border-white/[0.08] overflow-hidden py-[clamp(4rem,8vw,7rem)]">
                {/* Subtle dark gradient wash */}
                <div className="absolute inset-0 bg-radial-gradient from-white/[0.02] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E2F952]/[0.02] blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* LEFT COLUMN: Large headline, value statement, CTAs, Telemetry */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-7 space-y-8"
                        >
                            {/* Section Label */}
                            <div>
                                <span className="section-label inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#E2F952] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                    <Sparkles size={12} className="text-[#E2F952]" />
                                    ARCHIVAL PHOTOGRAPHY REGISTER • TUNISIA
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-bold tracking-[-0.03em] text-[#F4F4F5] leading-[1.04]">
                                Documenting Tunisia’s living architecture and light.
                            </h1>

                            {/* Value Statement: Concrete, technical, zero fluff */}
                            <p className="text-[#71717A] text-base sm:text-lg leading-[1.6] max-w-xl font-normal">
                                A curated registry of high-fidelity cultural monographs from Carthage to the Saharan basin. Verified provenance, uncompressed RAW optical masters, and direct copyright commissions.
                            </p>

                            {/* Action Group */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                                <a href="#bento" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto bg-[#E2F952] hover:bg-[#D2EA32] text-black font-semibold h-12 px-8 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-[#E2F952]/15 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        Explore Curated Plates
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </a>
                                <Link to="/submit" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        className="w-full sm:w-auto bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.06] text-[#F4F4F5] font-semibold h-12 px-8 rounded-full text-xs uppercase tracking-wider backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                    >
                                        Submit Field Monograph
                                    </Button>
                                </Link>
                            </div>

                            {/* Provenance Telemetry Indicators */}
                            <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/[0.08] text-xs text-[#71717A]">
                                <div>
                                    <span className="text-[#F4F4F5] font-bold text-base block font-display tracking-tight">3,480+</span>
                                    <span>Archival Plates</span>
                                </div>
                                <div className="w-px h-8 bg-white/[0.08]" />
                                <div>
                                    <span className="text-[#F4F4F5] font-bold text-base block font-display tracking-tight">24</span>
                                    <span>Governorates Mapped</span>
                                </div>
                                <div className="w-px h-8 bg-white/[0.08]" />
                                <div>
                                    <span className="text-[#E2F952] font-bold text-base block font-display tracking-tight">100%</span>
                                    <span>RAW EXIF Authenticity</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: Interactive Dark Glass Preview Container */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-5"
                        >
                            <div className="bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] rounded-3xl p-6 backdrop-blur-xl relative transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.18] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                                
                                {/* Container Header: Optics Selector Dials */}
                                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#E2F952] animate-pulse" />
                                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#F4F4F5]">OPTICAL VIEWFINDER HUD</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/[0.08]">
                                        {heroPlates.map((plate, idx) => (
                                            <button
                                                key={plate.id}
                                                onClick={() => setActiveHeroIndex(idx)}
                                                className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-all duration-200 ${
                                                    activeHeroIndex === idx 
                                                        ? 'bg-[#E2F952] text-black font-bold shadow-sm' 
                                                        : 'text-[#71717A] hover:text-[#F4F4F5]'
                                                }`}
                                            >
                                                0{idx + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Photo Viewfinder Screen */}
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.08] bg-black group cursor-pointer"
                                     onClick={() => setActivePhoto(currentHeroPlate)}>
                                    
                                    {/* Optical Crosshair & Grid Reticle Overlay */}
                                    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                                        {/* Crosshair Center */}
                                        <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-[#E2F952] rounded-full" />
                                        </div>
                                        {/* Rule of Thirds subtle lines */}
                                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                                            <div className="border-r border-b border-white/40" />
                                            <div className="border-r border-b border-white/40" />
                                            <div className="border-b border-white/40" />
                                            <div className="border-r border-b border-white/40" />
                                            <div className="border-r border-b border-white/40" />
                                            <div className="border-b border-white/40" />
                                            <div className="border-r border-white/40" />
                                            <div className="border-r border-white/40" />
                                            <div />
                                        </div>
                                    </div>

                                    {/* Viewfinder Corner Brackets */}
                                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/40 z-20 pointer-events-none" />
                                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/40 z-20 pointer-events-none" />
                                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/40 z-20 pointer-events-none" />
                                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/40 z-20 pointer-events-none" />

                                    {/* Protected Image Plate */}
                                    <ProtectedImage
                                        src={currentHeroPlate.fullImageUrl}
                                        alt={currentHeroPlate.title}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                    />

                                    {/* Top Telemetry Overlay */}
                                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
                                        <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-white flex items-center gap-1.5">
                                            <FileCheck size={11} className="text-[#E2F952]" />
                                            RAW VERIFIED
                                        </span>
                                        <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-white">
                                            {currentHeroPlate.region}
                                        </span>
                                    </div>

                                    {/* Bottom Telemetry Overlay */}
                                    <div className="absolute bottom-3 inset-x-3 z-20 pointer-events-none flex items-end justify-between">
                                        <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 space-y-0.5">
                                            <p className="text-xs font-semibold text-white">{currentHeroPlate.title}</p>
                                            <p className="text-[10px] font-mono text-[#71717A]">{currentHeroPlate.locationName}</p>
                                        </div>
                                        <div className="bg-black/75 backdrop-blur-md p-1.5 rounded border border-white/10 text-[#E2F952]">
                                            <Maximize2 size={13} />
                                        </div>
                                    </div>
                                </div>

                                {/* EXIF Readout Strip */}
                                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/[0.08] text-center">
                                    <div className="bg-black/30 rounded-lg p-2 border border-white/[0.05]">
                                        <span className="text-[9px] uppercase font-mono text-[#71717A] block">FL</span>
                                        <span className="text-xs font-mono font-bold text-[#F4F4F5]">{currentHeroPlate.exif?.focalLength || "35mm"}</span>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2 border border-white/[0.05]">
                                        <span className="text-[9px] uppercase font-mono text-[#71717A] block">Aperture</span>
                                        <span className="text-xs font-mono font-bold text-[#F4F4F5]">{currentHeroPlate.exif?.aperture || "f/2.8"}</span>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2 border border-white/[0.05]">
                                        <span className="text-[9px] uppercase font-mono text-[#71717A] block">Shutter</span>
                                        <span className="text-xs font-mono font-bold text-[#F4F4F5]">{currentHeroPlate.exif?.shutterSpeed || "1/400s"}</span>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2 border border-white/[0.05]">
                                        <span className="text-[9px] uppercase font-mono text-[#71717A] block">ISO</span>
                                        <span className="text-xs font-mono font-bold text-[#E2F952]">{currentHeroPlate.exif?.iso || 100}</span>
                                    </div>
                                </div>

                                {/* Field Recording Atmosphere Simulator */}
                                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                                    <button
                                        onClick={() => setIsPlayingSound(!isPlayingSound)}
                                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/[0.08] text-xs text-[#71717A] transition-all duration-300 hover:border-[#E2F952]/40"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-[#E2F952]/15 text-[#E2F952] flex items-center justify-center">
                                                {isPlayingSound ? <Volume2 size={12} className="animate-pulse" /> : <VolumeX size={12} />}
                                            </div>
                                            <span className="text-[11px] font-mono tracking-wide text-[#F4F4F5]">
                                                {isPlayingSound ? "Ambient: Sidi Bou Said Sea Breeze & Oud" : "Field Recording: Coastal Atmosphere"}
                                            </span>
                                        </div>
                                        {isPlayingSound ? (
                                            <span className="flex items-center gap-1">
                                                <span className="w-1 h-3 bg-[#E2F952] animate-bounce rounded-full" />
                                                <span className="w-1 h-4 bg-[#E2F952] animate-bounce delay-75 rounded-full" />
                                                <span className="w-1 h-2 bg-[#E2F952] animate-bounce delay-150 rounded-full" />
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-mono text-[#71717A] uppercase">Listen</span>
                                        )}
                                    </button>
                                </div>

                                {/* Protected Provenance Badge */}
                                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-mono text-[#71717A]">
                                    <ShieldCheck size={12} className="text-[#E2F952]" />
                                    <span>Protected Provenance • 36.86° N, 10.34° E</span>
                                </div>

                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ──────── 2. ASYMMETRIC 2-ROW BENTO GRID (FEATURES SECTION) ──────── */}
            <section id="bento" className="py-[clamp(4rem,10vw,8rem)] border-b border-white/[0.08] relative">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    
                    <FadeUp className="mb-14 space-y-3 max-w-2xl">
                        <span className="section-label text-[#E2F952] flex items-center gap-2">
                            <Sparkles size={13} /> CURATED REGISTRY ARCHITECTURE
                        </span>
                        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-bold text-[#F4F4F5] tracking-[-0.03em] leading-tight">
                            The National Photographic Registry
                        </h2>
                        <p className="text-[#71717A] text-sm md:text-base leading-[1.6]">
                            An asymmetric system engineered for documentary photographers, collectors, and cultural institutions.
                        </p>
                    </FadeUp>

                    {/* Bento Grid: 2-Row Asymmetric Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* ROW 1: CARD 1 SPANS 2 COLUMNS (Full Width) */}
                        <FadeUp delay={0.05} className="lg:col-span-2">
                            <div className="bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-3xl p-6 sm:p-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.16] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)]">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                                    <div className="space-y-1">
                                        <span className="section-label text-[#E2F952]">FEATURE 01 / REGIONAL TAXONOMY</span>
                                        <h3 className="text-2xl font-display font-bold text-[#F4F4F5] tracking-tight">
                                            Curated Regional Dispatches & Governorate Archive
                                        </h3>
                                        <p className="text-[#71717A] text-xs sm:text-sm max-w-xl leading-relaxed">
                                            Filter across Tunisia’s geographic zones with uncompressed RAW optical verification and authenticated provenance metadata.
                                        </p>
                                    </div>

                                    {/* Region Filter Tabs */}
                                    <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/[0.08] shadow-inner">
                                        {(['All', 'Tunis & Suburbs', 'Sahel', 'South & Sahara', 'North'] as const).map((reg) => {
                                            const isActive = selectedRegion === reg;
                                            return (
                                                <button
                                                    key={reg}
                                                    onClick={() => setSelectedRegion(reg)}
                                                    className={`relative text-xs px-3.5 py-1.5 rounded-xl transition-colors duration-200 z-10 font-medium ${
                                                        isActive ? 'text-black font-semibold' : 'text-[#71717A] hover:text-[#F4F4F5]'
                                                    }`}
                                                >
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="activeBentoFilterPill"
                                                            className="absolute inset-0 bg-[#E2F952] rounded-xl shadow-md -z-10"
                                                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                                        />
                                                    )}
                                                    {reg}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 4-Plate Curatorial Grid Preview */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                                    {displayedPhotos.slice(0, 4).map((photo) => (
                                        <div
                                            key={photo.id}
                                            onClick={() => setActivePhoto(photo)}
                                            className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/[0.08] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.2] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-1"
                                        >
                                            <ProtectedImage
                                                src={photo.thumbnailUrl}
                                                alt={photo.title}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                            
                                            {/* Top badges */}
                                            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-[9px] font-mono">
                                                <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[#E2F952] border border-white/10 font-bold">
                                                    RAW
                                                </span>
                                                <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-white border border-white/10">
                                                    {photo.region}
                                                </span>
                                            </div>

                                            {/* Bottom details */}
                                            <div className="absolute bottom-2.5 inset-x-2.5 space-y-0.5">
                                                <h4 className="text-xs font-semibold text-white group-hover:text-[#E2F952] transition-colors line-clamp-1">
                                                    {photo.title}
                                                </h4>
                                                <p className="text-[10px] text-[#71717A] font-mono line-clamp-1">{photo.locationName}</p>
                                                <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-[#71717A]">
                                                    <span>{photo.exif?.focalLength || '35mm'} {photo.exif?.aperture || 'f/2.8'}</span>
                                                    <span className="text-[#E2F952]">Inspect →</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Card Footer link */}
                                <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs">
                                    <span className="text-[#71717A]">
                                        Displaying <span className="text-[#F4F4F5] font-semibold">{displayedPhotos.length}</span> plates in selected region.
                                    </span>
                                    <a href="#stories" className="text-[#E2F952] hover:underline font-semibold flex items-center gap-1.5">
                                        Open Full Masonry Archive <ArrowRight size={13} />
                                    </a>
                                </div>
                            </div>
                        </FadeUp>

                        {/* ROW 2 - CARD 2 (Bottom Row Left, 1 Column): Pro Gear & Optics */}
                        <FadeUp delay={0.1} className="lg:col-span-1">
                            <div className="h-full bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-3xl p-6 sm:p-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.16] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="section-label text-[#E2F952]">FEATURE 02 / HARDWARE PROTOCOL</span>
                                        <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#E2F952]">
                                            <Sliders size={16} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-[#F4F4F5] tracking-tight">
                                        Pro Gear & Optics Marketplace
                                    </h3>
                                    <p className="text-[#71717A] text-xs sm:text-sm leading-relaxed">
                                        Direct hardware exchange of medium-format bodies, vintage prime lenses, cine optics, and location lighting across Tunisia. Zero broker markups.
                                    </p>
                                    
                                    {/* Hardware Pills */}
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {['Medium Format Bodies', 'Cine Prime Glass', 'Aerial Gimbal Drones', 'Location Strobe Kits'].map((hw) => (
                                            <div key={hw} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-[#F4F4F5] font-mono flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#E2F952]" />
                                                <span className="truncate">{hw}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/[0.08]">
                                    <Link to="/gear" className="block">
                                        <Button className="w-full bg-white/[0.04] hover:bg-[#E2F952] hover:text-black border border-white/[0.08] text-[#F4F4F5] font-semibold h-11 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-2">
                                            Browse Hardware Exchange <ArrowRight size={14} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </FadeUp>

                        {/* ROW 2 - CARD 3 (Bottom Row Right, 1 Column): Commissions & Escrow */}
                        <FadeUp delay={0.15} className="lg:col-span-1">
                            <div className="h-full bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-3xl p-6 sm:p-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.16] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="section-label text-[#E2F952]">FEATURE 03 / DIRECT COMMISSIONS</span>
                                        <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#E2F952]">
                                            <Zap size={16} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-[#F4F4F5] tracking-tight">
                                        Field Commissions & Escrow Licensing
                                    </h3>
                                    <p className="text-[#71717A] text-xs sm:text-sm leading-relaxed">
                                        Directly commission documentary assignments, architectural surveys, and cultural campaigns with verified creators under transparent escrow terms.
                                    </p>

                                    {/* Trust Badges */}
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {['Escrow Milestones', 'Direct Author Rights', 'Verified Portfolios', 'Regional Scope (24 Gov.)'].map((tag) => (
                                            <div key={tag} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-[#F4F4F5] font-mono flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span className="truncate">{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/[0.08]">
                                    <Link to="/jobs" className="block">
                                        <Button className="w-full bg-white/[0.04] hover:bg-[#E2F952] hover:text-black border border-white/[0.08] text-[#F4F4F5] font-semibold h-11 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-2">
                                            Explore Open Commissions <ArrowRight size={14} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </FadeUp>

                    </div>
                </div>
            </section>

            {/* ──────── 3. FULL MASONRY CULTURAL ARCHIVE ──────── */}
            <section id="stories" className="py-[clamp(4rem,10vw,8rem)] border-b border-white/[0.08] relative scroll-mt-16">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    <FadeUp className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                        <span className="section-label text-[#E2F952] flex items-center justify-center gap-2">
                            <Sparkles size={14} /> COMPLETE CULTURAL MONOGRAPHS
                        </span>
                        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-bold text-[#F4F4F5] tracking-tight">
                            Tunisia Through the Lens
                        </h2>
                        <p className="text-[#71717A] text-sm md:text-base leading-[1.6] max-w-2xl mx-auto">
                            A curated visual archive capturing Tunisia’s living civilization—from the blue doors of Sidi Bou Said to the golden Roman arches of El Jem and the silent expanse of the Sahara.
                        </p>

                        {/* Region Filter Tabs */}
                        <div className="flex justify-center pt-6">
                            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner">
                                {(['All', 'Tunis & Suburbs', 'Sahel', 'South & Sahara', 'North'] as const).map((reg) => {
                                    const isActive = selectedRegion === reg;
                                    return (
                                        <button
                                            key={reg}
                                            onClick={() => setSelectedRegion(reg)}
                                            className={`relative text-xs px-4 py-2 rounded-xl transition-colors duration-200 z-10 font-medium ${
                                                isActive ? 'text-black font-semibold' : 'text-[#71717A] hover:text-[#F4F4F5]'
                                            }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeFilterPillMasonry"
                                                    className="absolute inset-0 bg-[#E2F952] rounded-xl shadow-md -z-10"
                                                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                                />
                                            )}
                                            {reg}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </FadeUp>

                    {/* Responsive Multi-Column Masonry Grid */}
                    <GalleryGrid
                        photos={displayedPhotos}
                        onPhotoClick={(photo) => setActivePhoto(photo)}
                    />

                    {/* Deep-View Modal */}
                    <AnimatePresence>
                        {activePhoto && (
                            <PhotoModal
                                photo={activePhoto}
                                onClose={() => setActivePhoto(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ──────── 4. CHROMATIC INDEX & OPTICAL SPECTRUM ──────── */}
            <section className="py-[clamp(4rem,10vw,8rem)] border-b border-white/[0.08] relative">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
                    <FadeUp className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <span className="section-label text-[#E2F952] flex items-center justify-center gap-2">
                            <Compass size={13} /> OPTICAL SPECTRUM
                        </span>
                        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-bold tracking-tight text-[#F4F4F5]">
                            Tunisian Chromatic Index
                        </h2>
                        <p className="text-xs sm:text-sm text-[#71717A] leading-[1.6]">
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
                            <div 
                                key={color.name} 
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.18] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-1"
                            >
                                <div className={`h-20 w-full rounded-xl ${color.bg} shadow-inner flex items-end p-2.5`}>
                                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${color.textDark ? 'bg-black/80 text-white' : 'bg-black/40 text-white backdrop-blur-sm'}`}>
                                        {color.hex}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-display text-sm font-semibold text-[#F4F4F5]">{color.name}</h4>
                                    <p className="text-[11px] text-[#71717A] mt-0.5 leading-snug">{color.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Curatorial Quote */}
                    <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] max-w-3xl mx-auto text-center space-y-2">
                        <p className="font-serif italic text-base sm:text-lg text-[#F4F4F5]/90 leading-relaxed">
                            "Tunisia is a land where Mediterranean light does not merely illuminate stone; it sculpts geometry with an ancient, uncompromising clarity."
                        </p>
                        <p className="text-[11px] text-[#E2F952] font-semibold uppercase tracking-widest pt-1">
                            — Henri Cartier-Bresson, on North African Light
                        </p>
                    </div>
                </div>
            </section>

            {/* ──────── 5. FEATURED VISUAL ARTISTS ──────── */}
            <section className="py-[clamp(4rem,10vw,8rem)] border-b border-white/[0.08] relative">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    <FadeUp className="flex items-end justify-between mb-14">
                        <div className="space-y-2">
                            <span className="section-label text-[#E2F952]">CURATED REGISTRY</span>
                            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-bold text-[#F4F4F5] tracking-tight">
                                Featured Visual Artists
                            </h2>
                        </div>
                        <Link to="/creatives">
                            <Button variant="ghost" className="gap-2 text-[#71717A] hover:text-[#F4F4F5] text-xs font-semibold uppercase tracking-wider hidden sm:flex">
                                View Directory <ArrowRight className="h-3.5 w-3.5 text-[#E2F952]" strokeWidth={1.5} />
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
                                    <Link to={`/artist/${artist.id}`} className="group block h-full">
                                        <div className="h-full rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-white/[0.18] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                                            {/* Cover image */}
                                            <div className="relative h-64 overflow-hidden bg-black">
                                                <ProtectedImage
                                                    src={coverImg}
                                                    alt={artist.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                                                {/* Creative type badge */}
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-[#F4F4F5] text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                                                    {CREATIVE_TYPE_ICON[artist.creativeType]}
                                                    {artist.creativeType}
                                                </div>

                                                {/* Rating badge */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[10px] text-white">
                                                    <Star className="h-3 w-3 fill-[#E2F952] text-[#E2F952]" strokeWidth={0} />
                                                    <span>{rating}</span>
                                                </div>

                                                {/* Avatar + name overlay */}
                                                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                                    <ProfileAvatar
                                                        src={artist.avatar}
                                                        alt={artist.name}
                                                        className="w-10 h-10 ring-2 ring-white/10"
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-[#F4F4F5] font-semibold text-sm">{artist.name}</p>
                                                            {verified && (
                                                                <CheckCircle className="h-3.5 w-3.5 text-[#E2F952]" strokeWidth={2} fill="currentColor" />
                                                            )}
                                                        </div>
                                                        <p className="text-[#71717A] text-xs font-mono">{artist.location}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card footer */}
                                            <div className="px-4 py-3.5 flex items-center justify-between border-t border-white/[0.08] bg-black/20">
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {artist.categories.slice(0, 2).map(c => (
                                                        <span key={c} className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 bg-white/[0.04] text-[#71717A] rounded border border-white/[0.06]">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-[#71717A] font-mono">
                                                    from <span className="text-[#E2F952] font-bold">{formatPrice(artist.startingPrice)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeUp>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ──────── 6. ACTIVE COMMISSIONS ──────── */}
            {RECENT_JOBS.length > 0 && (
                <section className="py-[clamp(4rem,10vw,8rem)] border-b border-white/[0.08] relative">
                    <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                        <FadeUp className="flex items-end justify-between mb-14">
                            <div className="space-y-2">
                                <span className="section-label text-[#E2F952]">FIELD ASSIGNMENTS</span>
                                <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-bold text-[#F4F4F5] tracking-tight">
                                    Active Archival Commissions
                                </h2>
                            </div>
                            <Link to="/jobs">
                                <Button variant="ghost" className="gap-2 text-[#71717A] hover:text-[#F4F4F5] text-xs font-semibold uppercase tracking-wider hidden sm:flex">
                                    View All <ArrowRight className="h-3.5 w-3.5 text-[#E2F952]" strokeWidth={1.5} />
                                </Button>
                            </Link>
                        </FadeUp>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {RECENT_JOBS.map((job, i) => (
                                <FadeUp key={job.id} delay={i * 0.08}>
                                    <Link to={`/jobs/${job.id}`} className="group block h-full">
                                        <div className="h-full bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.18] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#E2F952] bg-[#E2F952]/10 border border-[#E2F952]/20 px-2 py-0.5 rounded">
                                                        {job.category}
                                                    </span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono font-medium">
                                                        Open
                                                    </span>
                                                </div>
                                                <h3 className="font-display font-bold text-base leading-snug line-clamp-2 text-[#F4F4F5] group-hover:text-[#E2F952] transition-colors">
                                                    {job.title}
                                                </h3>
                                                <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                                                <div className="flex items-center gap-3 text-xs text-[#71717A] font-mono">
                                                    <span className="font-bold text-[#E2F952] text-sm">{formatPrice(job.budget)}</span>
                                                    <span className="flex items-center gap-1 text-[11px]">
                                                        <Zap className="h-3 w-3 text-[#E2F952]" strokeWidth={2} fill="currentColor" />
                                                        {job.connectsRequired} connects
                                                    </span>
                                                </div>
                                                <span className="text-xs text-[#71717A] font-mono">{job.location}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeUp>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ──────── 7. ARCHIVAL STANDARDS & PROVENANCE ──────── */}
            <section className="py-[clamp(4rem,10vw,8rem)] border-b border-white/[0.08] relative">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                    <FadeUp className="text-center mb-16 space-y-3 max-w-2xl mx-auto">
                        <span className="section-label text-[#E2F952]">GUARANTEED PROVENANCE</span>
                        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-bold text-[#F4F4F5] tracking-tight">
                            Curated with Discipline
                        </h2>
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
                                title: "Direct Commission Terms",
                                desc: "Commission terms, licensing, and usage rights are clear upfront — with zero hidden broker fees or commission cuts."
                            },
                            {
                                icon: Star,
                                title: "Museum-Grade Standard",
                                desc: "We celebrate quality over volume. Every photograph in the archive undergoes optical and historical curation."
                            },
                        ].map(({ icon: Icon, title, desc }, i) => (
                            <FadeUp key={title} delay={i * 0.1} className="text-center space-y-4 p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.18]">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#E2F952] shadow-sm">
                                    <Icon className="h-5 w-5 text-[#E2F952]" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-display font-bold text-lg text-[#F4F4F5]">{title}</h3>
                                <p className="text-xs text-[#71717A] leading-relaxed font-normal">{desc}</p>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── 8. EDITORIAL SUBMISSION BANNER ──────── */}
            <section className="py-[clamp(4rem,10vw,8rem)] relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-[#E2F952]/[0.03] via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center max-w-2xl relative z-10 space-y-6">
                    <FadeUp className="space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#E2F952] shadow-sm">
                            <Camera className="h-6 w-6 text-[#E2F952]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-display font-bold text-[#F4F4F5] leading-tight">
                            Do you document Tunisia?
                        </h2>
                        <p className="text-[#71717A] leading-[1.6] text-sm md:text-base max-w-lg mx-auto">
                            Submit your visual monograph or photo essay to the national registry. Connect directly with international publications, galleries, and cultural institutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-3">
                            <Link to="/submit">
                                <Button size="lg" className="w-full sm:w-auto bg-[#E2F952] hover:bg-[#D2EA32] text-black font-semibold h-12 px-8 text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#E2F952]/15 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                    Submit Monograph
                                </Button>
                            </Link>
                            <Link to="/explore">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.06] text-[#F4F4F5] font-semibold h-12 px-8 text-xs uppercase tracking-wider rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
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
