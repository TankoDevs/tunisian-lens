import { useParams, Link, useNavigate } from "react-router-dom";
import { ARTISTS } from "../data/mockData"; // Keep ARTISTS
import { Button } from "../components/ui/button";
import { ArrowLeft, Heart, Share2, Info, Lock, Download, Trash2 } from "lucide-react";
import { ProjectCard } from "../components/ui/ProjectCard";
import { useProjects } from "../context/ProjectContext";

export function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProject, projects, deleteProject } = useProjects();

    const project = getProject(id!); // Use hook to get project
    // Fallback if not found (for demo)
    if (!project) return <div className="p-12 text-center">Project not found</div>;

    interface DisplayArtist { id: string; name: string; avatar: string; location?: string; }
    const artist: DisplayArtist = ARTISTS.find(a => a.id === project.artist.id) || project.artist; // Fallback to project.artist
    const moreProjects = projects.filter(p => p.artist.id === project.artist.id && p.id !== project.id).slice(0, 3);
    const isOwner = project.artist.id === 'current_user';

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            deleteProject(project.id);
            navigate('/explore');
        }
    };

    return (
        <div className="min-h-screen bg-canvas text-alabaster pb-20">
            {/* Navigation Back */}
            <div className="border-b border-edge bg-canvas/80 backdrop-blur-md sticky top-16 z-20">
                <div className="container mx-auto px-6 h-14 flex justify-between items-center">
                    <Link to="/explore">
                        <Button variant="ghost" className="pl-0 gap-2 text-mist hover:text-alabaster">
                            <ArrowLeft className="h-4 w-4" /> Back to Archives
                        </Button>
                    </Link>

                    {isOwner && (
                        <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" /> Delete Plate
                        </Button>
                    )}
                </div>
            </div>

            {/* Hero Image Stage */}
            <div className="w-full bg-[#050607] border-b border-edge py-6">
                <div className="container mx-auto px-4 md:px-8">
                    <img
                        src={project.image || "https://picsum.photos/seed/fallback/1200/800"}
                        alt={project.title}
                        className="w-full max-h-[80vh] object-contain mx-auto rounded-lg shadow-2xl"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('placeholder')) {
                                target.src = "https://picsum.photos/seed/placeholder/1200/800";
                            }
                        }}
                    />
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-xs flex-wrap gap-y-2">
                            <span className="px-3 py-1 bg-surface.elevated border border-edge rounded-full text-ochre font-semibold tracking-wider uppercase text-[10px]">
                                {project.category}
                            </span>
                            <span className="text-mist">
                                Catalogued {project.date ? new Date(project.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '14 February 2026'}
                            </span>
                            {project.isPrivate && (
                                <span className="px-2.5 py-0.5 bg-red-950/40 text-red-400 border border-red-800/40 rounded-full text-[10px] font-semibold flex items-center gap-1 uppercase tracking-wider">
                                    <Lock className="h-3 w-3" /> Private Archive
                                </span>
                            )}
                        </div>
                        <h1 className="font-serif text-3xl md:text-5xl font-normal text-alabaster tracking-tight leading-tight">
                            {project.title}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3 py-4 border-y border-edge">
                        <Button variant="outline" className="gap-2 bg-surface border-edge text-alabaster hover:border-ochre/40">
                            <Heart className="h-4 w-4 text-ochre" /> Like Plate
                        </Button>
                        <Button variant="ghost" className="gap-2 text-mist hover:text-alabaster" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                        }}>
                            <Share2 className="h-4 w-4" /> Share
                        </Button>
                        {project.isPrivate ? (
                            <Button
                                className="ml-auto gap-2 bg-ochre text-black hover:bg-ochre-light font-semibold"
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = project.image;
                                    link.download = `${project.title}.jpg`;
                                    link.click();
                                }}
                            >
                                <Download className="h-4 w-4" /> Download Master File
                            </Button>
                        ) : (
                            <span className="text-xs text-mist ml-auto font-mono tracking-wider">{project.likes} Appreciation{project.likes !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    <div className="prose prose-invert max-w-none text-mist leading-relaxed text-base font-sans">
                        <p>
                            {project.description || "Captured across the distinctive light and heritage landscape of Tunisia. An architectural and human study balancing cultural memory with modern visual narrative."}
                        </p>
                    </div>
                </div>

                {/* Sidebar: Artist Info */}
                <div className="space-y-6">
                    <div className="bg-surface border border-edge p-6 rounded-2xl space-y-6 shadow-xl">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ochre flex items-center gap-2">
                            <Info className="h-3.5 w-3.5" /> Curatorial Provenance
                        </h3>
                        {artist && (
                            <div className="flex items-center space-x-4">
                                <img src={artist.avatar} alt={artist.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-edge" />
                                <div>
                                    <Link to={`/artist/${artist.id}`} className="font-serif text-lg text-alabaster font-normal hover:text-ochre transition-colors block">
                                        {artist.name}
                                    </Link>
                                    <p className="text-xs text-mist mt-0.5">{artist.location || "Tunisia"}</p>
                                </div>
                            </div>
                        )}
                        <Link to={`/artist/${project.artist.id}`} className="block">
                            <Button className="w-full bg-surface.elevated hover:bg-white/5 border border-edge text-alabaster text-xs font-semibold h-11 rounded-xl">
                                View Full Portfolio
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* More from Artist */}
            {moreProjects.length > 0 && (
                <div className="container mx-auto px-6 mt-12 pt-12 border-t border-edge">
                    <h2 className="font-serif text-2xl font-normal text-alabaster mb-8 tracking-tight">More from {project.artist.name}</h2>
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
