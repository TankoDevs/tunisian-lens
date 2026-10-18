import { useParams, Link } from "react-router-dom";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { MapPin, Heart, Star, Clapperboard, Globe2, ShieldCheck, Camera, Share, Twitter, MessageSquare, Zap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useChat } from "../context/ChatContext";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { BadgePill } from "../components/ui/BadgePill";
import { CinematicViewer } from "../components/ui/CinematicViewer";
import { ProfileAvatar } from "../components/ui/ProfileAvatar";
import { BeforeAfterSlider } from "../components/ui/BeforeAfterSlider";
import { cn } from "../lib/utils";
import { isArtistVerified, setArtistVerification } from "../lib/verification";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedImage } from "../components/ui/ProtectedImage";

const TABS = ["Portfolio", "Reviews", "About"] as const;
type Tab = (typeof TABS)[number];

// deterministic rating from artist data
function getArtistRating(_artistId: string, name: string) {
    const rating = parseFloat((4.5 + (name.length % 5) * 0.1).toFixed(1));
    const reviews = (name.charCodeAt(0) % 80) + 20;
    return { rating, reviews };
}

export function ArtistProfile() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<Tab>("Portfolio");
    const [cinematicOpen, setCinematicOpen] = useState(false);
    const [cinematicIndex, setCinematicIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [activeCollection, setActiveCollection] = useState<string | null>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isVerified, setIsVerified] = useState<boolean>(() => id ? isArtistVerified(id) : false);
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const { createConversation } = useChat();
    const isAdmin = user?.role === 'admin';

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

    const { rating: profileRating } = getArtistRating(id || "", artist.name);

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
    const internationalAvailable = artist.internationalAvailable || false;
    const collections = artist.collections || [];
    const stats = artist.stats;
    const styleTags = artist.styleTags || [];
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
        <div className="min-h-screen bg-canvas text-alabaster">
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

            {/* ── Share Tooltip ── */}
            <AnimatePresence>
                {showShareMenu && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setShowShareMenu(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="fixed top-24 right-6 md:right-1/2 md:translate-x-[400px] z-[70] w-60 bg-surface.elevated border border-edge rounded-2xl shadow-2xl p-2 overflow-hidden divide-y divide-edge/60"
                        >
                            <div className="p-3 mb-1">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ochre">Share Creative Dossier</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    showAlert("Profile link copied to clipboard!", "success");
                                    setShowShareMenu(false);
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3 text-xs text-alabaster font-medium"
                            >
                                <div className="p-1.5 bg-ochre/15 rounded-lg text-ochre"><Zap className="h-4 w-4" /></div>
                                Copy Profile Link
                            </button>
                            <a
                                href={`https://twitter.com/intent/tweet?text=Check out ${artist.name}'s visual archives on Tunisian Lens!&url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3 text-xs text-mist hover:text-alabaster font-medium"
                                onClick={() => setShowShareMenu(false)}
                            >
                                <div className="p-1.5 bg-white/5 rounded-lg text-alabaster"><Twitter className="h-4 w-4" /></div>
                                Share on Twitter / X
                            </a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Visual Focus Portfolio ── */}
            <div className="bg-[#050607] py-2 px-2 overflow-hidden border-b border-edge">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {allPortfolioImgs.slice(0, 6).map((img: string, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer border border-edge/40"
                            onClick={() => { setCinematicIndex(i); setCinematicOpen(true); }}
                        >
                            <ProtectedImage
                                src={img}
                                alt={`Portfolio ${i}`}
                                aspectRatio="aspect-[4/5]"
                                watermarkAuthor={artist.name}
                                watermarkTitle={`Plate ${i + 1}`}
                                imgClassName="group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-canvas/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                    {allPortfolioImgs.length > 6 && (
                        <div
                            className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer bg-surface border border-edge flex items-center justify-center text-mist hover:text-alabaster transition-colors"
                            onClick={() => { setCinematicIndex(6); setCinematicOpen(true); }}
                        >
                            <div className="text-center">
                                <p className="font-serif text-2xl font-bold text-ochre">+{allPortfolioImgs.length - 6}</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-mist">More Plates</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Professional Header ── */}
            <div className="border-b border-edge bg-surface">
                <div className="container mx-auto max-w-6xl px-6 py-12">
                    <div className="flex flex-col md:flex-row items-start gap-10">
                        {/* Left: Identity */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-6">
                                <ProfileAvatar
                                    src={artist.avatar}
                                    alt={artist.name}
                                    size="lg"
                                    className="ring-4 ring-offset-4 ring-offset-canvas ring-ochre shadow-2xl"
                                />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="font-serif text-3xl md:text-5xl font-normal text-alabaster tracking-tight">{artist.name}</h1>
                                        {isVerified && <VerificationBadge size={24} />}
                                    </div>
                                    <div className="flex items-center gap-4 text-mist text-sm">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <MapPin className="h-4 w-4 text-ochre" /> {loc}, {country}
                                        </span>
                                        <div className="h-4 w-[1px] bg-edge" />
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-ochre text-ochre" strokeWidth={0} />
                                            <span className="font-semibold text-alabaster">{profileRating}</span>
                                            <span className="text-xs text-mist">(12 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(artist.categories || ["Photography"]).map((cat: string) => (
                                    <span key={cat} className="px-3.5 py-1 rounded-full bg-surface.elevated border border-edge text-[10px] font-semibold uppercase tracking-widest text-mist">
                                        {cat}
                                    </span>
                                ))}
                                {artist.badgeLevel && <BadgePill level={artist.badgeLevel} size="md" />}
                            </div>

                            <p className="text-mist leading-relaxed text-base max-w-2xl font-sans">
                                {bio}
                            </p>
                        </div>

                        <div className="w-full md:w-80 space-y-6">
                            <div className="bg-surface.elevated border border-edge rounded-3xl p-6 space-y-6 shadow-2xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-mist">Dispatches</p>
                                        <p className="font-serif text-2xl font-bold text-alabaster">{stats?.jobsCompleted || 0}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-mist">Success Rate</p>
                                        <p className="font-serif text-2xl font-bold text-ochre">{stats?.successRate || 100}%</p>
                                    </div>
                                </div>
                                <div className="h-[1px] bg-edge/60" />
                                <div className="space-y-4">
                                    <Button
                                        className="w-full h-14 rounded-2xl text-sm font-semibold gap-3 bg-ochre hover:bg-ochre-light text-black shadow-lg shadow-ochre/20 transition-all border-none"
                                        onClick={() => {
                                            if (!user) {
                                                showAlert("Please log in to message creators", "warning");
                                                return;
                                            }
                                            createConversation({
                                                jobId: "direct",
                                                jobTitle: "Direct Inquiry",
                                                clientId: user.id,
                                                clientName: user.name,
                                                creativeId: artist.id,
                                                creativeName: artist.name
                                            });
                                            showAlert(`Conversation started with ${artist.name}`, "success");
                                        }}
                                    >
                                        <MessageSquare className="h-5 w-5 fill-black/20" /> Direct Dispatch Inquiry
                                    </Button>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="rounded-xl h-11 gap-2 font-medium border-edge bg-surface text-alabaster hover:border-ochre/40 text-xs"
                                            onClick={() => showAlert("Quote request feature coming soon!", "warning")}
                                        >
                                            Request Quote
                                        </Button>
                                        <Link to={`/hire/${id}`} className="block">
                                            <Button variant="outline" className="w-full h-11 rounded-xl font-medium border-edge bg-surface text-alabaster hover:border-ochre/40 text-xs">
                                                Commission
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="h-[1px] bg-edge/40 my-2" />

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn("rounded-xl h-9 gap-2 text-[10px] font-semibold uppercase tracking-wider transition-all", isSaved ? "text-ochre bg-ochre/10" : "text-mist hover:text-alabaster")}
                                            onClick={() => setIsSaved(!isSaved)}
                                        >
                                            <Heart className={cn("h-3.5 w-3.5", isSaved && "fill-ochre")} /> {isSaved ? "Saved" : "Save"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-xl h-9 gap-2 text-[10px] font-semibold uppercase tracking-wider text-mist hover:text-alabaster"
                                            onClick={() => setShowShareMenu(true)}
                                        >
                                            <Share className="h-3.5 w-3.5" /> Share
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div className="border-b border-edge sticky top-16 z-20 bg-canvas/90 backdrop-blur-md">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="flex gap-2">
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={cn("py-4 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-200",
                                    activeTab === tab ? "border-ochre text-ochre" : "border-transparent text-mist hover:text-alabaster")}>
                                {tab}
                                {tab === "Portfolio" && (allPortfolioImgs.length + artistProjects.length) > 0 && (
                                    <span className="ml-1.5 text-[10px] bg-surface.elevated text-ochre border border-edge px-1.5 py-0.5 rounded-full">{allPortfolioImgs.length + artistProjects.length}</span>
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
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre mb-3">Curated Series</p>
                                <div className="flex gap-2 flex-wrap">
                                    <button onClick={() => setActiveCollection(null)}
                                        className={cn("px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all", !activeCollection ? "border-ochre bg-ochre text-black font-semibold" : "border-edge bg-surface text-mist hover:text-alabaster")}>
                                        All Archives
                                    </button>
                                    {collections.map((col: { id: string; title: string }) => (
                                        <button key={col.id} onClick={() => setActiveCollection(col.id)}
                                            className={cn("px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all", activeCollection === col.id ? "border-ochre bg-ochre text-black font-semibold" : "border-edge bg-surface text-mist hover:text-alabaster")}>
                                            {col.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Portfolio grid */}
                        {displayImages.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre mb-5">
                                    {displayCollection ? displayCollection.title : "Archival Photographic Plates"}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {displayImages.map((img: string, i: number) => (
                                        <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                                            onClick={() => { setCinematicIndex(i); setCinematicOpen(true); }}>
                                            <ProtectedImage
                                                src={img}
                                                alt={`Portfolio ${i + 1}`}
                                                aspectRatio="aspect-[4/3]"
                                                watermarkAuthor={artist.name}
                                                watermarkTitle={`Plate ${i + 1}`}
                                                imgClassName="group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
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
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre mb-5">Color Grading & Film Emulation</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {displayBeforeAfter.map((pair: { id: string; before: string; after: string; label: string }) => (
                                        <BeforeAfterSlider key={pair.id} before={pair.before} after={pair.after} label={pair.label} className="aspect-[4/3] rounded-2xl border border-edge" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Style tags */}
                        {styleTags.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre mb-3">Artistic Disciplines</p>
                                <div className="flex flex-wrap gap-2">
                                    {styleTags.map((tag: string) => (
                                        <span key={tag} className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 bg-surface.elevated border border-edge rounded-lg text-mist">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {artistProjects.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre mb-5">Curated Projects</p>
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

                {/* REVIEWS TAB */}
                {activeTab === "Reviews" && (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="bg-card border border-border p-8 rounded-2xl w-full md:w-72 flex flex-col items-center text-center space-y-4">
                                <div className="text-5xl font-bold tracking-tighter">4.9</div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-5 w-5 fill-amber-500 text-amber-500" strokeWidth={0} />)}
                                </div>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">12 Verified Reviews</p>
                            </div>

                            <div className="flex-1 space-y-6">
                                {[
                                    { name: "Sarah J.", rating: 5, date: "2 weeks ago", text: "Exceptional work! Captured our wedding moments so beautifully. Highly recommend!" },
                                    { name: "Marc K.", rating: 5, date: "1 month ago", text: "Super professional and fast delivery. The lighting was perfect for our product shoot." },
                                    { name: "Leila B.", rating: 4, date: "2 months ago", text: "Great experience overall. Very responsive and creative approach." }
                                ].map((rev, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-sm">{rev.name}</p>
                                                <div className="flex gap-0.5 mt-1">
                                                    {Array.from({ length: 5 }).map((_, j) => (
                                                        <Star key={j} className={cn("h-3 w-3", j < rev.rating ? "fill-amber-500 text-amber-500" : "text-muted/30")} strokeWidth={0} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{rev.date}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{rev.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === "About" && (
                    <div className="max-w-2xl space-y-12">
                        <div className="space-y-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre flex items-center gap-2">
                                <Zap className="h-3.5 w-3.5" strokeWidth={1.5} />
                                Availability Schedule
                            </p>
                            <div className="bg-surface border border-edge rounded-2xl p-6 shadow-sm">
                                <div className="grid grid-cols-7 gap-2">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="text-[10px] font-bold text-center text-mist/60 uppercase tracking-widest mb-2">{d}</div>
                                    ))}
                                    {Array.from({ length: 31 }).map((_, i) => {
                                        const isBusy = [5, 6, 12, 13, 20, 26, 27].includes(i + 1);
                                        const isToday = i + 1 === 18;
                                        return (
                                            <div key={i} className={cn(
                                                "aspect-square rounded-lg flex items-center justify-center text-[10px] font-semibold transition-all",
                                                isBusy ? "bg-red-500/10 text-red-400 line-through opacity-40" : "bg-emerald-500/10 text-emerald-400",
                                                isToday && "ring-2 ring-ochre text-alabaster bg-ochre/20 shadow-lg"
                                            )}>
                                                {i + 1}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-mist">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/50" /> Available
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded bg-red-500/30 border border-red-500/50" /> Booked
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre">Bio</p>
                            <p className="text-mist leading-relaxed text-sm">{bio}</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre">Specialities</p>
                            <div className="flex flex-wrap gap-2">
                                {profileCategories.map((cat: string) => (
                                    <span key={cat} className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 bg-surface border border-edge text-alabaster/90 rounded-md">{cat}</span>
                                ))}
                            </div>
                        </div>

                        {artist.equipment && artist.equipment.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-edge">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre flex items-center gap-2">
                                    <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />
                                    Professional Gear
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {artist.equipment.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-edge">
                                            <div className="w-1.5 h-1.5 rounded-full bg-ochre" />
                                            <span className="text-xs font-mono text-alabaster/80">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre">Languages</p>
                                <p className="text-sm text-mist">{languages.join(", ")}</p>
                            </div>
                        )}

                        {internationalAvailable && (
                            <div className="flex items-center gap-3.5 p-4 rounded-xl border border-sidi.azure/30 bg-sidi.azure/10">
                                <Globe2 className="h-5 w-5 text-sidi.azure flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm font-semibold text-alabaster">Available for International Projects</p>
                                    <p className="text-xs text-mist">This creative is open to commissioned assignments outside Tunisia.</p>
                                </div>
                            </div>
                        )}

                        {isVerified && (
                            <div className="flex items-center gap-3.5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm font-semibold text-alabaster">Verified Creative</p>
                                    <p className="text-xs text-mist">Identity and portfolio verified by the Tunisian Lens Curatorial Board.</p>
                                </div>
                            </div>
                        )}

                        {isAdmin && (
                            <Button variant={isVerified ? "outline" : "default"} onClick={toggleVerification} className="gap-2 text-sm border-edge text-alabaster">
                                <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                                {isVerified ? "Remove Verification" : "Verify This Creative"}
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {/* ── MOBILE STICKY FAB ── */}
            <AnimatePresence>
                {!isAdmin && user?.id !== id && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-6 right-6 z-50 md:hidden flex gap-2"
                    >
                        <Button
                            size="lg"
                            className="flex-1 shadow-2xl h-14 text-sm font-semibold rounded-2xl gap-3 bg-ochre hover:bg-ochre/90 text-canvas border-none"
                            onClick={() => {
                                if (!user) {
                                    showAlert("Please log in to message creators", "warning");
                                    return;
                                }
                                createConversation({
                                    jobId: "direct",
                                    jobTitle: "Direct Inquiry",
                                    clientId: user.id,
                                    clientName: user.name,
                                    creativeId: artist.id,
                                    creativeName: artist.name
                                });
                                showAlert(`Conversation started with ${artist.name}`, "success");
                            }}
                        >
                            <MessageSquare className="h-5 w-5 fill-canvas/20" /> Message
                        </Button>
                        <Link to={`/hire/${id}`} className="flex-1">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full shadow-2xl h-14 text-sm font-semibold rounded-2xl bg-surface/90 border-edge text-alabaster backdrop-blur-md hover:bg-surface.elevated"
                            >
                                Commission
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
