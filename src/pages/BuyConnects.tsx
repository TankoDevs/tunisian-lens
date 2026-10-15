import { useState } from "react";
import { Zap, ShoppingCart, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const PACKAGES = [
    {
        id: "starter",
        connects: 20,
        price: 5,
        label: "Starter",
        desc: "Perfect for trying your first projects",
        popular: false,
    },
    {
        id: "growth",
        connects: 50,
        price: 10,
        label: "Growth",
        desc: "Great value for active creatives",
        popular: true,
    },
    {
        id: "pro",
        connects: 100,
        price: 18,
        label: "Pro",
        desc: "For creatives who apply regularly",
        popular: false,
    },
    {
        id: "studio",
        connects: 250,
        price: 40,
        label: "Studio",
        desc: "Best value for high-volume work",
        popular: false,
    },
];

export function BuyConnects() {
    const { isAuthenticated } = useAuth();
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [purchased, setPurchased] = useState<string | null>(null);

    const handleBuy = (pkgId: string) => {
        if (!isAuthenticated) return;
        setPurchasing(pkgId);
        // Simulate payment processing
        setTimeout(() => {
            setPurchasing(null);
            setPurchased(pkgId);
            setTimeout(() => setPurchased(null), 4000);
        }, 1800);
    };

    return (
        <div className="min-h-screen bg-canvas text-alabaster">
            {/* Header */}
            <section className="border-b border-edge bg-surface/40 backdrop-blur-md">
                <div className="container mx-auto px-6 py-16 md:py-20 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre">
                            <Zap className="h-3.5 w-3.5" strokeWidth={2} fill="currentColor" />
                            <span>Application Credits</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-alabaster">Connects Exchange</h1>
                        <p className="text-mist max-w-md mx-auto text-sm leading-relaxed">
                            Acquire credits to submit proposals for curated assignments. Credits never expire and carry no recurring subscription commitments.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Packages */}
            <section className="container mx-auto px-6 py-14 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                    {PACKAGES.map((pkg, i) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className={cn(
                                "relative rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300",
                                pkg.popular
                                    ? "border-ochre shadow-[0_0_30px_rgba(217,155,86,0.15)] bg-surface.elevated"
                                    : "border-edge bg-surface hover:border-ochre/40 hover:shadow-xl"
                            )}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-ochre text-canvas text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
                                        Most Selected
                                    </span>
                                </div>
                            )}

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-mist/60">{pkg.label}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <Zap className="h-5 w-5 text-ochre mb-0.5" strokeWidth={1.5} fill="currentColor" />
                                    <span className="font-mono text-4xl md:text-5xl font-medium tracking-tight text-alabaster">{pkg.connects}</span>
                                </div>
                                <p className="text-xs text-mist leading-relaxed font-light">{pkg.desc}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="font-mono text-2xl font-medium text-ochre">${pkg.price}</p>
                                <p className="text-[10px] text-mist/60 uppercase tracking-wider">one-time acquisition · permanent</p>
                            </div>

                            <div className="flex flex-col gap-2 text-xs text-mist">
                                {[
                                    "Permanent validity",
                                    "Instant allocation",
                                    "Tunisian Dinar & Card friendly",
                                ].map(f => (
                                    <div key={f} className="flex items-center gap-2">
                                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" strokeWidth={2} />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-2">
                                <AnimatePresence mode="wait">
                                    {purchased === pkg.id ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-center"
                                        >
                                            <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto mb-1" strokeWidth={2} />
                                            <p className="text-xs font-semibold text-emerald-400">
                                                +{pkg.connects} Connects Allocated!
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="btn" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            {isAuthenticated ? (
                                                <Button
                                                    className={cn("w-full gap-2 rounded-xl h-11 text-xs font-semibold", pkg.popular ? "bg-ochre hover:bg-ochre/90 text-canvas border-none" : "border-edge text-alabaster hover:bg-surface.elevated")}
                                                    variant={pkg.popular ? "default" : "outline"}
                                                    onClick={() => handleBuy(pkg.id)}
                                                    disabled={purchasing !== null}
                                                >
                                                    {purchasing === pkg.id ? (
                                                        <>
                                                            <div className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                                            Allocating…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                            Acquire for ${pkg.price}
                                                        </>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Link to="/login">
                                                    <Button variant="outline" className="w-full gap-2 rounded-xl h-11 text-xs border-edge text-alabaster hover:bg-surface.elevated">
                                                        Sign in to Acquire <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                    </Button>
                                                </Link>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* How connects work */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 max-w-2xl mx-auto border border-edge rounded-2xl p-8 bg-surface space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-ochre" strokeWidth={1.5} />
                        <h2 className="font-serif text-lg font-normal text-alabaster">Connects Economics &amp; Governance</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                        {[
                            { label: "Day Commissions", connects: "2 Connects", desc: "Short location shoots and portrait calls" },
                            { label: "Documentary Assignments", connects: "4 Connects", desc: "Multi-day architectural and heritage studies" },
                            { label: "Commercial Campaigns", connects: "6–8 Connects", desc: "National advertising briefs and film units" },
                        ].map(({ label, connects, desc }) => (
                            <div key={label} className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <Zap className="h-3.5 w-3.5 text-ochre" strokeWidth={2} fill="currentColor" />
                                    <span className="font-mono font-medium text-xs text-ochre">{connects}</span>
                                </div>
                                <p className="font-semibold text-alabaster">{label}</p>
                                <p className="text-mist leading-relaxed font-light">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-surface.elevated border border-edge rounded-xl text-xs text-mist leading-relaxed">
                        <strong className="text-alabaster">Transparent protocol:</strong> Every published brief transparently displays its required Connects threshold prior to proposal drafting. No surprise charges.
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
