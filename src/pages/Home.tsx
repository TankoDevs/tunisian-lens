import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ProjectCard } from "../components/ui/ProjectCard";
import { useProjects } from "../context/ProjectContext";

export function Home() {
    const { publicProjects } = useProjects();
    const featuredProjects = publicProjects.slice(0, 6);

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1549309019-38374d6c6e7f?q=80&w=2000&auto=format&fit=crop"
                        alt="Tunisian Landscape"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 text-center text-white space-y-6 max-w-3xl px-4 animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        Discover the Soul of Tunisia Through the Lens
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                        A curated platform for Tunisian photographers to showcase their work, connect with clients, and inspire the world.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/explore">
                            <Button size="lg" className="text-base h-12 px-8">
                                Explore Gallery
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                                Join as Artist
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            {featuredProjects.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold">Featured Works</h2>
                            <p className="text-muted-foreground mt-1">Hand-picked selections from our community</p>
                        </div>
                        <Link to="/explore">
                            <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                {...project}
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

            {/* Call to Action */}
            <section className="bg-muted/50 py-16">
                <div className="container mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl font-serif font-bold">Are you a Tunisian Photographer?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join our growing community of visual artists. Create your professional profile, showcase your best work, and get discovered by clients across Tunisia and beyond.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" className="mt-4">
                            Start Your Portfolio
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
