import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Globe, Mail, Phone, Star, Check, ChevronLeft, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ARTISTS, PROJECTS } from "../data/mockData";
import { VerificationBadge } from "../components/ui/VerificationBadge";
import { isArtistVerified } from "../lib/verification";
import { useCurrency } from "../lib/useCurrency";



export function Hire() {
    const { id } = useParams<{ id: string }>();
    const artist = ARTISTS.find(a => a.id === id);
    const [formData, setFormData] = useState({ name: "", email: "", budget: "", date: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const artistProjects = PROJECTS.filter(p => p.artist.id === id).slice(0, 3);

    if (!artist) {
        return (
            <div className="container mx-auto px-4 py-20 text-center space-y-4">
                <h1 className="text-2xl font-sans font-bold">Creative Not Found</h1>
                <p className="text-muted-foreground">The profile you are looking for does not exist.</p>
                <Link to="/creatives">
                    <Button>Browse Creatives</Button>
                </Link>
            </div>
        );
    }

    const isVerified = isArtistVerified(artist.id);
    const { formatPrice } = useCurrency();
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
                <Link to={`/artist/${artist.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} /> Back to Artist Profile
                </Link>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Creative Info */}
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
                                    <h1 className="text-2xl font-sans font-bold">{artist.name}</h1>
                                    {isVerified && <VerificationBadge size={20} />}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" strokeWidth={2} /> {artist.location}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Globe className="h-4 w-4" strokeWidth={2} />
                                        {artist.country}
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
                            </div>
                        </div>

                        {/* About */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-sans font-semibold">About</h2>
                            <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
                        </div>

                        {/* Hiring Context */}
                        <div className="p-6 rounded-2xl border bg-muted/30 border-dashed space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" /> Direct Booking Request
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                You are initiating a direct hiring request with <strong>{artist.name}</strong>.
                                Since our platform moved to a negotiation-based model, you can now propose your own project scope and budget directly.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" strokeWidth={2.5} /> Flexible project scope
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" strokeWidth={2.5} /> Custom budget proposals
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" strokeWidth={2.5} /> Direct communication
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" strokeWidth={2.5} /> Secure payments
                                </li>
                            </ul>
                        </div>

                        {/* Portfolio Preview */}
                        {artistProjects.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-sans font-semibold">Portfolio Preview</h2>
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
                                <p className="text-3xl font-bold">{formatPrice(artist.startingPrice)}</p>
                            </div>

                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold">Your Name</label>
                                        <Input required placeholder="Full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-10 text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold">Email</label>
                                        <Input required type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-10 text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold">Project Date</label>
                                            <Input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="h-10 text-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold">Your Budget ($)</label>
                                            <Input required type="number" placeholder="e.g. 500" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="h-10 text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold">Project Details</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Describe what you need, location, duration, etc…"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" size="lg">Send Hiring Request</Button>

                                    <p className="text-[10px] text-center text-muted-foreground px-2">
                                        By sending a request, you agree to our terms of service for direct hiring and payment protection.
                                    </p>

                                    {/* Direct contact */}
                                    <div className="border-t pt-4 space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alternative Contact</p>
                                        <a href={`mailto:${artist.contact.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                                            <Mail className="h-4 w-4" strokeWidth={2} /> {artist.contact.email}
                                        </a>
                                        <a href={`tel:${artist.contact.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                                            <Phone className="h-4 w-4" strokeWidth={2} /> {artist.contact.phone}
                                        </a>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-6 space-y-4 animate-in fade-in duration-500">
                                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                                        <Check className="h-8 w-8 text-green-600" strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">Request Sent!</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {artist.name} will review your project details and get back to you at <strong>{formData.email}</strong> shortly.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", budget: "", date: "", message: "" }); }}>
                                        Send another request
                                    </Button>
                                    <Link to={`/artist/${artist.id}`} className="block text-sm text-muted-foreground hover:text-foreground">
                                        Return to Profile
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
