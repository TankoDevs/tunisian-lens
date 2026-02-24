import { ArrowRight, Search, CheckCircle, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ProjectCard } from "../components/ui/ProjectCard";
import { useProjects } from "../context/ProjectContext";
import { isArtistVerified } from "./ArtistProfile";

export function Home() {
    const { publicProjects } = useProjects();
    const featuredProjects = publicProjects.slice(0, 6);

    return (
        <div className="space-y-0 pb-12">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://picsum.photos/seed/tunis-panorama/1920/1080"
                        alt="Photography Landscape"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('placeholder')) {
                                target.src = "https://picsum.photos/seed/placeholder-hero/1920/1080";
                            }
                        }}
                    />
                    <div className="absolute inset-0 bg-black/55" />
                </div>

                <div className="relative z-10 text-center text-white space-y-6 max-w-4xl px-4 animate-in fade-in zoom-in duration-1000">
                    <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-white/70 border border-white/20 px-4 py-1.5 rounded-full">
                        Photography Marketplace
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight">
                        Hire World-Class<br />Photography Talent
                    </h1>
                    <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
                        Connect with verified professional photographers for weddings, portraits, fashion, architecture, and more — anywhere in the world.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/photographers">
                            <Button size="lg" className="text-base h-12 px-8 gap-2 bg-white text-black hover:bg-white/90">
                                Find a Photographer <Search className="h-4 w-4" strokeWidth={2} />
                            </Button>
                        </Link>
                        <Link to="/explore">
                            <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                                Explore Gallery
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-muted/40 border-y py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 space-y-2">
                        <h2 className="text-3xl font-serif font-bold">How It Works</h2>
                        <p className="text-muted-foreground">Hiring a photographer has never been easier</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: "01",
                                icon: <Search className="h-6 w-6" strokeWidth={2} />,
                                title: "Search & Filter",
                                desc: "Browse photographers by style, location, budget, and availability."
                            },
                            {
                                step: "02",
                                icon: <CheckCircle className="h-6 w-6" strokeWidth={2} />,
                                title: "Review Profiles",
                                desc: "View portfolios, service packages, and verified professional badges."
                            },
                            {
                                step: "03",
                                icon: <Camera className="h-6 w-6" strokeWidth={2} />,
                                title: "Book & Shoot",
                                desc: "Send a booking request and bring your creative vision to life."
                            }
                        ].map(({ step, icon, title, desc }) => (
                            <div key={step} className="text-center space-y-3">
                                <div className="flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-2xl bg-background border-2 border-border flex items-center justify-center">
                                        {icon}
                                    </div>
                                </div>
                                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{step}</p>
                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="text-sm text-muted-foreground">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/photographers">
                            <Button size="lg" className="gap-2">
                                Browse Photographers <ArrowRight className="h-4 w-4" strokeWidth={2} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Gallery */}
            {featuredProjects.length > 0 && (
                <section className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold">Featured Works</h2>
                            <p className="text-muted-foreground mt-1">Hand-picked selections from our community</p>
                        </div>
                        <Link to="/explore">
                            <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                                View All <ArrowRight className="h-4 w-4" strokeWidth={2} />
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

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/explore">
                            <Button variant="outline" className="w-full">View All Works</Button>
                        </Link>
                    </div>
                </section>
            )}

            {/* CTA Banner */}
            <section className="bg-foreground text-background py-16">
                <div className="container mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl font-serif font-bold">Are You a Professional Photographer?</h2>
                    <p className="text-background/70 max-w-2xl mx-auto">
                        Join our growing global community. Create your professional profile, list your services, and get discovered by clients worldwide.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" variant="outline" className="mt-4 border-background/30 text-background hover:bg-background/10">
                            Start Your Portfolio
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
