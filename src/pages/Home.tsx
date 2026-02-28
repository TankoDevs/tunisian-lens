import { ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ProjectCard } from "../components/ui/ProjectCard";
import { useProjects } from "../context/ProjectContext";
import { isArtistVerified } from "../lib/verification";
import { motion } from "framer-motion";

export function Home() {
    const { publicProjects } = useProjects();
    const featuredProjects = publicProjects.slice(0, 6);

    return (
        <div className="space-y-0">
            {/* ── Hero Section ── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
                        alt="Photography"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('placeholder')) {
                                target.src = "https://picsum.photos/seed/tunis-panorama/1920/1080";
                            }
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="relative z-10 text-center text-white max-w-3xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Accent line */}
                        <div className="flex justify-center">
                            <div className="w-12 h-[1.5px] bg-[#C8A97E]" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight leading-[1.05]">
                            Where Vision<br />Meets Opportunity
                        </h1>

                        <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed font-light">
                            A curated marketplace connecting clients with world-class visual creatives. Discover, hire, and create.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link to="/creatives">
                                <Button size="lg" className="rounded-full h-12 px-8 text-sm font-medium">
                                    Find Creatives
                                </Button>
                            </Link>
                            <Link to="/jobs">
                                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/25 hover:bg-white/10 hover:border-white/40 h-12 px-8 text-sm tracking-wide">
                                    Find Jobs
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
                </motion.div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500">How It Works</p>
                        <h2 className="text-3xl md:text-4xl font-sans font-bold">Simple. Curated. Professional.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-4xl mx-auto">
                        {[
                            {
                                num: "01",
                                title: "Discover",
                                desc: "Browse portfolios by style, location, and budget. Every creative is curated for quality."
                            },
                            {
                                num: "02",
                                title: "Connect",
                                desc: "Review their work, service packages, and ratings. Reach out when you find the right fit."
                            },
                            {
                                num: "03",
                                title: "Create",
                                desc: "Book a session and bring your creative vision to life with a verified professional."
                            }
                        ].map(({ num, title, desc }) => (
                            <motion.div
                                key={num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: parseInt(num) * 0.15 }}
                                className="text-center space-y-4"
                            >
                                <p className="text-xs font-semibold tracking-[0.2em] text-sand-400">{num}</p>
                                <h3 className="text-xl font-sans font-semibold">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Gallery ── */}
            {featuredProjects.length > 0 && (
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-6">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-2">Featured</p>
                                <h2 className="text-3xl font-sans font-bold">Selected Works</h2>
                            </div>
                            <Link to="/explore">
                                <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                    View All <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProjects.map((project) => (
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

                        <div className="mt-10 text-center sm:hidden">
                            <Link to="/explore">
                                <Button variant="outline" className="w-full">View All Works</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA Banner ── */}
            <section className="py-24 bg-[#111111]">
                <div className="container mx-auto px-6 text-center space-y-8 max-w-2xl">
                    <div className="flex justify-center">
                        <Camera className="h-8 w-8 text-sand-400" strokeWidth={1.2} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-sans font-bold text-white leading-tight">
                        Are You a Professional<br />Creative?
                    </h2>
                    <p className="text-white/50 leading-relaxed">
                        Join our curated community. Create your professional portfolio, list your services, and get discovered by clients worldwide.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" className="bg-white text-black hover:bg-white/90 mt-4 h-12 px-8 text-sm tracking-wide">
                            Start Your Portfolio
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
