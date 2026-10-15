import { Camera, Compass, Award, ShieldCheck, MapPin, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function About() {
    return (
        <div className="min-h-screen bg-canvas text-alabaster">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-edge py-24 md:py-32">
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-ochre/10 rounded-full blur-[140px]" />
                    <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-sidi-azure/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-edge bg-surface text-ochre text-xs tracking-widest uppercase font-mono">
                            <Sparkles className="w-3.5 h-3.5" /> Curatorial Manifesto
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-normal tracking-tight text-alabaster leading-[1.15]">
                            Curating Tunisia’s Visual Heritage
                        </h1>
                        <p className="text-base md:text-lg text-mist max-w-2xl mx-auto leading-relaxed font-sans font-light">
                            From the Mediterranean blues of Sidi Bou Said to the undulating ochre dunes of Douz, Tunisian Lens is an archival sanctuary dedicated to human-captured optical storytelling.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Curatorial Pillars */}
            <section className="py-20 md:py-28 border-b border-edge">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre">Core Pillars</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-alabaster">An Archive Built on Optical Truth</h2>
                        <p className="text-sm text-mist leading-relaxed">
                            We preserve the integrity of documentary and cultural imagery through rigorous editorial standards and photographer autonomy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "100% Certified Human Art",
                                desc: "Every frame uploaded undergoes client-side EXIF inspection and pixel integrity verification. Tunisian Lens strictly prohibits AI-generated simulations to preserve documentary authenticity.",
                                tag: "Integrity",
                            },
                            {
                                icon: Compass,
                                title: "Four Cultural Geographies",
                                desc: "Our archive is categorized across Tunisia's four primary biomes: the forested North, the historic Carthage-Tunis belt, the olive-rich Sahel coast, and the Saharan south.",
                                tag: "Geography",
                            },
                            {
                                icon: Award,
                                title: "Direct Creative Sovereignity",
                                desc: "Photographers maintain sovereign ownership over their copyright, raw optical archives, and commercial engagements with zero arbitrary intermediary commission cuts.",
                                tag: "Empowerment",
                            },
                        ].map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={pillar.title}
                                    className="p-8 rounded-2xl bg-surface border border-edge hover:border-edge/80 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 rounded-xl bg-canvas border border-edge flex items-center justify-center text-ochre group-hover:scale-105 transition-transform">
                                                <Icon className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-mist/60 px-2 py-0.5 rounded bg-canvas border border-edge">
                                                {pillar.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-serif text-alabaster pt-2">{pillar.title}</h3>
                                        <p className="text-sm text-mist leading-relaxed font-light">{pillar.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Curatorial Story */}
            <section className="py-20 md:py-28 border-b border-edge">
                <div className="container mx-auto px-6 max-w-4xl space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        <div className="md:col-span-4">
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre block mb-2">Our Origins</span>
                            <h2 className="text-2xl md:text-3xl font-serif text-alabaster">Why Tunisian Lens Exists</h2>
                        </div>
                        <div className="md:col-span-8 space-y-6 text-mist font-light leading-relaxed text-base">
                            <p>
                                Tunisia has stood for millennia as a crossroads of Mediterranean, Berber, Andalusian, and Saharan cultures. Yet for decades, imagery of our heritage was scattered across fleeting social feeds, compressed beyond recognition, and stripped of photographer credit.
                            </p>
                            <p>
                                <strong className="text-alabaster font-medium">Tunisian Lens</strong> was founded to establish a national visual archive. We provide a museum-grade digital platform where documentary photographers, architectural researchers, and visual artists publish series with complete EXIF camera optics, governorate geo-coordinates, and cultural provenance.
                            </p>
                            <p>
                                Whether illuminating Roman amphitheatres in El Jem, troglodyte architecture in Matmata, or everyday Mediterranean life along La Goulette, Tunisian Lens preserves our stories with the optical reverence they deserve.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Regional Territories Grid */}
            <section className="py-20 md:py-24 border-b border-edge bg-surface/30">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre">Territorial Scope</span>
                        <h2 className="text-3xl font-serif text-alabaster">Four Visual Geographies</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                name: "North & Forests",
                                loc: "Bizerte, Tabarka, Cap Bon",
                                desc: "Cork oak forests, Mediterranean cliffs, and ancient Phoenician ports.",
                                count: "640+ Frames",
                            },
                            {
                                name: "Tunis & Suburbs",
                                loc: "Carthage, Sidi Bou Said, Medina",
                                desc: "Cobblestone alleys, studded blue doors, and archaeological sanctuaries.",
                                count: "890+ Frames",
                            },
                            {
                                name: "Sahel & Coast",
                                loc: "Sousse, Monastir, Mahdia, El Jem",
                                desc: "Ribat fortresses, Roman mosaics, and coastal olive groves.",
                                count: "710+ Frames",
                            },
                            {
                                name: "South & Sahara",
                                loc: "Tozeur, Tataouine, Matmata, Douz",
                                desc: "Ochre dunes, subterranean dwellings, and desert stargazing.",
                                count: "550+ Frames",
                            },
                        ].map((region) => (
                            <div key={region.name} className="p-6 rounded-2xl bg-surface border border-edge space-y-3">
                                <div className="flex items-center gap-2 text-ochre text-xs font-mono">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{region.loc}</span>
                                </div>
                                <h3 className="text-lg font-serif text-alabaster">{region.name}</h3>
                                <p className="text-xs text-mist leading-relaxed font-light">{region.desc}</p>
                                <div className="pt-2 border-t border-edge/60 text-[11px] font-mono text-mist/60">
                                    {region.count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Archival Numbers */}
            <section className="py-20 md:py-24 border-b border-edge">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { num: "500+", label: "Verified Curators", icon: Camera },
                            { num: "2,790+", label: "Archival Series", icon: Eye },
                            { num: "24", label: "Governorates", icon: MapPin },
                            { num: "100%", label: "Certified Non-AI", icon: ShieldCheck },
                        ].map(({ num, label, icon: Icon }) => (
                            <div key={label} className="p-6 rounded-2xl bg-surface border border-edge space-y-2">
                                <Icon className="w-5 h-5 text-ochre mx-auto mb-2" strokeWidth={1.5} />
                                <div className="text-3xl md:text-4xl font-serif text-alabaster font-normal">{num}</div>
                                <div className="text-xs uppercase tracking-widest font-mono text-mist">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <div className="container mx-auto px-6 max-w-xl space-y-6">
                    <h2 className="text-3xl font-serif text-alabaster">Contribute to the Archive</h2>
                    <p className="text-sm text-mist font-light leading-relaxed">
                        Are you an optical photographer or cultural videographer documenting Tunisia? Join our verified creative guild and publish your portfolio to the world.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <Link
                            to="/signup"
                            className="px-6 py-3 rounded-full bg-ochre hover:bg-ochre-light text-canvas font-medium text-xs tracking-wider uppercase transition-all shadow-md"
                        >
                            Apply as Photographer
                        </Link>
                        <Link
                            to="/explore"
                            className="px-6 py-3 rounded-full border border-edge bg-surface hover:bg-surface-elevated text-alabaster text-xs tracking-wider uppercase transition-all"
                        >
                            Explore Folios
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
