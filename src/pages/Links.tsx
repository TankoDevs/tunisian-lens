import { Link } from "react-router-dom";
import { ExternalLink, Globe, Layout, Share2 } from "lucide-react";

export const Links = () => {
    const currentUrl = window.location.origin;

    const links = [
        {
            title: "Local Development Site",
            url: currentUrl,
            description: "Click here to view your current local development version of Tunisian Lens.",
            icon: <Globe className="w-5 h-5" />,
        },
        {
            title: "Explore Photography",
            url: "/explore",
            description: "Browse the beautiful collection of Tunisian photography.",
            icon: <Layout className="w-5 h-5" />,
            isInternal: true,
        },
        {
            title: "Submit a Project",
            url: "/submit",
            description: "Share your work with the Tunisian photography community.",
            icon: <Share2 className="w-5 h-5" />,
            isInternal: true,
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">Access Links</h1>
                <p className="text-muted-foreground">
                    Quickly access the site and important pages. Use the links below to check your latest changes.
                </p>
            </div>

            <div className="space-y-4">
                {links.map((link, index) => (
                    <div
                        key={index}
                        className="group relative bg-card hover:bg-accent/50 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                {link.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-lg">{link.title}</h3>
                                    {link.isInternal ? (
                                        <Link
                                            to={link.url}
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {link.description}
                                </p>
                                {link.isInternal ? (
                                    <Link
                                        to={link.url}
                                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                    >
                                        Open Page
                                    </Link>
                                ) : (
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                    >
                                        {link.url}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 bg-accent/30 rounded-2xl border border-dashed text-center">
                <h2 className="text-xl font-semibold mb-2">Pro Tip</h2>
                <p className="text-muted-foreground">
                    Keep this tab open as you develop. Every time you save a change, you can refresh the local link here to see the update instantly.
                </p>
            </div>
        </div>
    );
};

export default Links;
