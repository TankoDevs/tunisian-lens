import { useParams, Link } from "react-router-dom";
import { ARTISTS } from "../data/mockData"; // Keep ARTISTS
import { Button } from "../components/ui/button";
import { ArrowLeft, Heart, Share2, Info, Lock, Download } from "lucide-react";
import { ProjectCard } from "../components/ui/ProjectCard";
import { useProjects } from "../context/ProjectContext";

export function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const { getProject, projects } = useProjects();

    const project = getProject(id!); // Use hook to get project
    // Fallback if not found (for demo)
    if (!project) return <div className="p-12 text-center">Project not found</div>;

    const artist = ARTISTS.find(a => a.id === project.artist.id) || project.artist; // Fallback to project.artist if not found in mock ARTISTS
    const moreProjects = projects.filter(p => p.artist.id === project.artist.id && p.id !== project.id).slice(0, 3);

    return (
        <div className="min-h-screen pb-12">
            {/* Navigation Back */}
            <div className="container mx-auto px-4 py-6">
                <Link to="/explore">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Explore
                    </Button>
                </Link>
            </div>

            {/* Hero Image */}
            <div className="w-full bg-black">
                <div className="container mx-auto px-0 md:px-4">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full max-h-[85vh] object-contain mx-auto"
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold">{project.title}</h1>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                            <span className="px-3 py-1 bg-secondary rounded-full text-sm">{project.category}</span>
                            <span className="text-sm">Published on {project.date ? new Date(project.date).toLocaleDateString() : 'Feb 14, 2026'}</span>
                            {project.isPrivate && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1">
                                    <Lock className="h-3 w-3" /> Private Gallery
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 py-4 border-y">
                        <Button variant="outline" className="gap-2">
                            <Heart className="h-4 w-4" /> Like
                        </Button>
                        <Button variant="ghost" className="gap-2">
                            <Share2 className="h-4 w-4" /> Share
                        </Button>
                        {project.isPrivate ? (
                            <Button
                                className="ml-auto gap-2"
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = project.image;
                                    link.download = `${project.title}.jpg`;
                                    link.click();
                                }}
                            >
                                <Download className="h-4 w-4" /> Download High-Res
                            </Button>
                        ) : (
                            <span className="text-sm text-muted-foreground ml-auto">{project.likes} Likes</span>
                        )}
                    </div>

                    <div className="prose max-w-none text-muted-foreground">
                        <p>
                            {project.description || "Captured in the heart of Tunisia. This image represents the intersection of tradition and modernity."}
                        </p>
                    </div>
                </div>

                {/* Sidebar: Artist Info */}
                <div className="space-y-6">
                    <div className="bg-muted/30 p-6 rounded-lg border">
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                            <Info className="h-4 w-4" /> About the Artist
                        </h3>
                        {artist && (
                            <div className="flex items-center space-x-4 mb-4">
                                <img src={artist.avatar} alt={artist.name} className="h-12 w-12 rounded-full object-cover" />
                                <div>
                                    <Link to={`/artist/${artist.id}`} className="font-bold hover:underline">{artist.name}</Link>
                                    <p className="text-xs text-muted-foreground">{artist.location}</p>
                                </div>
                            </div>
                        )}
                        <Link to={`/artist/${project.artist.id}`}>
                            <Button className="w-full">View Profile</Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* More from Artist */}
            {moreProjects.length > 0 && (
                <div className="container mx-auto px-4 mt-12 pt-12 border-t">
                    <h2 className="text-2xl font-serif font-bold mb-6">More from {project.artist.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moreProjects.map(p => (
                            <ProjectCard key={p.id} {...p} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
