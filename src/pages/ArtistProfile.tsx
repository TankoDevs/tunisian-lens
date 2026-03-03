import { useParams, Link } from "react-router-dom";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import {
    MapPin, Mail, Instagram, Phone, ShieldCheck, Globe, Clock, Check,
    Calendar, ArrowLeft, Clapperboard, BarChart3, RefreshCw, Zap, Clock3, Globe2
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { BadgePill } from "../components/ui/BadgePill";
import { CinematicViewer } from "../components/ui/CinematicViewer";
import { BeforeAfterSlider } from "../components/ui/BeforeAfterSlider";
import { cn } from "../lib/utils";
import { isArtistVerified, setArtistVerification } from "../lib/verification";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["Portfolio", "Services", "About"] as const;
type Tab = (typeof TABS)[number];

export function ArtistProfile() {
    const { id } = useParams<{ id: string }>();
    const [showContact, setShowContact] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("Portfolio");
    const [cinematicOpen, setCinematicOpen] = useState(false);
    const [cinematicIndex, setCinematicIndex] = useState(0);
    const [activeCollection, setActiveCollection] = useState<string | null>(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const verifiedFromStorage = id ? isArtistVerified(id) : false;
    const [isVerified, setIsVerified] = useState<boolean>(verifiedFromStorage);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUsers: any[] = JSON.parse(localStorage.getItem('tunisian_lens_mock_users') || '[]');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const artist: any = ARTISTS.find(a => a.id === id) || mockUsers.find((u: any) => u.id === id);
    const artistProjects = PROJECTS.filter(p => p.artist.id === id);

    if (!artist) {
        return (
            <div className="container mx-auto px-6 py-32 text-center space-y-6">
                <h1 className="text-3xl font-sans font-bold">Artist Not Found</h1>
                <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        );
    }

    const toggleVerification = () => {
        const newStatus = !isVerified;
        setIsVerified(newStatus);
        if (id) setArtistVerification(id, newStatus);
    };

    const loc = artist.location || "Tunisia";
    const country = artist.country || "Tunisia";
    const bio = artist.bio || "Passionate creative exploring the beauty of Tunisia.";
    const profileCategories = artist.categories || ["Photography"];
    const languages = artist.languages || [];
    const startingPrice = artist.startingPrice || null;
    const currency = artist.currency || "USD";
    const packages = artist.packages || [];
    const collections = artist.collections || [];
    const stats = artist.stats;
    const contact = artist.contact || { email: artist.email || "contact@example.com", instagram: "@tunisian_lens", phone: "+216 -- --- ---" };
    const styleTags = artist.styleTags || [];
    const internationalAvailable = artist.internationalAvailable || false;

    const bannerImg = artist.portfolioImages?.[0] ?? `https://picsum.photos/seed/${id}/1600/600`;
    const allPortfolioImgs = artist.portfolioImages ?? [];

    // Determine display collection
    const displayCollection = activeCollection
        ? collections.find((c: { id: string }) => c.id === activeCollection)
        : null;
    const displayImages = displayCollection ? displayCollection.images : allPortfolioImgs;
    const displayBeforeAfter = displayCollection?.beforeAfter ?? [];

    const allCinematicImgs = [...allPortfolioImgs, ...collections.flatMap((c: { images: string[] }) => c.images)];
    const uniqueCinematicImgs = [...new Set(allCinematicImgs)];

    return (
        <div className="min-h-screen bg-background">
            {/* ── Cinematic Viewer ── */}
            <AnimatePresence>
                {cinematicOpen && uniqueCinematicImgs.length > 0 && (
                    <CinematicViewer
                        images={uniqueCinematicImgs}
                        initialIndex={cinematicIndex}
                        title={artist.name}
                        onClose={() => setCinematicOpen(false)}
                    />
                )}
            </AnimatePresence>

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

                <Link to="/creatives" className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
                    All Creatives
                </Link>

                {/* Identity overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8">
                    <div className="max-w-5xl mx-auto flex items-end gap-5">
                        <img
                            src={artist.avatar}
                            alt={artist.name}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-3 ring-white/80 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight">{artist.name}</h1>
                                {isVerified && <VerificationBadge size={20} />}
                                {artist.badgeLevel && (
                                    <BadgePill level={artist.badgeLevel} />
                                )}
                                {artist.creativeType && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white capitalize">
                                        {artist.creativeType}
                                    </span>
                                )}
                                {internationalAvailable && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                                        🌐 Intl. Available
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-1.5 text-white/70 text-sm flex-wrap">
                                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />{loc}</span>
                                <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" strokeWidth={1.5} />{country}</span>
                                {startingPrice && <span className="text-white font-semibold">from ${startingPrice} {currency}</span>}
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-3 flex-shrink-0 pb-1">
                            {uniqueCinematicImgs.length > 0 && (
                                <Button size="sm" variant="outline" onClick={() => { setCinematicIndex(0); setCinematicOpen(true); }}
                                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2">
                                    <Clapperboard className="h-4 w-4" strokeWidth={1.5} />
                                    Cinematic View
                                </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => setShowContact(!showContact)}
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2">
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

            {/* ── Mobile actions ── */}
            <div className="border-b border-border bg-card md:hidden">
                <div className="container mx-auto px-6 py-4 flex gap-3 flex-wrap">
                    {uniqueCinematicImgs.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => { setCinematicIndex(0); setCinematicOpen(true); }} className="flex-1 gap-2 text-sm">
                            <Clapperboard className="h-4 w-4" strokeWidth={1.5} /> Cinematic View
                        </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1 gap-2 text-sm" onClick={() => setShowContact(!showContact)}>
                        <Mail className="h-4 w-4" strokeWidth={1.5} /> {showContact ? "Hide" : "Contact"}
                    </Button>
                    {startingPrice && (
                        <Link to={`/hire/${id}`} className="flex-1">
                            <Button size="sm" className="w-full gap-2 text-sm">
                                <Calendar className="h-4 w-4" strokeWidth={1.5} /> Book Now
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* ── Contact Info Reveal ── */}
            <AnimatePresence>
                {showContact && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="border-b border-border bg-muted/30">
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
            </AnimatePresence>

            {/* ── Public Stats Row ── */}
            {stats && (
                <div className="border-b border-border bg-muted/20">
                    <div className="container mx-auto max-w-5xl px-6 py-4">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                <span className="font-semibold">{stats.jobsCompleted}</span>
                                <span className="text-muted-foreground">Jobs Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                <span className="font-semibold">{stats.repeatRate}%</span>
                                <span className="text-muted-foreground">Repeat Clients</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                <span className="font-semibold">{stats.successRate}%</span>
                                <span className="text-muted-foreground">Success Rate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                <span className="font-semibold">~{stats.avgResponseHours}h</span>
                                <span className="text-muted-foreground">Avg. Response</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab Navigation ── */}
            <div className="border-b border-border sticky top-16 z-20 bg-background/90 backdrop-blur-md">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="flex gap-0">
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={cn("py-4 px-4 text-sm font-medium border-b-2 transition-all duration-200",
                                    activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
                                {tab}
                                {tab === "Portfolio" && (allPortfolioImgs.length + artistProjects.length) > 0 && (
                                    <span className="ml-1.5 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{allPortfolioImgs.length + artistProjects.length}</span>
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
                    <div className="space-y-10">
                        {/* Collections nav */}
                        {collections.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-3">Collections</p>
                                <div className="flex gap-2 flex-wrap">
                                    <button onClick={() => setActiveCollection(null)}
                                        className={cn("px-3 py-1.5 text-xs font-medium rounded-full border transition-all", !activeCollection ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground")}>
                                        All Work
                                    </button>
                                    {collections.map((col: { id: string; title: string }) => (
                                        <button key={col.id} onClick={() => setActiveCollection(col.id)}
                                            className={cn("px-3 py-1.5 text-xs font-medium rounded-full border transition-all", activeCollection === col.id ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground")}>
                                            {col.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Portfolio grid */}
                        {displayImages.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-5">
                                    {displayCollection ? displayCollection.title : "Selected Images"}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {displayImages.map((img: string, i: number) => (
                                        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                                            onClick={() => { setCinematicIndex(i); setCinematicOpen(true); }}>
                                            <img src={img} alt={`Portfolio ${i + 1}`} loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Clapperboard className="h-6 w-6 text-white drop-shadow" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Before / After showcase */}
                        {displayBeforeAfter.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-5">Before / After</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {displayBeforeAfter.map((pair: { id: string; before: string; after: string; label: string }) => (
                                        <BeforeAfterSlider key={pair.id} before={pair.before} after={pair.after} label={pair.label} className="aspect-[4/3]" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Style tags */}
                        {styleTags.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-3">Style Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {styleTags.map((tag: string) => (
                                        <span key={tag} className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-muted border border-border rounded text-muted-foreground">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {artistProjects.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-5">Projects</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {artistProjects.map(project => (
                                        <ProjectCard key={project.id} {...project}
                                            artist={{ ...project.artist, isVerified: isArtistVerified(project.artist.id) }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {displayImages.length === 0 && artistProjects.length === 0 && (
                            <div className="py-20 text-center text-muted-foreground">
                                <p>No portfolio work uploaded yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* SERVICES TAB */}
                {activeTab === "Services" && (
                    <div>
                        {packages.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {packages.map((pkg: { name: string; price: number; description: string; deliveryDays: number; includes: string[] }, i: number) => (
                                    <div key={i} className={cn("p-6 rounded-xl border space-y-4",
                                        i === 1 ? "border-sand-400 bg-sand-50/50 dark:bg-sand-900/10 shadow-md" : "border-border")}>
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
                                                    <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-sand-500" strokeWidth={2} />{item}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to={`/hire/${id}`}>
                                            <Button size="sm" variant={i === 1 ? "default" : "outline"} className="w-full gap-2 mt-2 text-xs">
                                                <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} /> Book This Package
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-muted-foreground"><p>No service packages listed yet.</p></div>
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
                                    <span key={cat} className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-sand-50 text-sand-700 dark:bg-sand-900/20 dark:text-sand-400 rounded">{cat}</span>
                                ))}
                            </div>
                        </div>
                        {languages.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500">Languages</p>
                                <p className="text-sm text-muted-foreground">{languages.join(", ")}</p>
                            </div>
                        )}
                        {internationalAvailable && (
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
                                <Globe2 className="h-5 w-5 text-emerald-500 flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Available for International Projects</p>
                                    <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">This creative is open to projects outside Tunisia.</p>
                                </div>
                            </div>
                        )}
                        {isVerified && (
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">Verified Creative</p>
                                    <p className="text-xs text-green-600/70">Reviewed and verified by the Tunisian Lens team.</p>
                                </div>
                            </div>
                        )}
                        {isAdmin && (
                            <Button variant={isVerified ? "outline" : "default"} onClick={toggleVerification} className="gap-2 text-sm">
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
