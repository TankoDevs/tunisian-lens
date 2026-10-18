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
    const { formatPrice, symbol } = useCurrency();
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
    const mockRating = (4.5 + parseInt(artist.id.replace(/\D/g, '') || "1") * 0.07).toFixed(1);
    const mockReviews = 20 + parseInt(artist.id.replace(/\D/g, '') || "1") * 13;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-canvas text-alabaster py-8 md:py-12">
            {/* Back */}
            <div className="container mx-auto px-4 max-w-6xl mb-6">
                <Link to={`/artist/${artist.id}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist hover:text-ochre transition-colors">
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} /> Return to Artist Portfolio
                </Link>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Creative Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Profile Header Card */}
                        <div className="p-6 md:p-8 rounded-2xl bg-surface border border-edge flex flex-col sm:flex-row gap-6 items-start">
                            <img
                                src={artist.avatar}
                                alt={artist.name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-edge flex-shrink-0"
                            />
                            <div className="space-y-2.5 flex-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="font-serif text-2xl md:text-3xl font-normal text-alabaster">{artist.name}</h1>
                                    {isVerified && <VerificationBadge size={20} />}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-mist">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-sidi.azure" strokeWidth={1.5} /> {artist.location}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Globe className="h-3.5 w-3.5 text-mist/60" strokeWidth={1.5} />
                                        {artist.country}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-ochre font-medium">
                                        <Star className="h-3.5 w-3.5 fill-ochre text-ochre" strokeWidth={0} />
                                        {mockRating} ({mockReviews} reviews)
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {artist.categories.map(cat => (
                                        <span key={cat} className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-surface.elevated border border-edge text-alabaster/90 rounded-md">{cat}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="p-6 md:p-8 rounded-2xl bg-surface border border-edge space-y-3">
                            <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre">Creative Philosophy &amp; Practice</h2>
                            <p className="text-sm text-mist leading-relaxed font-light">{artist.bio}</p>
                        </div>

                        {/* Hiring Context */}
                        <div className="p-6 md:p-8 rounded-2xl border border-edge bg-surface space-y-4">
                            <h3 className="font-serif text-lg font-normal text-alabaster flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-ochre" /> Direct Commission Agreement
                            </h3>
                            <p className="text-xs text-mist leading-relaxed">
                                You are proposing a dedicated commissioned assignment to <strong>{artist.name}</strong>.
                                Propose your treatment, desired dates, deliverables, and intended budget directly without platform intermediaries.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                                <li className="flex items-center gap-2 text-alabaster/80">
                                    <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} /> Flexible project scope
                                </li>
                                <li className="flex items-center gap-2 text-alabaster/80">
                                    <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} /> Bespoke quote negotiation
                                </li>
                                <li className="flex items-center gap-2 text-alabaster/80">
                                    <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} /> Direct client-photographer thread
                                </li>
                                <li className="flex items-center gap-2 text-alabaster/80">
                                    <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} /> Escrow payment protection
                                </li>
                            </ul>
                        </div>

                        {/* Portfolio Preview */}
                        {artistProjects.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-serif text-xl font-normal text-alabaster">Selected Portfolio Folio</h2>
                                    <Link to={`/artist/${artist.id}`} className="text-xs text-ochre hover:underline uppercase tracking-wider font-semibold">
                                        View full portfolio
                                    </Link>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {artistProjects.map(project => (
                                        <div key={project.id} className="aspect-square rounded-2xl overflow-hidden bg-surface border border-edge">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Booking Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Contact Card */}
                        <div className="bg-surface border border-edge rounded-2xl p-6 space-y-5 sticky top-20 shadow-xl">
                            <div className="text-center pb-4 border-b border-edge">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-mist">Standard Commission Anchor</p>
                                <p className="font-mono text-3xl font-medium text-ochre mt-1">{formatPrice(artist.startingPrice)}</p>
                            </div>

                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-mist">Your Name</label>
                                        <Input required placeholder="Full name or studio" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-11 bg-surface.elevated border-edge text-alabaster text-xs focus:border-ochre placeholder:text-mist/40" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-mist">Corporate / Personal Email</label>
                                        <Input required type="email" placeholder="contact@domain.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-11 bg-surface.elevated border-edge text-alabaster text-xs focus:border-ochre placeholder:text-mist/40" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Target Shoot Date</label>
                                            <Input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="h-11 bg-surface.elevated border-edge text-alabaster text-xs focus:border-ochre" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Budget ({symbol})</label>
                                            <Input required type="number" placeholder="e.g. 800" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="h-11 bg-surface.elevated border-edge text-alabaster text-xs focus:border-ochre placeholder:text-mist/40" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-mist">Assignment Brief</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Specify locations, shot list requirements, licensing scope, and turnaround timeframe..."
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full text-xs rounded-xl border border-edge bg-surface.elevated text-alabaster px-4 py-3 resize-none focus:outline-none focus:border-ochre placeholder:text-mist/40"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-12 bg-ochre hover:bg-ochre/90 text-canvas font-semibold rounded-xl border-none shadow-md" size="lg">Send Commission Brief</Button>

                                    <p className="text-[10px] text-center text-mist/70 leading-relaxed px-2">
                                        Direct hiring conforms to Tunisian Lens curation and intellectual property guidelines.
                                    </p>

                                    {/* Direct contact */}
                                    <div className="border-t border-edge pt-4 space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-mist">Direct Inquiry Channel</p>
                                        <a href={`mailto:${artist.contact.email}`} className="flex items-center gap-2 text-xs text-mist hover:text-ochre transition-colors">
                                            <Mail className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} /> {artist.contact.email}
                                        </a>
                                        <a href={`tel:${artist.contact.phone}`} className="flex items-center gap-2 text-xs text-mist hover:text-ochre transition-colors">
                                            <Phone className="h-3.5 w-3.5 text-sidi.azure" strokeWidth={1.5} /> {artist.contact.phone}
                                        </a>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-6 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                                        <Check className="h-8 w-8 text-emerald-400" strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-serif text-lg font-normal text-alabaster">Brief Dispatched!</h3>
                                        <p className="text-xs text-mist leading-relaxed">
                                            {artist.name} has received your brief and will respond to <strong>{formData.email}</strong> shortly.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full border-edge text-alabaster hover:bg-surface.elevated rounded-xl" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", budget: "", date: "", message: "" }); }}>
                                        Send another proposal
                                    </Button>
                                    <Link to={`/artist/${artist.id}`} className="block text-xs text-mist hover:text-ochre uppercase tracking-wider font-semibold">
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
