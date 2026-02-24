import { useState } from "react";
import { Search, Filter, Camera, CheckCircle2 } from "lucide-react";
import { CATEGORIES, COUNTRIES } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useProjects } from "../context/ProjectContext";
import { isArtistVerified } from "./ArtistProfile";
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
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h1 className="text-3xl font-serif font-bold">Explore Work</h1>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
                    <Input
                        placeholder="Search projects, artists, or tags..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex items-center justify-between md:hidden">
                    <span className="font-medium">Filters</span>
                    <Button variant="ghost" size="sm" onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}>
                        <Filter className="h-4 w-4 mr-2" strokeWidth={2} />
                        {isFilterMenuOpen ? "Hide" : "Show"}
                    </Button>
                </div>

                <div className={cn("hidden md:block space-y-4", isFilterMenuOpen && "block")}>
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(null)}
                            className="rounded-full"
                        >
                            All
                        </Button>
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                className="rounded-full"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    {/* Country filter */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t items-center">
                        <span className="text-sm text-muted-foreground mr-1">Country:</span>
                        {COUNTRIES.slice(0, 8).map((country) => (
                            <Button
                                key={country}
                                variant={selectedCountry === country ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedCountry(country === selectedCountry ? null : country)}
                                className="text-xs h-7"
                            >
                                {country}
                            </Button>
                        ))}
                    </div>

                    {/* Verified Only */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                        <button
                            onClick={() => setVerifiedOnly(!verifiedOnly)}
                            className={cn(
                                "flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition-colors",
                                verifiedOnly ? "bg-foreground text-background border-foreground" : "hover:bg-muted border-border"
                            )}
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                            Verified Only
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    // Truly empty — no projects at all
                    <div className="col-span-full py-24 flex flex-col items-center gap-4 text-center text-muted-foreground">
                        <Camera size={48} strokeWidth={1} className="opacity-30" />
                        <div>
                            <p className="text-xl font-semibold text-foreground">No work here yet</p>
                            <p className="text-sm mt-1">Be the first Tunisian photographer to share your work.</p>
                        </div>
                        <Link to="/submit">
                            <Button variant="default" className="mt-2">Submit Your Work</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="col-span-full py-20 text-center text-muted-foreground">
                        <p className="text-lg">No projects found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSelectedCategory(null); setSearchQuery(""); setSelectedCountry(null); setVerifiedOnly(false); }}>
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

