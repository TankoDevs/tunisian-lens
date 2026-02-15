import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "../../lib/utils";

interface ProjectCardProps {
    id: string;
    image: string;
    title: string;
    artist: {
        id: string;
        name: string;
        avatar: string;
    };
    category: string;
    likes: number;
    className?: string;
}

export function ProjectCard({ id, image, title, artist, category, likes, className }: ProjectCardProps) {
    return (
        <div className={cn("group relative break-inside-avoid", className)}>
            <Link to={`/project/${id}`} className="block overflow-hidden rounded-lg bg-muted">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute bottom-0 left-0 w-full p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <h3 className="font-medium truncate">{title}</h3>
                        <p className="text-xs text-white/80">{category}</p>
                    </div>
                </div>
            </Link>

            <div className="mt-3 flex items-center justify-between">
                <Link to={`/artist/${artist.id}`} className="flex items-center space-x-2 group/artist">
                    <img src={artist.avatar} alt={artist.name} className="h-6 w-6 rounded-full object-cover" />
                    <span className="text-sm font-medium text-foreground group-hover/artist:underline">{artist.name}</span>
                </Link>
                <div className="flex items-center space-x-1 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{likes}</span>
                </div>
            </div>
        </div>
    );
}
