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
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="border-b border-border">
                <div className="container mx-auto px-6 py-20 text-center space-y-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                            <Zap className="h-3.5 w-3.5" strokeWidth={2} fill="currentColor" />
                            <span>Connects</span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight">Buy Connects</h1>
                        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                            Use Connects to apply for projects and collaborate with clients. No subscriptions. No monthly fees. Connects never expire.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Packages */}
            <section className="container mx-auto px-6 py-16">
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
                                    ? "border-[hsl(var(--accent))] shadow-[0_0_30px_hsl(var(--accent)/0.12)] bg-card"
                                    : "border-border bg-card hover:border-[hsl(var(--accent)/0.4)] hover:shadow-lg"
                            )}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-[hsl(var(--accent))] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{pkg.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <Zap className="h-5 w-5 text-[hsl(var(--accent))] mb-0.5" strokeWidth={1.5} fill="currentColor" />
                                    <span className="text-5xl font-bold tracking-tight">{pkg.connects}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{pkg.desc}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-3xl font-bold">${pkg.price}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">one-time · no expiry</p>
                            </div>

                            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                                {[
                                    "Never expire",
                                    "Instant delivery",
                                    "Secure payment",
                                ].map(f => (
                                    <div key={f} className="flex items-center gap-2">
                                        <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--accent))] flex-shrink-0" strokeWidth={2} />
                                        {f}
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
                                            className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 text-center"
                                        >
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" strokeWidth={2} />
                                            <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                                                {pkg.connects} Connects added!
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="btn" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            {isAuthenticated ? (
                                                <Button
                                                    className={cn("w-full gap-2", pkg.popular ? "" : "variant-outline")}
                                                    variant={pkg.popular ? "default" : "outline"}
                                                    onClick={() => handleBuy(pkg.id)}
                                                    disabled={purchasing !== null}
                                                >
                                                    {purchasing === pkg.id ? (
                                                        <>
                                                            <div className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                                            Processing…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                            Buy for ${pkg.price}
                                                        </>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Link to="/login">
                                                    <Button variant="outline" className="w-full gap-2">
                                                        Log in to Buy <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
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
                    className="mt-16 max-w-2xl mx-auto border border-border rounded-2xl p-8 bg-card space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-[hsl(var(--accent))]" strokeWidth={1.5} />
                        <h2 className="font-semibold text-lg">How Connects Work</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                        {[
                            { label: "Small Projects", connects: "2 Connects", desc: "Quick shoots and short-term tasks" },
                            { label: "Medium Projects", connects: "4 Connects", desc: "Multi-day or editorial shoots" },
                            { label: "Large Projects", connects: "6–8 Connects", desc: "Full campaigns and complex work" },
                        ].map(({ label, connects, desc }) => (
                            <div key={label} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-3.5 w-3.5 text-[hsl(var(--accent))]" strokeWidth={2} fill="currentColor" />
                                    <span className="font-bold text-sm">{connects}</span>
                                </div>
                                <p className="font-medium text-sm">{label}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Transparency first:</strong> Every job shows exactly how many Connects it requires before you apply. No surprises, no hidden costs.
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
