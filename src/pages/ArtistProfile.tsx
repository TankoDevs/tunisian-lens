import { useParams } from "react-router-dom";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { MapPin, Mail, Instagram, Phone } from "lucide-react";
import { useState } from "react";

export function ArtistProfile() {
    const { id } = useParams<{ id: string }>();
    const [showContact, setShowContact] = useState(false);

    // In a real app, we'd fetch these. For now, find in mock data.
    // We'll assume the URL id matches the artist.id or we find one that does.
    // Since I didn't verify the IDs in previous steps, let's just find the artist 'a1' if not found for demo.
    const artist = ARTISTS.find(a => a.id === id) || ARTISTS[0];
    const artistProjects = PROJECTS.filter(p => p.artist.id === artist.id);

    if (!artist) return <div className="p-8 text-center">Artist not found</div>;

    return (
        <div className="container mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-500">

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b pb-12">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                    <div className="space-y-2">
                        <h1 className="text-3xl font-serif font-bold">{artist.name}</h1>
                        <div className="flex items-center justify-center md:justify-start text-muted-foreground space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{artist.location}, Tunisia</span>
                        </div>
                        <p className="max-w-md text-muted-foreground">{artist.bio}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                            {artist.categories.map(cat => (
                                <span key={cat} className="text-xs px-2 py-1 bg-secondary rounded-md">{cat}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Action */}
                <div className="w-full md:w-auto flex flex-col items-center md:items-end space-y-4">
                    <Button size="lg" onClick={() => setShowContact(!showContact)}>
                        {showContact ? "Hide Contact Info" : "Contact Artist"}
                    </Button>

                    {showContact && (
                        <div className="bg-muted p-4 rounded-lg space-y-3 w-full md:w-64 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${artist.contact.email}`} className="text-sm hover:underline">{artist.contact.email}</a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${artist.contact.phone}`} className="text-sm hover:underline">{artist.contact.phone}</a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Instagram className="h-4 w-4 text-muted-foreground" />
                                <a href="#" className="text-sm hover:underline">{artist.contact.instagram}</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Portfolio Grid */}
            <div>
                <h2 className="text-2xl font-serif font-bold mb-6">Portfolio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artistProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            {...project}
                        />
                    ))}
                    {artistProjects.length === 0 && (
                        <p className="text-muted-foreground col-span-full py-8 text-center">No projects uploaded yet.</p>
                    )}
                </div>
            </div>

        </div>
    );
}
