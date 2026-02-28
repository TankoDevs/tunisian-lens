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
import { motion } from "framer-motion";

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

    const verifiedFromStorage = id ? isArtistVerified(id) : false;
    const [isVerified, setIsVerified] = useState<boolean>(verifiedFromStorage);

    const mockUsers: ArtistLike[] = JSON.parse(localStorage.getItem('tunisian_lens_mock_users') || '[]');

    const artist: ArtistLike | undefined =
        (ARTISTS.find(a => a.id === id) as ArtistLike | undefined) ||
        mockUsers.find(u => u.id === id);

    const artistProjects = PROJECTS.filter(p => p.artist.id === id);

    if (!artist) {
        return (
            <div className="container mx-auto px-6 py-32 text-center space-y-6">
                <div className="w-12 h-[1.5px] bg-sand-400 mx-auto mb-6" />
                <h1 className="text-3xl font-serif font-bold">Artist Not Found</h1>
                <p className="text-muted-foreground">The profile you are looking for does not exist or is private.</p>
                <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        );
    }

    const toggleVerification = () => {
        const newStatus = !isVerified;
        setIsVerified(newStatus);
        if (id) setArtistVerification(id, newStatus);
    };

    const location = artist.location || "Tunisia";
    const country = artist.country || "Tunisia";
    const bio = artist.bio || "Passionate creative exploring the beauty of Tunisia.";
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
        <div className="min-h-screen bg-background">
            {/* ── Profile Header ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-6 py-16"
            >
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Profile Info (Sidebar) */}
                    <div className="lg:w-80 flex-shrink-0 space-y-6">
                        <div className="text-center lg:text-left space-y-4">
                            <img
                                src={artist.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                                alt={artist.name}
                                className="w-28 h-28 rounded-full object-cover mx-auto lg:mx-0 ring-2 ring-sand-200 dark:ring-sand-800"
                            />
                            <div>
                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <h1 className="text-2xl font-serif font-bold">{artist.name}</h1>
                                    {isVerified && <VerificationBadge size={18} />}
                                </div>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                                        {location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                                        {country}
                                    </span>
                                </div>
                            </div>

                            {languages.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">Speaks:</span> {languages.join(", ")}
                                </p>
                            )}

                            <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>

                            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                                {profileCategories.map((cat: string) => (
                                    <span key={cat} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-sand-50 text-sand-700 dark:bg-sand-900/20 dark:text-sand-400 rounded">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            {isAdmin && (
                                <Button
                                    variant={isVerified ? "outline" : "default"}
                                    onClick={toggleVerification}
                                    className="w-full flex items-center gap-2 text-sm"
                                >
                                    <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                                    {isVerified ? "Remove Verification" : "Verify Creative"}
                                </Button>
                            )}
                            {startingPrice && (
                                <Link to={`/hire/${id}`} className="block">
                                    <Button size="lg" className="w-full gap-2">
                                        <Calendar className="h-4 w-4" strokeWidth={1.5} />
                                        Request Booking
                                    </Button>
                                </Link>
                            )}
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => setShowContact(!showContact)}
                                className="w-full"
                            >
                                {showContact ? "Hide Contact" : "Get in Touch"}
                            </Button>
                        </div>

                        {/* Contact Info */}
                        {showContact && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-muted/50 border border-border rounded-lg p-4 space-y-3"
                            >
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                    <a href={`mailto:${contact.email}`} className="text-sm hover:text-sand-600 transition-colors">{contact.email}</a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                    <a href={`tel:${contact.phone}`} className="text-sm hover:text-sand-600 transition-colors">{contact.phone}</a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Instagram className="h-4 w-4 text-sand-500" strokeWidth={1.5} />
                                    <a href="#" className="text-sm hover:text-sand-600 transition-colors">{contact.instagram}</a>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Portfolio Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Service Packages */}
                        {packages.length > 0 && (
                            <div className="mb-16">
                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-1">Services</p>
                                        <h2 className="text-2xl font-serif font-bold">Packages</h2>
                                    </div>
                                    <Link to={`/hire/${id}`}>
                                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                            <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} /> Book Now
                                        </Button>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {packages.map((pkg: PackageItem, i: number) => (
                                        <div key={i} className={cn(
                                            "p-6 rounded-lg border space-y-4 transition-all duration-300",
                                            i === 1 ? "border-sand-400 bg-sand-50/50 dark:bg-sand-900/10" : "border-border hover:border-sand-300 dark:hover:border-sand-700"
                                        )}>
                                            {i === 1 && <span className="text-[9px] font-bold uppercase tracking-widest bg-sand-400 text-white px-2 py-0.5 rounded">Popular</span>}
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{pkg.name}</p>
                                                <p className="text-2xl font-serif font-bold mt-1">${pkg.price} <span className="text-sm font-sans font-normal text-muted-foreground">{currency}</span></p>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                {pkg.deliveryDays} day{pkg.deliveryDays !== 1 ? "s" : ""} delivery
                                            </div>
                                            <ul className="space-y-2 pt-2 border-t border-border">
                                                {pkg.includes.map((item: string) => (
                                                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                        <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-sand-500" strokeWidth={2} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Portfolio */}
                        <div>
                            <div className="mb-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-500 mb-1">Portfolio</p>
                                <h2 className="text-2xl font-serif font-bold">Selected Work</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-muted-foreground">No projects uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
