import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Globe, Mail, Instagram, Phone, Star, Clock, Check, ChevronLeft, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { isArtistVerified } from "./ArtistProfile";
import { cn } from "../lib/utils";

const COUNTRY_FLAGS: Record<string, string> = {
    "Tunisia": "🇹🇳",
    "France": "🇫🇷",
    "UAE": "🇦🇪",
    "United Kingdom": "🇬🇧",
    "United States": "🇺🇸",
    "Germany": "🇩🇪",
    "Morocco": "🇲🇦",
    "Egypt": "🇪🇬",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹",
    "Turkey": "🇹🇷",
    "Lebanon": "🇱🇧",
};

export function Hire() {
    const { id } = useParams<{ id: string }>();
    const artist = ARTISTS.find(a => a.id === id);
    const [selectedPackage, setSelectedPackage] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", date: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const artistProjects = PROJECTS.filter(p => p.artist.id === id).slice(0, 3);

    if (!artist) {
        return (
            <div className="container mx-auto px-4 py-20 text-center space-y-4">
                <h1 className="text-2xl font-serif font-bold">Photographer Not Found</h1>
                <p className="text-muted-foreground">The profile you are looking for does not exist.</p>
                <Link to="/photographers">
                    <Button>Browse Photographers</Button>
                </Link>
            </div>
        );
    }

    const isVerified = isArtistVerified(artist.id);
    const mockRating = (4.5 + parseInt(artist.id.replace(/\D/g, '') || "1") * 0.07).toFixed(1);
    const mockReviews = 20 + parseInt(artist.id.replace(/\D/g, '') || "1") * 13;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen">
            {/* Back */}
            <div className="container mx-auto px-4 pt-6">
                <Link to="/photographers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} /> Back to Photographers
                </Link>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Photographer Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start border-b pb-8">
                            <img
                                src={artist.avatar}
                                alt={artist.name}
                                className="w-28 h-28 rounded-2xl object-cover border-2 border-border flex-shrink-0"
                            />
                            <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-serif font-bold">{artist.name}</h1>
                                    {isVerified && <VerificationBadge size={20} />}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" strokeWidth={2} /> {artist.location}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Globe className="h-4 w-4" strokeWidth={2} />
                                        {COUNTRY_FLAGS[artist.country] || ""} {artist.country}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" strokeWidth={0} />
                                        {mockRating} ({mockReviews} reviews)
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {artist.categories.map(cat => (
                                        <span key={cat} className="text-xs px-2.5 py-1 bg-secondary rounded-full">{cat}</span>
                                    ))}
                                </div>
                                <div className="flex gap-1 text-xs text-muted-foreground pt-1">
                                    <span className="font-medium text-foreground">Languages:</span>
                                    {artist.languages.join(", ")}
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-serif font-semibold">About</h2>
                            <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
                        </div>

                        {/* Service Packages */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-serif font-semibold">Service Packages</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {artist.packages.map((pkg, i) => (
                                    <button
                                        key={pkg.name}
                                        onClick={() => { setSelectedPackage(i); setShowForm(true); }}
                                        className={cn(
                                            "text-left p-5 rounded-xl border-2 transition-all duration-200 space-y-3",
                                            selectedPackage === i && showForm
                                                ? "border-foreground bg-foreground text-background"
                                                : "border-border hover:border-foreground/50 bg-card"
                                        )}
                                    >
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">{pkg.name}</p>
                                            <p className={cn("text-2xl font-bold mt-1", selectedPackage === i && showForm ? "text-background" : "")}>
                                                ${pkg.price}
                                                <span className={cn("text-sm font-normal ml-1", selectedPackage === i && showForm ? "text-background/70" : "text-muted-foreground")}>
                                                    {pkg.currency}
                                                </span>
                                            </p>
                                        </div>
                                        <p className={cn("text-sm", selectedPackage === i && showForm ? "text-background/80" : "text-muted-foreground")}>
                                            {pkg.description}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                                            {pkg.deliveryDays} day{pkg.deliveryDays !== 1 ? "s" : ""} delivery
                                        </div>
                                        <ul className="space-y-1.5">
                                            {pkg.includes.map(item => (
                                                <li key={item} className="flex items-start gap-2 text-xs">
                                                    <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio Preview */}
                        {artistProjects.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-serif font-semibold">Portfolio Preview</h2>
                                    <Link to={`/artist/${artist.id}`} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2">
                                        View full profile
                                    </Link>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {artistProjects.map(project => (
                                        <div key={project.id} className="aspect-square rounded-xl overflow-hidden">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Booking Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Contact */}
                        <div className="bg-card border rounded-2xl p-5 space-y-4 sticky top-20">
                            <div className="text-center pb-2 border-b">
                                <p className="text-sm text-muted-foreground">Starting from</p>
                                <p className="text-3xl font-bold">${artist.startingPrice}
                                    <span className="text-base font-normal text-muted-foreground ml-1">{artist.currency}</span>
                                </p>
                            </div>

                            {!submitted ? (
                                <>
                                    <Button className="w-full" size="lg" onClick={() => setShowForm(true)}>
                                        <Calendar className="h-4 w-4 mr-2" strokeWidth={2} />
                                        Request a Booking
                                    </Button>

                                    {showForm && (
                                        <form onSubmit={handleSubmit} className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                                            {/* Package selector */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold">Package</label>
                                                <div className="grid grid-cols-3 gap-1">
                                                    {artist.packages.map((pkg, i) => (
                                                        <button
                                                            type="button"
                                                            key={pkg.name}
                                                            onClick={() => setSelectedPackage(i)}
                                                            className={cn(
                                                                "text-xs py-1.5 rounded-lg border transition-colors",
                                                                selectedPackage === i
                                                                    ? "bg-foreground text-background border-foreground"
                                                                    : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {pkg.name}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    ${artist.packages[selectedPackage].price} · {artist.packages[selectedPackage].deliveryDays}d delivery
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold">Your Name</label>
                                                <Input required placeholder="Full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-9 text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold">Email</label>
                                                <Input required type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-9 text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold">Preferred Date</label>
                                                <Input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="h-9 text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold">Message</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    placeholder="Describe your project…"
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                                                />
                                            </div>
                                            <Button type="submit" className="w-full">Send Booking Request</Button>
                                        </form>
                                    )}

                                    {/* Direct contact */}
                                    <div className="border-t pt-4 space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Direct Contact</p>
                                        <a href={`mailto:${artist.contact.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                                            <Mail className="h-4 w-4" strokeWidth={2} /> {artist.contact.email}
                                        </a>
                                        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                                            <Instagram className="h-4 w-4" strokeWidth={2} /> {artist.contact.instagram}
                                        </a>
                                        <a href={`tel:${artist.contact.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                                            <Phone className="h-4 w-4" strokeWidth={2} /> {artist.contact.phone}
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6 space-y-3 animate-in fade-in duration-500">
                                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                                        <Check className="h-8 w-8 text-green-600" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="font-semibold">Request Sent!</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {artist.name} will get back to you at <strong>{formData.email}</strong> within 24 hours.
                                    </p>
                                    <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setShowForm(false); setFormData({ name: "", email: "", date: "", message: "" }); }}>
                                        Send another request
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
