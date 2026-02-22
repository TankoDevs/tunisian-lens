import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { VerificationBadge } from "./VerificationBadge";

interface ProjectCardProps {
    id: string;
    image: string;
    title: string;
    artist: {
        id: string;
        name: string;
        avatar: string;
        isVerified?: boolean;
    };
    category: string;
    likes: number;
    className?: string;
    onDelete?: (id: string) => void;
}

export function ProjectCard({ id, image, title, artist, category, likes, className, onDelete }: ProjectCardProps) {
    const isOwner = artist.id === 'current_user';

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete && window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            onDelete(id);
        }
    };

    return (
        <div className={cn("group relative break-inside-avoid", className)}>
            <div className="relative overflow-hidden rounded-lg bg-muted">
                <Link to={`/project/${id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                            src={image || "https://picsum.photos/seed/fallback/800/600"}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('placeholder')) {
                                    target.src = "https://picsum.photos/seed/placeholder/800/600";
                                }
                            }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="absolute bottom-0 left-0 w-full p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <h3 className="font-medium truncate">{title}</h3>
                            <p className="text-xs text-white/80">{category}</p>
                        </div>
                    </div>
                </Link>

                {/* Delete Button - Moved OUTSIDE the Link for reliability */}
                {isOwner && onDelete && (
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg z-20 hover:scale-110 transition-transform"
                        onClick={handleDelete}
                        title="Delete Project"
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </Button>
                )}
            </div>

            <div className="mt-3 flex items-center justify-between">
                <Link to={`/artist/${artist.id}`} className="flex items-center space-x-2 group/artist">
                    <img src={artist.avatar} alt={artist.name} className="h-6 w-6 rounded-full object-cover" />
                    <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-foreground group-hover/artist:underline">{artist.name}</span>
                        {artist.isVerified && <VerificationBadge size={14} />}
                    </div>
                </Link>
                <div className="flex items-center space-x-1 text-muted-foreground">
                    <Heart className="h-4 w-4" strokeWidth={2} />
                    <span className="text-xs">{likes}</span>
                </div>
            </div>
        </div>
    );
}
