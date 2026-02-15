import { Camera, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <Camera className="h-5 w-5" />
                            <span className="font-serif text-lg font-bold">Tunisian Lens</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Celebrating the visual art of Tunisia. A platform for photographers to showcase their unique perspective.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Discover</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/explore" className="hover:text-foreground">Explore Photos</Link></li>
                            <li><Link to="/artists" className="hover:text-foreground">Find Photographers</Link></li>
                            <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Community</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-foreground">Contact Support</Link></li>
                            <li><Link to="/guidelines" className="hover:text-foreground">Guidelines</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">Connect</h3>
                        <div className="flex space-x-4 text-muted-foreground">
                            <a href="#" className="hover:text-foreground"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-foreground"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-foreground"><Twitter className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Tunisian Lens. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
