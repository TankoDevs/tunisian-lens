import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Camera } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <Camera className="h-6 w-6" />
                    <span className="font-serif text-xl font-bold tracking-tight">Tunisian Lens</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/explore" className="text-sm font-medium hover:text-primary/80 transition-colors">
                        Explore
                    </Link>
                    <Link to="/artists" className="text-sm font-medium hover:text-primary/80 transition-colors">
                        Photographers
                    </Link>
                    <Link to="/about" className="text-sm font-medium hover:text-primary/80 transition-colors">
                        About
                    </Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/client-access">
                        <Button variant="ghost" size="sm">Client Access</Button>
                    </Link>
                    <Link to="/submit">
                        <Button variant="ghost" size="sm">Submit Work</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Link to="/signup">
                        <Button size="sm">Sign Up</Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-b bg-background p-4 space-y-4">
                    <Link to="/explore" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                        Explore
                    </Link>
                    <Link to="/artists" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                        Photographers
                    </Link>
                    <Link to="/about" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    <Link to="/client-access" className="block text-sm font-medium py-2 text-primary" onClick={() => setIsOpen(false)}>
                        Client Access
                    </Link>
                    <Link to="/submit" className="block text-sm font-medium py-2" onClick={() => setIsOpen(false)}>
                        Submit Work
                    </Link>
                    <div className="pt-4 flex flex-col space-y-2">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full">Log In</Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                            <Button className="w-full">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
