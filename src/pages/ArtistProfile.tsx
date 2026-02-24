import { useParams, Link } from "react-router-dom";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Button } from "../components/ui/button";
import { MapPin, Mail, Instagram, Phone, ShieldCheck, Globe, Clock, Check, Calendar } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { cn } from "../lib/utils";
import { isArtistVerified, setArtistVerification } from "../lib/verification";

interface ArtistLike {
    id: string;
    name: string;
    avatar: string;
    location?: string;
    country?: string;
    bio?: string;
    categories?: string[];
    languages?: string[];
    startingPrice?: number | null;
    currency?: string;
    packages?: PackageItem[];
    contact?: ContactInfo;
    email?: string;
    isVerified?: boolean;
}

interface PackageItem {
    name: string;
    price: number;
    description: string;
    deliveryDays: number;
    includes: string[];
}

interface ContactInfo {
    email: string;
    instagram: string;
    phone: string;
}

export function ArtistProfile() {
    const { id } = useParams<{ id: string }>();
    const [showContact, setShowContact] = useState(false);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Derive verification status directly — no setState in effects
    const verifiedFromStorage = id ? isArtistVerified(id) : false;
    const [isVerified, setIsVerified] = useState<boolean>(verifiedFromStorage);

    // Get mock users from storage
    const mockUsers: ArtistLike[] = JSON.parse(localStorage.getItem('tunisian_lens_mock_users') || '[]');

    // Find artist: Check hardcoded ARTISTS first, then mock users
    const artist: ArtistLike | undefined =
        (ARTISTS.find(a => a.id === id) as ArtistLike | undefined) ||
        mockUsers.find(u => u.id === id);

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
    const location = artist.location || "Tunisia";
    const country = artist.country || "Tunisia";
    const bio = artist.bio || "Passionate photographer exploring the beauty of Tunisia.";
    const profileCategories = artist.categories || ["Photography"];
    const languages = artist.languages || [];
    const startingPrice = artist.startingPrice || null;
    const currency = artist.currency || "USD";
    const packages = artist.packages || [];
    const contact: ContactInfo = artist.contact || {
        email: artist.email || "contact@example.com",
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
                        <div className="flex flex-wrap items-center justify-center md:justify-start text-muted-foreground gap-3">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" strokeWidth={2} />
                                {location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Globe className="h-4 w-4" strokeWidth={2} />
                                {country}
                            </span>
                        </div>
                        {languages.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Speaks:</span> {languages.join(", ")}
                            </p>
                        )}
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
                        {startingPrice && (
                            <Link to={`/hire/${id}`}>
                                <Button size="lg" className="gap-2">
                                    <Calendar className="h-4 w-4" strokeWidth={2} />
                                    Request Booking
                                </Button>
                            </Link>
                        )}
                        <Button size="lg" variant="outline" onClick={() => setShowContact(!showContact)}>
                            {showContact ? "Hide Contact" : "Contact"}
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

            {/* Service Packages */}
            {packages.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold">Service Packages</h2>
                        <Link to={`/hire/${id}`}>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Calendar className="h-4 w-4" strokeWidth={2} /> Book Now
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {packages.map((pkg: PackageItem, i: number) => (
                            <div key={i} className={cn(
                                "p-5 rounded-xl border-2 space-y-3",
                                i === 1 ? "border-foreground" : "border-border"
                            )}>
                                {i === 1 && <span className="text-[10px] font-bold uppercase tracking-widest bg-foreground text-background px-2 py-0.5 rounded-full">Popular</span>}
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{pkg.name}</p>
                                    <p className="text-2xl font-bold mt-1">${pkg.price} <span className="text-sm font-normal text-muted-foreground">{currency}</span></p>
                                </div>
                                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                                    {pkg.deliveryDays} day{pkg.deliveryDays !== 1 ? "s" : ""} delivery
                                </div>
                                <ul className="space-y-1.5">
                                    {pkg.includes.map((item: string) => (
                                        <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                                            <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-foreground" strokeWidth={2.5} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
