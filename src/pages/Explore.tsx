import { useState } from "react";
import { Search, Filter, Camera, CheckCircle2 } from "lucide-react";
import { CATEGORIES, COUNTRIES } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useProjects } from "../context/ProjectContext";
import { isArtistVerified } from "../lib/verification";
import { Link } from "react-router-dom";

export function Explore() {
    const { publicProjects, deleteProject } = useProjects();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const filteredProjects = publicProjects.filter((project) => {
        const matchesCategory = selectedCategory ? project.category === selectedCategory : true;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            project.title.toLowerCase().includes(searchLower) ||
            project.artist.name.toLowerCase().includes(searchLower) ||
            project.category.toLowerCase().includes(searchLower);
        const matchesVerified = !verifiedOnly || isArtistVerified(project.artist.id);
        return matchesCategory && matchesSearch && matchesVerified;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border">
                <div className="container mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-2">Gallery</p>
                            <h1 className="text-3xl md:text-4xl font-sans font-bold">Explore Work</h1>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            <Input
                                placeholder="Search projects, artists…"
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10 space-y-8">
                {/* Filters */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between md:hidden">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filters</span>
                        <Button variant="ghost" size="sm" onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}>
                            <Filter className="h-3.5 w-3.5 mr-2" strokeWidth={1.5} />
                            {isFilterMenuOpen ? "Hide" : "Show"}
                        </Button>
                    </div>

                    <div className={cn("hidden md:block space-y-4", isFilterMenuOpen && "block")}>
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={cn(
                                    "px-4 py-2 rounded-md text-xs font-medium transition-all duration-300",
                                    selectedCategory === null ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                All
                            </button>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-xs font-medium transition-all duration-300",
                                        selectedCategory === cat ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Country + Verified */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs text-muted-foreground mr-1 uppercase tracking-wider font-semibold">Country:</span>
                            {COUNTRIES.slice(0, 8).map((country) => (
                                <button
                                    key={country}
                                    onClick={() => setSelectedCountry(country === selectedCountry ? null : country)}
                                    className={cn(
                                        "text-xs px-2.5 py-1 rounded-md transition-all duration-200",
                                        selectedCountry === country ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {country}
                                </button>
                            ))}
                            <span className="mx-2 text-border">|</span>
                            <button
                                onClick={() => setVerifiedOnly(!verifiedOnly)}
                                className={cn(
                                    "flex items-center gap-1.5 text-xs px-3 py-1 rounded-md transition-all duration-200",
                                    verifiedOnly ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
                                Verified
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                {...project}
                                artist={{
                                    ...project.artist,
                                    isVerified: isArtistVerified(project.artist.id)
                                }}
                                onDelete={deleteProject}
                            />
                        ))
                    ) : publicProjects.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center gap-6 text-center text-muted-foreground">
                            <Camera size={40} strokeWidth={1} className="opacity-20" />
                            <div>
                                <p className="font-sans text-xl font-semibold text-foreground">No work here yet</p>
                                <p className="text-sm mt-2">Be the first to share your photography.</p>
                            </div>
                            <Link to="/submit">
                                <Button className="mt-2">Submit Your Work</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="col-span-full py-24 text-center text-muted-foreground">
                            <p className="font-sans text-lg text-foreground">No projects match your criteria.</p>
                            <Button variant="link" className="text-sand-500 mt-2" onClick={() => { setSelectedCategory(null); setSearchQuery(""); setSelectedCountry(null); setVerifiedOnly(false); }}>
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
