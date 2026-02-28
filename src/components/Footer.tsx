import { Camera, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center space-x-2.5">
                            <Camera className="h-5 w-5 text-sand-400" strokeWidth={1.8} />
                            <span className="font-serif text-xl font-bold tracking-tight">Tunisian Lens</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            A curated photography marketplace connecting clients with world-class visual artists. Where vision meets opportunity.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-sand-400 transition-colors duration-300" aria-label="Instagram">
                                <Instagram className="h-4.5 w-4.5" strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    {/* Discover */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Discover</h3>
                        <ul className="space-y-3">
                            <li><Link to="/explore" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300">Explore Gallery</Link></li>
                            <li><Link to="/creatives" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300">Find Creatives</Link></li>
                            <li><Link to="/jobs" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300">Job Marketplace</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300">About</Link></li>
                            <li><Link to="/client-access" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300">Client Access</Link></li>
                            <li><Link to="/submit" className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300">Submit Work</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Tunisian Lens. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                        Crafted for visual artists
                    </p>
                </div>
            </div>
        </footer>
    );
}
