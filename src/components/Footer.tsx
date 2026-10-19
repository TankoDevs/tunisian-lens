import { Camera, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t border-white/[0.08] bg-[#0C0D0E] text-[#71717A] text-sm">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Brand & Cultural Manifesto (Spans 6 cols on large screens) */}
                    <div className="lg:col-span-6 space-y-5">
                        <Link to="/" className="inline-flex items-center space-x-3 group">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#E2F952] shadow-sm group-hover:border-[#E2F952]/40 transition-colors">
                                <Camera className="h-4 w-4 text-[#E2F952]" strokeWidth={1.8} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display text-lg font-bold tracking-tight text-[#F4F4F5]">Tunisian Lens</span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[#E2F952] font-semibold -mt-0.5 font-mono">Archival Platform</span>
                            </div>
                        </Link>
                        <p className="text-xs text-[#71717A] leading-relaxed max-w-md font-normal">
                            A museum-grade cultural photography archive and creative platform celebrating Tunisia’s living heritage, topography, and visual narratives from the Mediterranean azure to the Saharan silence.
                        </p>
                        <div className="flex space-x-2.5 pt-1">
                            <a 
                                href="https://instagram.com/tunisianlens" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#71717A] hover:text-[#E2F952] hover:border-[#E2F952]/30 transition-all duration-200" 
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                            <a 
                                href="https://linkedin.com/company/tunisianlens" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#71717A] hover:text-[#E2F952] hover:border-[#E2F952]/30 transition-all duration-200" 
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                            <a 
                                href="https://x.com/tunisianlens" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#71717A] hover:text-[#F4F4F5] hover:border-white/[0.2] transition-all duration-200" 
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                            <a 
                                href="https://youtube.com/@tunisianlens" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#71717A] hover:text-red-400 hover:border-red-400/30 transition-all duration-200" 
                                aria-label="YouTube"
                            >
                                <Youtube className="h-4 w-4" strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    {/* Column 1: Platform & Discover (3 cols) */}
                    <div className="lg:col-span-3">
                        <span className="section-label text-[#E2F952] block mb-4">Platform</span>
                        <ul className="space-y-3 text-xs">
                            <li>
                                <Link to="/explore" className="text-[#71717A] hover:text-[#F4F4F5] transition-colors">
                                    Explore Gallery
                                </Link>
                            </li>
                            <li>
                                <Link to="/creatives" className="text-[#71717A] hover:text-[#F4F4F5] transition-colors">
                                    Find Creatives
                                </Link>
                            </li>
                            <li>
                                <Link to="/gear" className="text-[#71717A] hover:text-[#F4F4F5] transition-colors">
                                    Gear Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="text-[#71717A] hover:text-[#F4F4F5] transition-colors">
                                    Field Commissions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Archive & Provenance (3 cols) */}
                    <div className="lg:col-span-3">
                        <span className="section-label text-[#E2F952] block mb-4">Archive & Provenance</span>
                        <ul className="space-y-3 text-xs">
                            <li>
                                <Link to="/about" className="text-[#71717A] hover:text-[#F4F4F5] transition-colors">
                                    Curatorial Mission
                                </Link>
                            </li>
                            <li>
                                <Link to="/submit" className="text-[#71717A] hover:text-[#F4F4F5] transition-colors">
                                    Submit Monograph
                                </Link>
                            </li>
                            <li>
                                <Link to="/client-access" className="text-[#71717A] hover:text-[#F4F4F5] transition-colors">
                                    Client Lightboxes
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                    <p className="text-[#71717A]/70">
                        &copy; {new Date().getFullYear()} Tunisian Lens. All photographic rights belong to respective authors.
                    </p>
                    <p className="text-[#E2F952]/80">
                        Preserving Tunisia’s living memory through light
                    </p>
                </div>
            </div>
        </footer>
    );
}
