import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./ui/Logo";

export function Footer() {
    return (
        <footer className="border-t border-border bg-background text-sm">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4 text-balance">
                        <Link to="/" className="flex items-center">
                            <Logo iconSize={20} textSize="text-xl" />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            A curated photography marketplace connecting clients with world-class visual artists. Where vision meets opportunity.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://instagram.com/tunisianlens" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-sand-400 transition-colors duration-300" aria-label="Instagram">
                                <Instagram className="h-5 w-5" strokeWidth={1.5} />
                            </a>
                            <a href="https://linkedin.com/company/tunisianlens" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0077b5] transition-colors duration-300" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" strokeWidth={1.5} />
                            </a>
                            <a href="https://x.com/tunisianlens" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-black dark:hover:text-white transition-colors duration-300" aria-label="Twitter">
                                <Twitter className="h-5 w-5" strokeWidth={1.5} />
                            </a>
                            <a href="https://youtube.com/@tunisianlens" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#FF0000] transition-colors duration-300" aria-label="YouTube">
                                <Youtube className="h-5 w-5" strokeWidth={1.5} />
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
