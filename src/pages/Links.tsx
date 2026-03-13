import { Link } from "react-router-dom";
import {
    ExternalLink,
    Globe,
    Layout,
    Share2,
    Instagram,
    Linkedin,
    Twitter,
    MessageSquare,
    Camera,
    Mail,
    ArrowRight,
    Play
} from "lucide-react";
import { Button } from "../components/ui/button";

export const Links = () => {
    const sections: { title: string; links: { title: string; url: string; description: string; icon: React.ReactNode; color: string; isInternal?: boolean }[] }[] = [
        {
            title: "Connect with Us",
            links: [
                {
                    title: "Instagram",
                    url: "https://instagram.com/tunisianlens",
                    description: "Daily visual stories from across Tunisia.",
                    icon: <Instagram className="w-5 h-5" />,
                    color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
                },
                {
                    title: "LinkedIn",
                    url: "https://linkedin.com/company/tunisianlens",
                    description: "Professional networking for the creative industry.",
                    icon: <Linkedin className="w-5 h-5" />,
                    color: "bg-[#0077b5]",
                },
                {
                    title: "Twitter / X",
                    url: "https://x.com/tunisianlens",
                    description: "Latest updates and photography news.",
                    icon: <Twitter className="w-5 h-5" />,
                    color: "bg-black",
                },
                {
                    title: "TikTok",
                    url: "https://tiktok.com/@tunisianlens",
                    description: "Behind the scenes and cinematic shorts.",
                    icon: <Play className="w-5 h-5 fill-current" />,
                    color: "bg-[#000000]",
                },
            ]
        },
        {
            title: "Join the Community",
            links: [
                {
                    title: "Discord Community",
                    url: "#",
                    description: "Join our vibrant community of visual artists.",
                    icon: <MessageSquare className="w-5 h-5" />,
                    color: "bg-[#5865F2]",
                },
                {
                    title: "Artist Newsletter",
                    url: "#",
                    description: "Get monthly tips, trends, and opportunities.",
                    icon: <Mail className="w-5 h-5" />,
                    color: "bg-sand-500",
                },
            ]
        },
        {
            title: "Quick Access",
            links: [
                {
                    title: "Main Platform",
                    url: "/",
                    description: "Return to the Tunisian Lens homepage.",
                    icon: <Globe className="w-5 h-5" />,
                    color: "bg-primary",
                    isInternal: true,
                },
                {
                    title: "Explore Gallery",
                    url: "/explore",
                    description: "Browse curated Tunisian photography.",
                    icon: <Layout className="w-5 h-5" />,
                    color: "bg-indigo-500",
                    isInternal: true,
                },
                {
                    title: "Submit a Project",
                    url: "/submit",
                    description: "Share your work with the community.",
                    icon: <Share2 className="w-5 h-5" />,
                    color: "bg-emerald-500",
                    isInternal: true,
                },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sand-200/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10 max-w-xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-card border mb-6 shadow-sm">
                        <Camera className="w-8 h-8 text-sand-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 tracking-tight">Tunisian Lens Hub</h1>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto italic">
                        "Your vision, our lens. Connecting Tunisia's creative pulse to the world."
                    </p>
                </div>

                <div className="space-y-10">
                    {sections.map((section, sIndex) => (
                        <div key={sIndex} className="space-y-4">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2">
                                {section.title}
                            </h2>
                            <div className="space-y-3">
                                {section.links.map((link, lIndex) => (
                                    <div key={lIndex}>
                                        {link.isInternal ? (
                                            <Link
                                                to={link.url}
                                                className="group flex items-center p-4 bg-card hover:bg-accent/40 border rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                                            >
                                                <div className={`p-2.5 rounded-xl text-white ${link.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                    {link.icon}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h3 className="font-medium text-sm text-foreground">{link.title}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{link.description}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center p-4 bg-card hover:bg-accent/40 border rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                                            >
                                                <div className={`p-2.5 rounded-xl text-white ${link.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                    {link.icon}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex items-center">
                                                        <h3 className="font-medium text-sm text-foreground">{link.title}</h3>
                                                        <ExternalLink className="w-3 h-3 ml-2 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{link.description}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Section in Hub */}
                <div className="mt-16 pt-8 border-t border-dashed text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-6">
                        Contact Inquiries
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button variant="outline" size="sm" className="rounded-full px-6 h-9 text-xs">
                            Email Us
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full px-6 h-9 text-xs font-semibold">
                            Help Center
                        </Button>
                    </div>
                    <p className="mt-12 text-[10px] text-muted-foreground/60">
                        &copy; {new Date().getFullYear()} Tunisian Lens Marketplace. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Links;
