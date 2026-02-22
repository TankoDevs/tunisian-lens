import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { CATEGORIES, CITIES } from "../data/mockData"; // Keep CATEGORIES/CITIES from mockData
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useProjects } from "../context/ProjectContext";
import { isArtistVerified } from "./ArtistProfile";

export function Explore() {
    const { publicProjects, deleteProject } = useProjects();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const filteredProjects = publicProjects.filter((project) => {
        const matchesCategory = selectedCategory ? project.category === selectedCategory : true;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            project.title.toLowerCase().includes(searchLower) ||
            project.artist.name.toLowerCase().includes(searchLower) ||
            project.category.toLowerCase().includes(searchLower);

        return matchesCategory && matchesSearch;
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

                    {/* Cities (Visual UI for now) */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <span className="text-sm text-muted-foreground flex items-center mr-2">
                            City:
                        </span>
                        {CITIES.slice(0, 5).map((city) => (
                            <Button
                                key={city}
                                variant={selectedCity === city ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                                className="text-xs h-7"
                            >
                                {city}
                            </Button>
                        ))}
                        {/* More cities would go here */}
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
                ) : (
                    <div className="col-span-full py-20 text-center text-muted-foreground">
                        <p className="text-lg">No projects found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSelectedCategory(null); setSearchQuery(""); setSelectedCity(null); }}>
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

