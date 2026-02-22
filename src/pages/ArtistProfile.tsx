import { useParams } from "react-router-dom";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { MapPin, Mail, Instagram, Phone, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { VerificationBadge } from "../components/ui/VerificationBadge";

const VERIFICATION_KEY = 'tunisian_lens_verified_artists';

/** Read all verified artist IDs from localStorage */
function getVerifiedArtists(): Record<string, boolean> {
    try {
        return JSON.parse(localStorage.getItem(VERIFICATION_KEY) || '{}');
    } catch {
        return {};
    }
}

/** Persist a single artist's verification status */
function setArtistVerification(artistId: string, verified: boolean) {
    const current = getVerifiedArtists();
    current[artistId] = verified;
    localStorage.setItem(VERIFICATION_KEY, JSON.stringify(current));
}

/** Check if an artist is verified (checks localStorage override first, then mock data default) */
export function isArtistVerified(artistId: string): boolean {
    const overrides = getVerifiedArtists();
    if (artistId in overrides) return overrides[artistId];
    // Fallback: check the hardcoded mock data default
    const artist = ARTISTS.find(a => a.id === artistId);
    return !!(artist as any)?.isVerified;
}

export function ArtistProfile() {
    const { id } = useParams<{ id: string }>();
    const [showContact, setShowContact] = useState(false);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [isVerified, setIsVerified] = useState(false);

    // Get mock users from storage
    const mockUsers = JSON.parse(localStorage.getItem('tunisian_lens_mock_users') || '[]');

    // Find artist: Check hardcoded ARTISTS first, then mock users
    const artist = ARTISTS.find(a => a.id === id) ||
        mockUsers.find((u: any) => u.id === id);

    useEffect(() => {
        if (id) {
            setIsVerified(isArtistVerified(id));
        }
    }, [id]);

    const artistProjects = PROJECTS.filter(p => p.artist.id === id);

    if (!artist) {
        return (
            <div className="container mx-auto px-4 py-20 text-center space-y-4">
                <h1 className="text-2xl font-serif font-bold">Artist Not Found</h1>
                <p className="text-muted-foreground">The profile you are looking for does not exist or is private.</p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
        );
    }

    const toggleVerification = () => {
        const newStatus = !isVerified;
        setIsVerified(newStatus);
        if (id) setArtistVerification(id, newStatus);
    };

    // Default values for mock users who might not have full artist profile data yet
    const location = (artist as any).location || "Tunisia";
    const bio = (artist as any).bio || "Passionate photographer exploring the beauty of Tunisia.";
    const profileCategories = (artist as any).categories || ["Photography"];
    const contact = (artist as any).contact || {
        email: (artist as any).email || "contact@example.com",
        instagram: "@tunisian_lens",
        phone: "+216 -- --- ---"
    };

    return (
        <div className="container mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-500">

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b pb-12">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    <img
                        src={artist.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                        alt={artist.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                    <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h1 className="text-3xl font-serif font-bold">{artist.name}</h1>
                            {isVerified && <VerificationBadge size={20} />}
                        </div>
                        <div className="flex items-center justify-center md:justify-start text-muted-foreground space-x-2">
                            <MapPin className="h-4 w-4" strokeWidth={2} />
                            <span>{location}, Tunisia</span>
                        </div>
                        <p className="max-w-md text-muted-foreground">{bio}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                            {profileCategories.map((cat: string) => (
                                <span key={cat} className="text-xs px-2 py-1 bg-secondary rounded-md">{cat}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto flex flex-col items-center md:items-end space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {isAdmin && (
                            <Button
                                variant={isVerified ? "outline" : "default"}
                                onClick={toggleVerification}
                                className="flex items-center gap-2"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                {isVerified ? "Remove Verification" : "Verify Photographer"}
                            </Button>
                        )}
                        <Button size="lg" onClick={() => setShowContact(!showContact)}>
                            {showContact ? "Hide Contact Info" : "Contact Artist"}
                        </Button>
                    </div>

                    {showContact && (
                        <div className="bg-muted p-4 rounded-lg space-y-3 w-full md:w-64 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                                <a href={`mailto:${contact.email}`} className="text-sm hover:underline">{contact.email}</a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                                <a href={`tel:${contact.phone}`} className="text-sm hover:underline">{contact.phone}</a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Instagram className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                                <a href="#" className="text-sm hover:underline">{contact.instagram}</a>
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
                            artist={{
                                ...project.artist,
                                isVerified: isArtistVerified(project.artist.id)
                            }}
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
