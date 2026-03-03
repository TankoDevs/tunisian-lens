import { useParams, Link } from "react-router-dom";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { MapPin, Mail, Instagram, Phone, ShieldCheck, Globe, Clock, Check, Calendar, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { cn } from "../lib/utils";
import { isArtistVerified, setArtistVerification } from "../lib/verification";
import { motion } from "framer-motion";

interface ArtistLike {
    id: string;
    name: string;
    avatar: string;
    location?: string;
    country?: string;
    bio?: string;
    categories?: string[];
    languages?: string[];
    startingPrice?: number | null;
    currency?: string;
    packages?: PackageItem[];
    contact?: ContactInfo;
    email?: string;
    isVerified?: boolean;
    portfolioImages?: string[];
    creativeType?: string;
}

interface PackageItem {
    name: string;
    price: number;
    description: string;
    deliveryDays: number;
    includes: string[];
}

interface ContactInfo {
    email: string;
    instagram: string;
    phone: string;
}

const TABS = ["Portfolio", "Services", "About"] as const;
type Tab = (typeof TABS)[number];

export function ArtistProfile() {
    const { id } = useParams<{ id: string }>();
    const [showContact, setShowContact] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("Portfolio");
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const verifiedFromStorage = id ? isArtistVerified(id) : false;
    const [isVerified, setIsVerified] = useState<boolean>(verifiedFromStorage);

    const mockUsers: ArtistLike[] = JSON.parse(localStorage.getItem('tunisian_lens_mock_users') || '[]');

    const artist: ArtistLike | undefined =
        (ARTISTS.find(a => a.id === id) as ArtistLike | undefined) ||
        mockUsers.find(u => u.id === id);

    const artistProjects = PROJECTS.filter(p => p.artist.id === id);

    if (!artist) {
        return (
            <div className="container mx-auto px-6 py-32 text-center space-y-6">
                <div className="w-12 h-[1.5px] bg-sand-400 mx-auto mb-6" />
                <h1 className="text-3xl font-sans font-bold">Artist Not Found</h1>
                <p className="text-muted-foreground">The profile you are looking for does not exist or is private.</p>
                <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        );
    }

    const toggleVerification = () => {
        const newStatus = !isVerified;
        setIsVerified(newStatus);
        if (id) setArtistVerification(id, newStatus);
    };

    const location = artist.location || "Tunisia";
    const country = artist.country || "Tunisia";
    const bio = artist.bio || "Passionate creative exploring the beauty of Tunisia.";
    const profileCategories = artist.categories || ["Photography"];
    const languages = artist.languages || [];
    const startingPrice = artist.startingPrice || null;
    const currency = artist.currency || "USD";
    const packages = artist.packages || [];
    const contact: ContactInfo = artist.contact || {
        email: artist.email || "contact@example.com",
        instagram: "@tunisian_lens",
        phone: "+216 -- --- ---"
    };

    // Banner: use first portfolio image, fallback to larger avatar
    const bannerImg = artist.portfolioImages?.[0] ?? `https://picsum.photos/seed/${id}/1600/600`;
    const portfolioImgs = artist.portfolioImages ?? [];

    return (
        <div className="min-h-screen bg-background">

            {/* ── Large Banner Hero ── */}
            <div className="relative h-[55vh] min-h-[340px] max-h-[520px] overflow-hidden">
                <img
                    src={bannerImg}
                    alt={`${artist.name} portfolio`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (!t.src.includes("picsum")) t.src = `https://picsum.photos/seed/${id}/1600/600`;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                {/* Back button */}
                <Link
                    to="/creatives"
                    className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
                    All Creatives
                </Link>

                {/* Identity Overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8">
                    <div className="max-w-5xl mx-auto flex items-end gap-5">
                        <img
                            src={artist.avatar}
                            alt={artist.name}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-3 ring-white/80 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 pb-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight">{artist.name}</h1>
                                {isVerified && <VerificationBadge size={20} />}
                                {artist.creativeType && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white capitalize">
                                        {artist.creativeType}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-1.5 text-white/70 text-sm flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> {location}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Globe className="h-3.5 w-3.5" strokeWidth={1.5} /> {country}
                                </span>
                                {startingPrice && (
                                    <span className="text-white font-semibold">from ${startingPrice} {currency}</span>
                                )}
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-3 flex-shrink-0 pb-1">
                            {isAdmin && (
                                <Button
                                    variant={isVerified ? "outline" : "default"}
                                    size="sm"
                                    onClick={toggleVerification}
                                    className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                                >
                                    <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                                    {isVerified ? "Remove Verification" : "Verify Creative"}
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowContact(!showContact)}
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2"
                            >
                                <Mail className="h-4 w-4" strokeWidth={1.5} />
                                Get in Touch
                            </Button>
                            {startingPrice && (
                                <Link to={`/hire/${id}`}>
                                    <Button size="sm" className="gap-2">
                                        <Calendar className="h-4 w-4" strokeWidth={1.5} />
                                        Book Now
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Contact Card (Mobile actions + contact reveal) ── */}
            <div className="border-b border-border bg-card md:hidden">
                <div className="container mx-auto px-6 py-4 flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 text-sm"
                        onClick={() => setShowContact(!showContact)}
                    >
                        <Mail className="h-4 w-4" strokeWidth={1.5} />
                        {showContact ? "Hide Contact" : "Get in Touch"}
                    </Button>
                    {startingPrice && (
                        <Link to={`/hire/${id}`} className="flex-1">
                            <Button className="w-full gap-2 text-sm">
                                <Calendar className="h-4 w-4" strokeWidth={1.5} />
                                Book Now
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* ── Contact Info Reveal ── */}
            {showContact && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-border bg-muted/30"
                >
                    <div className="container mx-auto max-w-5xl px-6 py-4 flex flex-wrap gap-6">
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm hover:text-sand-600 transition-colors">
                            <Mail className="h-4 w-4 text-sand-500" strokeWidth={1.5} /> {contact.email}
                        </a>
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm hover:text-sand-600 transition-colors">
                            <Phone className="h-4 w-4 text-sand-500" strokeWidth={1.5} /> {contact.phone}
                        </a>
                        <a href="#" className="flex items-center gap-2 text-sm hover:text-sand-600 transition-colors">
                            <Instagram className="h-4 w-4 text-sand-500" strokeWidth={1.5} /> {contact.instagram}
                        </a>
                    </div>
                </motion.div>
            )}

            {/* ── Tab Navigation ── */}
            <div className="border-b border-border sticky top-16 z-20 bg-background/90 backdrop-blur-md">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="flex gap-0">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "py-4 px-4 text-sm font-medium border-b-2 transition-all duration-200",
                                    activeTab === tab
                                        ? "border-foreground text-foreground"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab}
                                {tab === "Portfolio" && artistProjects.length > 0 && (
                                    <span className="ml-1.5 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{artistProjects.length}</span>
                                )}
                                {tab === "Services" && packages.length > 0 && (
                                    <span className="ml-1.5 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{packages.length}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="container mx-auto max-w-5xl px-6 py-12">

                {/* PORTFOLIO TAB */}
                {activeTab === "Portfolio" && (
                    <div>
                        {/* Portfolio image strip */}
                        {portfolioImgs.length > 0 && (
                            <div className="mb-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-5">Selected Images</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {portfolioImgs.map((img, i) => (
                                        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                                            <img
                                                src={img}
                                                alt={`Portfolio ${i + 1}`}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {artistProjects.length > 0 ? (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-5">Projects</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {artistProjects.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            {...project}
                                            artist={{
                                                ...project.artist,
                                                isVerified: isArtistVerified(project.artist.id)
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            portfolioImgs.length === 0 && (
                                <div className="py-20 text-center text-muted-foreground">
                                    <p>No portfolio work uploaded yet.</p>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* SERVICES TAB */}
                {activeTab === "Services" && (
                    <div>
                        {packages.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {packages.map((pkg: PackageItem, i: number) => (
                                    <div key={i} className={cn(
                                        "p-6 rounded-xl border space-y-4 transition-all duration-300",
                                        i === 1 ? "border-sand-400 bg-sand-50/50 dark:bg-sand-900/10 shadow-md" : "border-border hover:border-sand-300 dark:hover:border-sand-700"
                                    )}>
                                        {i === 1 && <span className="text-[9px] font-bold uppercase tracking-widest bg-sand-400 text-white px-2 py-0.5 rounded">Popular</span>}
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{pkg.name}</p>
                                            <p className="text-2xl font-sans font-bold mt-1">${pkg.price} <span className="text-sm font-sans font-normal text-muted-foreground">{currency}</span></p>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                                            {pkg.deliveryDays} day{pkg.deliveryDays !== 1 ? "s" : ""} delivery
                                        </div>
                                        <ul className="space-y-2 pt-2 border-t border-border">
                                            {pkg.includes.map((item: string) => (
                                                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                    <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-sand-500" strokeWidth={2} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to={`/hire/${id}`}>
                                            <Button size="sm" variant={i === 1 ? "default" : "outline"} className="w-full gap-2 mt-2 text-xs">
                                                <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                Book This Package
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-muted-foreground">
                                <p>No service packages listed yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === "About" && (
                    <div className="max-w-2xl space-y-8">
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500">Bio</p>
                            <p className="text-muted-foreground leading-relaxed">{bio}</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500">Specialities</p>
                            <div className="flex flex-wrap gap-2">
                                {profileCategories.map((cat: string) => (
                                    <span key={cat} className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-sand-50 text-sand-700 dark:bg-sand-900/20 dark:text-sand-400 rounded">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {languages.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500">Languages</p>
                                <p className="text-sm text-muted-foreground">{languages.join(", ")}</p>
                            </div>
                        )}

                        {isVerified && (
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">Verified Creative</p>
                                    <p className="text-xs text-green-600/70 dark:text-green-500/70">This creative has been reviewed and verified by the Tunisian Lens team.</p>
                                </div>
                            </div>
                        )}

                        {isAdmin && (
                            <Button
                                variant={isVerified ? "outline" : "default"}
                                onClick={toggleVerification}
                                className="gap-2 text-sm"
                            >
                                <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                                {isVerified ? "Remove Verification" : "Verify This Creative"}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
