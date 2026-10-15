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

export const Links = () => {
    const sections: { title: string; links: { title: string; url: string; description: string; icon: React.ReactNode; color: string; isInternal?: boolean }[] }[] = [
        {
            title: "Archival Dispatches & Socials",
            links: [
                {
                    title: "Instagram Archive",
                    url: "https://instagram.com/tunisianlens",
                    description: "Daily optical selections from across the 24 governorates.",
                    icon: <Instagram className="w-5 h-5" />,
                    color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
                },
                {
                    title: "LinkedIn Creative Guild",
                    url: "https://linkedin.com/company/tunisianlens",
                    description: "Commercial opportunities, commissions, and production networks.",
                    icon: <Linkedin className="w-5 h-5" />,
                    color: "bg-[#0077b5]",
                },
                {
                    title: "X / Twitter Dispatch",
                    url: "https://x.com/tunisianlens",
                    description: "Curatorial commentary, camera optic releases, and photography news.",
                    icon: <Twitter className="w-5 h-5" />,
                    color: "bg-black",
                },
                {
                    title: "TikTok Film Shorts",
                    url: "https://tiktok.com/@tunisianlens",
                    description: "Behind the lens, lighting tests, and documentary shorts.",
                    icon: <Play className="w-5 h-5 fill-current" />,
                    color: "bg-[#111111]",
                },
            ]
        },
        {
            title: "Guild Guildhall & Community",
            links: [
                {
                    title: "Curators Discord",
                    url: "#",
                    description: "Connect with fellow photographers, share raw frames, and arrange photowalks.",
                    icon: <MessageSquare className="w-5 h-5" />,
                    color: "bg-[#5865F2]",
                },
                {
                    title: "Monthly Archival Gazette",
                    url: "#",
                    description: "Curated monographs, historical essays, and exhibition announcements.",
                    icon: <Mail className="w-5 h-5" />,
                    color: "bg-ochre text-canvas",
                },
            ]
        },
        {
            title: "Direct Platform Access",
            links: [
                {
                    title: "National Gallery & Masonry",
                    url: "/",
                    description: "Explore the live public exhibition and chromatic index.",
                    icon: <Globe className="w-5 h-5" />,
                    color: "bg-surface border border-edge text-ochre",
                    isInternal: true,
                },
                {
                    title: "Curatorial Exploration",
                    url: "/explore",
                    description: "Filter series by governorate, discipline, and optical specifications.",
                    icon: <Layout className="w-5 h-5" />,
                    color: "bg-surface border border-edge text-sidi-azure",
                    isInternal: true,
                },
                {
                    title: "Submit a Cultural Series",
                    url: "/submit",
                    description: "Publish your original human-captured photography.",
                    icon: <Share2 className="w-5 h-5" />,
                    color: "bg-surface border border-edge text-emerald-400",
                    isInternal: true,
                },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-canvas text-alabaster relative overflow-hidden py-16 md:py-24">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-ochre/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-sidi-azure/10 rounded-full blur-[130px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-xl">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-surface border border-edge text-ochre shadow-lg mb-2">
                        <Camera className="w-7 h-7" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre block">Ecosystem Directory</span>
                    <h1 className="text-3xl md:text-4xl font-serif text-alabaster tracking-tight">Tunisian Lens Hub</h1>
                    <p className="text-mist text-xs md:text-sm max-w-xs mx-auto italic font-light">
                        "Your vision, our national archive. Connecting Tunisia's creative pulse to the world."
                    </p>
                </div>

                <div className="space-y-10">
                    {sections.map((section, sIndex) => (
                        <div key={sIndex} className="space-y-3">
                            <h2 className="text-xs font-mono uppercase tracking-widest text-mist/70 px-2">
                                {section.title}
                            </h2>
                            <div className="space-y-3">
                                {section.links.map((link, lIndex) => {
                                    const content = (
                                        <>
                                            <div className={`p-2.5 rounded-xl ${link.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                                                {link.icon}
                                            </div>
                                            <div className="ml-4 flex-1 min-w-0">
                                                <h3 className="font-serif text-sm text-alabaster group-hover:text-ochre transition-colors truncate">{link.title}</h3>
                                                <p className="text-xs text-mist font-light line-clamp-1 mt-0.5">{link.description}</p>
                                            </div>
                                            {link.isInternal ? (
                                                <ArrowRight className="w-4 h-4 text-mist group-hover:text-ochre group-hover:translate-x-1 transition-all ml-2 flex-shrink-0" />
                                            ) : (
                                                <ExternalLink className="w-4 h-4 text-mist/60 group-hover:text-ochre transition-colors ml-2 flex-shrink-0" />
                                            )}
                                        </>
                                    );

                                    return (
                                        <div key={lIndex}>
                                            {link.isInternal ? (
                                                <Link
                                                    to={link.url}
                                                    className="group flex items-center p-4 bg-surface hover:bg-surface-elevated border border-edge hover:border-edge/80 rounded-2xl transition-all duration-300 shadow-sm"
                                                >
                                                    {content}
                                                </Link>
                                            ) : (
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center p-4 bg-surface hover:bg-surface-elevated border border-edge hover:border-edge/80 rounded-2xl transition-all duration-300 shadow-sm"
                                                >
                                                    {content}
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-14 text-center">
                    <p className="text-[11px] font-mono text-mist/50">
                        Tunisian Lens Archives · Built for Cultural Preservation
                    </p>
                </div>
            </div>
        </div>
    );
};
