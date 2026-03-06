import { ArrowRight, Camera, Video, CheckCircle, Shield, Star, Zap, Users, Crown, TrendingUp, Heart, Package, Cloud, Aperture, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ARTISTS, MOCK_JOBS } from "../data/mockData";
import { motion } from "framer-motion";
import { isArtistVerified } from "../lib/verification";
import { useCurrency } from "../lib/useCurrency";

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
    return (
        <div className="space-y-0">

            {/* ──────── HERO ──────── */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
                        alt="Tunisian creative photography"
                        className="h-full w-full object-cover"
                        loading="eager"
                        onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            if (!t.src.includes("picsum")) t.src = "https://picsum.photos/seed/tunis-hero/1920/1080";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/75" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center text-white max-w-5xl px-4 sm:px-6 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Eyebrow */}
                        <div className="space-y-3">
                            <div className="flex justify-center">
                                <div className="w-12 h-[1.5px] bg-[#C8A97E]" />
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A97E]">
                                Curated Creative Marketplace
                            </p>
                        </div>

                        {/* Headline */}
                        <div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                                Find the perfect<br className="hidden sm:block" /> photographer or videographer.
                            </h1>
                            <p className="mt-5 text-sm md:text-base text-white/60 max-w-lg mx-auto leading-relaxed font-light">
                                Connect with verified Tunisian photographers and videographers. Post a job or browse top talent now.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link to="/creatives">
                                <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 text-base font-semibold gap-2 shadow-lg shadow-black/30">
                                    <Camera className="h-5 w-5" strokeWidth={2} />
                                    Find a Photographer
                                </Button>
                            </Link>
                            <Link to="/post-job">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 h-14 px-10 text-base tracking-wide rounded-full gap-2"
                                >
                                    <TrendingUp className="h-5 w-5" strokeWidth={1.5} />
                                    Post a Job
                                </Button>
                            </Link>
                        </div>

                        {/* Stats bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="flex items-center justify-center gap-6 sm:gap-10 pt-4 text-white"
                        >
                            {[
                                { value: `${ARTISTS.length}+`, label: "Creatives" },
                                { value: "12", label: "Countries" },
                                { value: "500+", label: "Projects" },
                            ].map(({ value, label }) => (
                                <div key={label} className="text-center">
                                    <p className="text-xl sm:text-2xl font-bold text-[#C8A97E]">{value}</p>
                                    <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest mt-0.5">{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                >
                    <div className="w-[1px] h-14 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
                </motion.div>
            </section>

            {/* ──────── CATEGORIES ──────── */}
            <section className="py-20 bg-background border-b border-border/50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {[
                            { icon: <Aperture className="h-6 w-6" />, label: "Portrait" },
                            { icon: <Heart className="h-6 w-6" />, label: "Wedding" },
                            { icon: <Layers className="h-6 w-6" />, label: "Event" },
                            { icon: <Cloud className="h-6 w-6" />, label: "Drone" },
                            { icon: <Package className="h-6 w-6" />, label: "Product" },
                            { icon: <Video className="h-6 w-6" />, label: "Video" },
                        ].map((cat, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-[#C8A97E] group-hover:text-white transition-all duration-300">
                                    {cat.icon}
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── HOW IT WORKS ──────── */}
            <section className="py-32 bg-card/30 backdrop-blur-sm relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it Works</h2>
                        <p className="text-muted-foreground">Find the perfect creative for your next project in three simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent z-0" />

                        {[
                            { step: "01", title: "Post a Job", desc: "Share your requirements and vision for the project." },
                            { step: "02", title: "Review Applications", desc: "Photographers apply using connects with their best offer." },
                            { step: "03", title: "Select & Hire", desc: "Choose the perfect match and start collaborating." },
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6 bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E] font-bold relative">
                                    <div className="absolute inset-0 rounded-full border border-[#C8A97E]/20 animate-ping opacity-20" />
                                    {item.step}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── GEAR MARKETPLACE ──────── */}
            <section className="py-32 bg-background">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pro Gear Marketplace</h2>
                            <p className="text-muted-foreground">Buy and sell photography equipment. From mirrorless cameras to professional lighting.</p>
                        </div>
                        <Link to="/gear">
                            <Button size="lg" className="rounded-full gap-2">
                                Browse All Gear <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: "Cameras", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
                            { label: "Lenses", img: "https://images.unsplash.com/photo-1617450365226-9bf28c04e130?w=400&q=80" },
                            { label: "Drones", img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80" },
                            { label: "Lighting", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80" },
                            { label: "Accessories", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
                        ].map((item, i) => (
                            <Link key={i} to={`/gear?category=${item.label.slice(0, -1)}`} className="group relative aspect-square rounded-2xl overflow-hidden">
                                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute inset-x-0 bottom-6 text-center">
                                    <span className="text-white font-bold tracking-wide uppercase text-xs">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── FEATURED CREATIVES ──────── */}
            <section className="py-28 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6">
                    <FadeUp className="flex items-end justify-between mb-14">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[hsl(var(--accent))] mb-2">Featured</p>
                            <h2 className="text-3xl font-bold">Top Creatives</h2>
                        </div>
                        <Link to="/creatives">
                            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground text-sm hidden sm:flex">
                                Browse All <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
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
                                        <div className="relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                                            {/* Cover image */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={coverImg}
                                                    alt={artist.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                                                {/* Creative type badge */}
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full capitalize">
                                                    {CREATIVE_TYPE_ICON[artist.creativeType]}
                                                    {artist.creativeType}
                                                </div>

                                                {/* Rating badge top right */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                                                    <span className="text-white text-[10px] font-bold">{rating}</span>
                                                </div>

                                                {/* Avatar + name overlay */}
                                                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                                    <img src={artist.avatar} alt={artist.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80" />
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-white font-semibold text-sm">{artist.name}</p>
                                                            {verified && (
                                                                <CheckCircle className="h-3.5 w-3.5 text-[#C8A97E]" strokeWidth={2} fill="currentColor" />
                                                            )}
                                                        </div>
                                                        <p className="text-white/70 text-xs">{artist.location}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card footer */}
                                            <div className="px-4 py-3 flex items-center justify-between">
                                                <div className="flex gap-1 flex-wrap">
                                                    {artist.categories.slice(0, 2).map(c => (
                                                        <span key={c} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-muted text-muted-foreground rounded">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    {artist.stats?.jobsCompleted !== undefined && (
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle className="h-3 w-3 text-green-500" strokeWidth={2} />
                                                            <span className="font-medium text-foreground">{artist.stats.jobsCompleted}</span> jobs
                                                        </span>
                                                    )}
                                                    <span className="font-bold text-foreground">
                                                        from <span className="text-[hsl(var(--accent))]">{formatPrice(artist.startingPrice)}</span>
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
                            <Button variant="outline">Browse All Creatives</Button>
                        </Link>
                    </div>
                </div>
            </section >

            {/* ──────── CREATIVE OF THE MONTH ──────── */}
            {
                (() => {
                    const cotmId = localStorage.getItem('tunisian_lens_cotm');
                    const cotmArtist = cotmId ? ARTISTS.find(a => a.id === cotmId) : null;
                    if (!cotmArtist) return null;
                    const coverImg = cotmArtist.portfolioImages?.[0] ?? `https://picsum.photos/seed/${cotmArtist.id}/1200/600`;
                    return (
                        <section className="py-24 bg-[#0d0d0d]">
                            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                                <FadeUp className="flex items-center gap-3 mb-10">
                                    <Crown className="h-5 w-5 text-amber-400" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">Spotlight</p>
                                        <h2 className="text-2xl font-bold text-white">Creative of the Month</h2>
                                    </div>
                                </FadeUp>
                                <FadeUp>
                                    <Link to={`/artist/${cotmArtist.id}`} className="group block">
                                        <div className="relative rounded-2xl overflow-hidden">
                                            <img src={coverImg} alt={cotmArtist.name}
                                                className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                                            <div className="absolute inset-0 flex items-end p-8">
                                                <div className="flex items-end gap-5">
                                                    <img src={cotmArtist.avatar} alt={cotmArtist.name}
                                                        className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400/60 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">This Month's Featured Creative</p>
                                                        <h3 className="text-white text-2xl font-bold">{cotmArtist.name}</h3>
                                                        <p className="text-white/60 text-sm">{cotmArtist.location} · {cotmArtist.categories.slice(0, 2).join(" / ")}</p>
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
                    <section className="py-28 bg-background">
                        <div className="container mx-auto px-4 sm:px-6">
                            <FadeUp className="flex items-end justify-between mb-14">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[hsl(var(--accent))] mb-2">Live Now</p>
                                    <h2 className="text-3xl font-bold">Open Projects</h2>
                                </div>
                                <Link to="/jobs">
                                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground text-sm hidden sm:flex">
                                        View All <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                                    </Button>
                                </Link>
                            </FadeUp>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {RECENT_JOBS.map((job, i) => (
                                    <FadeUp key={job.id} delay={i * 0.08}>
                                        <Link to={`/jobs/${job.id}`} className="group block">
                                            <div className="border border-border rounded-xl p-5 bg-card hover:border-[hsl(var(--accent))/40] hover:-translate-y-1 transition-all duration-300 hover:shadow-md space-y-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        {/* Category */}
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--accent))] bg-[hsl(var(--accent))/10] px-2 py-0.5 rounded-full inline-block mb-2">
                                                            {job.category}
                                                        </span>
                                                        <h3 className="font-semibold text-sm leading-snug line-clamp-2">{job.title}</h3>
                                                    </div>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-medium flex-shrink-0">
                                                        Open
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
                                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="font-bold text-[hsl(var(--accent))] text-sm">${job.budget}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Zap className="h-3 w-3 text-[hsl(var(--accent))]" strokeWidth={2} fill="currentColor" />
                                                            {job.connectsRequired} connects
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{job.location}</span>
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
            <section className="py-28 bg-muted/20">
                <div className="container mx-auto px-4 sm:px-6">
                    <FadeUp className="text-center mb-16 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[hsl(var(--accent))]">Why Tunisian Lens</p>
                        <h2 className="text-3xl md:text-4xl font-bold">Built on Trust</h2>
                    </FadeUp>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
                        {[
                            {
                                icon: Shield,
                                title: "Verified Talent",
                                desc: "Every creative is reviewed and verified by our team. Only quality professionals make it through."
                            },
                            {
                                icon: CheckCircle,
                                title: "Secure Collaboration",
                                desc: "Transparent payment flow. Connects are clear and upfront — no hidden costs, ever."
                            },
                            {
                                icon: Star,
                                title: "Curated Quality",
                                desc: "We don't accept everyone. This is a marketplace built on excellence, not volume."
                            },
                        ].map(({ icon: Icon, title, desc }, i) => (
                            <FadeUp key={title} delay={i * 0.1} className="text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-[hsl(var(--accent))/10] flex items-center justify-center mx-auto">
                                    <Icon className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-semibold">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────── CTA BANNER ──────── */}
            <section className="py-28 bg-[#0f0f0f]">
                <div className="container mx-auto px-4 sm:px-6 text-center space-y-8 max-w-2xl">
                    <FadeUp className="space-y-6">
                        <div className="flex justify-center">
                            <Camera className="h-8 w-8 text-[#C8A97E]" strokeWidth={1.2} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            Are You a Visual Creative?
                        </h2>
                        <p className="text-white/50 leading-relaxed text-sm">
                            Join our curated directory. Showcase your work, apply to real projects, and grow your creative career — no subscription required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Link to="/signup">
                                <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-white/90 h-12 px-8 text-sm tracking-wide">
                                    Create Your Profile
                                </Button>
                            </Link>
                            <Link to="/creatives">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10 h-12 px-8 text-sm">
                                    Explore Creatives
                                </Button>
                            </Link>
                        </div>
                    </FadeUp>
                </div>
            </section>

        </div >
    );
}
