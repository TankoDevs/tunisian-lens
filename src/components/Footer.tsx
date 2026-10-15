import { Camera, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t border-edge bg-canvas text-mist text-sm">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                    {/* Brand & Cultural Manifesto */}
                    <div className="md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-8 h-8 rounded-lg bg-surface border border-edge flex items-center justify-center text-ochre shadow-sm">
                                <Camera className="h-4.5 w-4.5 text-ochre" strokeWidth={1.8} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-lg font-bold tracking-tight text-alabaster">Tunisian Lens</span>
                                <span className="text-[9px] uppercase tracking-[0.22em] text-ochre/80 font-medium -mt-0.5">Archival Platform</span>
                            </div>
                        </Link>
                        <p className="text-xs text-mist leading-relaxed max-w-sm">
                            A museum-grade cultural photography archive and creative platform celebrating Tunisia's living heritage, topography, and visual narratives from the Mediterranean azure to the Saharan silence.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <a href="https://instagram.com/tunisianlens" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-edge text-mist hover:text-ochre hover:border-ochre/30 transition-colors" aria-label="Instagram">
                                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                            <a href="https://linkedin.com/company/tunisianlens" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-edge text-mist hover:text-sidi hover:border-sidi/30 transition-colors" aria-label="LinkedIn">
                                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                            <a href="https://x.com/tunisianlens" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-edge text-mist hover:text-alabaster hover:border-edge transition-colors" aria-label="Twitter">
                                <Twitter className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                            <a href="https://youtube.com/@tunisianlens" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface border border-edge text-mist hover:text-red-400 hover:border-red-400/30 transition-colors" aria-label="YouTube">
                                <Youtube className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    {/* Regional Archives */}
                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre mb-4">Regional Dispatches</h3>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link to="/?region=Tunis%20%26%20Suburbs#stories" className="text-mist hover:text-alabaster transition-colors">Tunis & Carthage</Link></li>
                            <li><Link to="/?region=Sahel#stories" className="text-mist hover:text-alabaster transition-colors">Sahel & Medina</Link></li>
                            <li><Link to="/?region=South%20%26%20Sahara#stories" className="text-mist hover:text-alabaster transition-colors">Sahara & Tozeur</Link></li>
                            <li><Link to="/?region=North#stories" className="text-mist hover:text-alabaster transition-colors">Tabarka & Bizerte</Link></li>
                        </ul>
                    </div>

                    {/* Discover */}
                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-alabaster/70 mb-4">Discover</h3>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link to="/explore" className="text-mist hover:text-alabaster transition-colors">Explore Gallery</Link></li>
                            <li><Link to="/creatives" className="text-mist hover:text-alabaster transition-colors">Find Creatives</Link></li>
                            <li><Link to="/gear" className="text-mist hover:text-alabaster transition-colors">Gear Marketplace</Link></li>
                            <li><Link to="/jobs" className="text-mist hover:text-alabaster transition-colors">Opportunities</Link></li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-alabaster/70 mb-4">Archive & Provenance</h3>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link to="/about" className="text-mist hover:text-alabaster transition-colors">Curatorial Mission</Link></li>
                            <li><Link to="/client-access" className="text-mist hover:text-alabaster transition-colors">Client Lightboxes</Link></li>
                            <li><Link to="/submit" className="text-mist hover:text-alabaster transition-colors">Submit Photographic Work</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-edge/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-mist/70">
                        &copy; {new Date().getFullYear()} Tunisian Lens. All photographic rights belong to respective authors.
                    </p>
                    <p className="text-ochre/80 font-medium">
                        Preserving Tunisia's living memory through light
                    </p>
                </div>
            </div>
        </footer>
    );
}
