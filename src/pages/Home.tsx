import { ArrowRight, Camera, Video, CheckCircle, Shield, Star, Zap, Users, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ARTISTS, MOCK_JOBS } from "../data/mockData";
import { motion } from "framer-motion";
import { isArtistVerified } from "../lib/verification";

const FEATURED_ARTISTS = ARTISTS.slice(0, 3);
const RECENT_JOBS = MOCK_JOBS.filter(j => j.status === "open").slice(0, 3);

const CREATIVE_TYPE_ICON = {
    photographer: <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />,
    videographer: <Video className="h-3.5 w-3.5" strokeWidth={1.5} />,
    both: <Camera className="h-3.5 w-3.5" strokeWidth={1.5} />,
};

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
    return (
        <div className="space-y-0">

            {/* ──────── HERO ──────── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
                        alt="Tunisian creative photography"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            if (!t.src.includes("picsum")) t.src = "https://picsum.photos/seed/tunis-hero/1920/1080";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>

                <div className="relative z-10 text-center text-white max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div className="flex justify-center">
                            <div className="w-14 h-[1.5px] bg-[#C8A97E]" />
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A97E]">
                                Curated Creative Marketplace
                            </p>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                                Discover Tunisia's<br />Visual Creatives
                            </h1>
                        </div>

                        <p className="text-base md:text-lg text-white/65 max-w-xl mx-auto leading-relaxed font-light">
                            Connect with verified photographers and videographers. Post a project or find your next collaboration.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link to="/creatives">
                                <Button size="lg" className="rounded-full h-13 px-9 text-sm font-medium h-12">
                                    Find a Creative
                                </Button>
                            </Link>
                            <Link to="/jobs/post">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 h-12 px-9 text-sm tracking-wide rounded-full"
                                >
                                    Post a Project
                                </Button>
                            </Link>
                        </div>
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

            {/* ──────── HOW IT WORKS ──────── */}
            <section className="py-28 bg-background">
                <div className="container mx-auto px-6">
                    <FadeUp className="text-center mb-20 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[hsl(var(--accent))]">Simple Process</p>
                        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto text-sm">Two paths — one platform. For clients and creatives alike.</p>
                    </FadeUp>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
                        {/* Clients */}
                        <FadeUp delay={0.1}>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                                        <Users className="h-4 w-4" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-semibold">For Clients</h3>
                                </div>
                                {[
                                    { num: "01", title: "Post a Project", desc: "Describe your shoot, budget, and timeline. It's free to post." },
                                    { num: "02", title: "Receive Proposals", desc: "Talented creatives apply with their rates and portfolio." },
                                    { num: "03", title: "Hire & Collaborate", desc: "Choose the best fit and begin your creative journey." },
                                ].map(({ num, title, desc }) => (
                                    <div key={num} className="flex gap-5">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-muted-foreground">{num}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm mb-1">{title}</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/jobs/post" className="inline-block mt-4">
                                    <Button variant="outline" className="gap-2 text-sm">
                                        Post a Project <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                                    </Button>
                                </Link>
                            </div>
                        </FadeUp>

                        {/* Creatives */}
                        <FadeUp delay={0.2}>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--accent))] text-white flex items-center justify-center">
                                        <Camera className="h-4 w-4" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-semibold">For Creatives</h3>
                                </div>
                                {[
                                    { num: "01", title: "Create Your Profile", desc: "Showcase your portfolio, set your rates, and get discovered." },
                                    { num: "02", title: "Apply to Projects", desc: "Use Connects to apply — no subscriptions, no monthly fees." },
                                    { num: "03", title: "Get Paid", desc: "Work with clients directly and build your creative career." },
                                ].map(({ num, title, desc }) => (
                                    <div key={num} className="flex gap-5">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-muted-foreground">{num}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm mb-1">{title}</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/signup" className="inline-block mt-4">
                                    <Button className="gap-2 text-sm">
                                        Join as Creative <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                                    </Button>
                                </Link>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ──────── FEATURED CREATIVES ──────── */}
            <section className="py-28 bg-muted/30">
                <div className="container mx-auto px-6">
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
                            return (
                                <FadeUp key={artist.id} delay={i * 0.1}>
                                    <Link to={`/artist/${artist.id}`} className="group block">
                                        <div className="relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                                            {/* Cover */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={coverImg}
                                                    alt={artist.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                                {/* Type badge */}
                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full capitalize">
                                                    {CREATIVE_TYPE_ICON[artist.creativeType]}
                                                    {artist.creativeType}
                                                </div>
                                                {/* Profile */}
                                                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                                    <img src={artist.avatar} alt={artist.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80" />
                                                    <div>
                                                        <p className="text-white font-semibold text-sm">{artist.name}</p>
                                                        <p className="text-white/70 text-xs">{artist.location}</p>
                                                    </div>
                                                    {verified && (
                                                        <CheckCircle className="h-4 w-4 text-[#C8A97E] ml-1" strokeWidth={2} fill="currentColor" />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Footer */}
                                            <div className="px-4 py-3 flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {artist.categories.slice(0, 2).map(c => (
                                                        <span key={c} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-muted text-muted-foreground rounded">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-sm font-bold">from <span className="text-[hsl(var(--accent))]">${artist.startingPrice}</span></p>
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
            </section>

            {/* ──────── CREATIVE OF THE MONTH ──────── */}
            {(() => {
                const cotmId = localStorage.getItem('tunisian_lens_cotm');
                const cotmArtist = cotmId ? ARTISTS.find(a => a.id === cotmId) : null;
                if (!cotmArtist) return null;
                const coverImg = cotmArtist.portfolioImages?.[0] ?? `https://picsum.photos/seed/${cotmArtist.id}/1200/600`;
                return (
                    <section className="py-24 bg-[#0d0d0d]">
                        <div className="container mx-auto px-6 max-w-5xl">
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
                                            className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105" />
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
            })()}

            {RECENT_JOBS.length > 0 && (
                <section className="py-28 bg-background">
                    <div className="container mx-auto px-6">
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
                                                <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1">{job.title}</h3>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-medium flex-shrink-0">
                                                    Open
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
                                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="font-bold text-foreground text-sm">${job.budget}</span>
                                                    <span className="flex items-center gap-1">
                                                        <Zap className="h-3 w-3 text-[hsl(var(--accent))]" strokeWidth={2} fill="currentColor" />
                                                        {job.connectsRequired} connects
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{job.category}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeUp>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ──────── TRUST SECTION ──────── */}
            <section className="py-28 bg-muted/20">
                <div className="container mx-auto px-6">
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
                <div className="container mx-auto px-6 text-center space-y-8 max-w-2xl">
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
                                <Button size="lg" className="bg-white text-black hover:bg-white/90 h-12 px-8 text-sm tracking-wide">
                                    Create Your Profile
                                </Button>
                            </Link>
                            <Link to="/creatives">
                                <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 h-12 px-8 text-sm">
                                    Explore Creatives
                                </Button>
                            </Link>
                        </div>
                    </FadeUp>
                </div>
            </section>

        </div>
    );
}
