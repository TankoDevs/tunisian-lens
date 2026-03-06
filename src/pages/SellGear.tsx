import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, CheckCircle2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GEAR_CATEGORIES, GEAR_BRANDS, CITIES } from "../data/mockData";
import type { GearCondition } from "../data/mockData";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const CONDITIONS: { value: GearCondition; label: string; desc: string }[] = [
    { value: "New", label: "New", desc: "Sealed or never used" },
    { value: "Like New", label: "Like New", desc: "Used briefly, no marks" },
    { value: "Used", label: "Used", desc: "Shows normal wear" },
];

// Placeholder preview images for the upload demo
const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=70",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=70",
    "https://images.unsplash.com/photo-1617450365226-9bf28c04e130?w=400&q=70",
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=70",
];

export function SellGear() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState<GearCondition | ''>('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // In a real app this would handle actual file uploads.
    // For the demo, we simulate upload with placeholder images.
    const handleFileChange = () => {
        const count = Math.min(4 - previewImages.length, 2);
        if (count <= 0) return;
        const newImages = PLACEHOLDER_IMAGES.slice(previewImages.length, previewImages.length + count);
        setPreviewImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (idx: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== idx));
    };

    const isValid = title && category && brand && price && condition && location && description && previewImages.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1200));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-center max-w-md"
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Listing Published!</h2>
                    <p className="text-muted-foreground text-sm mb-2">
                        <strong className="text-foreground">{title}</strong> has been listed on the Gear Market.
                    </p>
                    <p className="text-muted-foreground text-sm mb-8">
                        Interested buyers will be able to contact you directly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/gear">
                            <Button className="w-full sm:w-auto">Browse Gear Market</Button>
                        </Link>
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                            setSubmitted(false);
                            setTitle(''); setCategory(''); setBrand(''); setPrice('');
                            setCondition(''); setLocation(''); setDescription('');
                            setPreviewImages([]);
                        }}>
                            List Another Item
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-background">
                <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
                    <button
                        onClick={() => navigate('/gear')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                        Back to Gear Market
                    </button>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-2">Gear Market</p>
                    <h1 className="font-sans text-3xl md:text-4xl font-bold tracking-tight mb-2">Sell Your Gear</h1>
                    <p className="text-muted-foreground text-sm max-w-xl">
                        List your photography or videography equipment and reach thousands of creatives across Tunisia and beyond.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">

                    {/* ── Photo Upload ── */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Photos</h2>
                            <span className="text-xs text-muted-foreground">{previewImages.length}/4 photos</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {previewImages.map((src, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted group border border-border">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3.5 w-3.5 text-white" />
                                    </button>
                                    {i === 0 && (
                                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase bg-black/60 text-white px-1.5 py-0.5 rounded">Cover</span>
                                    )}
                                </div>
                            ))}

                            {previewImages.length < 4 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-[hsl(var(--accent))/50] bg-muted/30 hover:bg-muted/60 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Upload className="h-5 w-5" strokeWidth={1.5} />
                                    <span className="text-[10px] font-medium">Add Photo</span>
                                </button>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {previewImages.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                Add at least 1 photo. Good photos get more inquiries.
                            </p>
                        )}
                    </section>

                    {/* ── Listing Info ── */}
                    <section className="space-y-5">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Listing Details</h2>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Sony A7 IV Mirrorless Camera Body"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                maxLength={80}
                                className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60 transition-all"
                            />
                        </div>

                        {/* Category + Brand */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/50] text-muted-foreground cursor-pointer transition-all"
                                >
                                    <option value="">Select category</option>
                                    {GEAR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Brand <span className="text-red-500">*</span></label>
                                <select
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/50] text-muted-foreground cursor-pointer transition-all"
                                >
                                    <option value="">Select brand</option>
                                    {GEAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Price + Location */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price (USD) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">$</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        min="1"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        className="w-full h-11 pl-8 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location <span className="text-red-500">*</span></label>
                                <select
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/50] text-muted-foreground cursor-pointer transition-all"
                                >
                                    <option value="">Select city</option>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Condition <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-3 gap-3">
                                {CONDITIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setCondition(opt.value)}
                                        className={cn(
                                            "flex flex-col gap-0.5 p-4 rounded-xl border text-left transition-all duration-200",
                                            condition === opt.value
                                                ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))/5] ring-1 ring-[hsl(var(--accent))/30]"
                                                : "border-border hover:bg-muted"
                                        )}
                                    >
                                        <span className="text-sm font-semibold">{opt.label}</span>
                                        <span className="text-[10px] text-muted-foreground leading-tight">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="Describe the item, its condition, what's included, reason for selling…"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/50] placeholder:text-muted-foreground/60 transition-all resize-none"
                            />
                            <p className="text-xs text-muted-foreground text-right">{description.length} characters</p>
                        </div>
                    </section>

                    {/* ── Submit ── */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-12">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="flex-1 h-12 text-base font-semibold gap-2"
                        >
                            <AnimatePresence mode="wait">
                                {isSubmitting ? (
                                    <motion.span
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Publishing…
                                    </motion.span>
                                ) : (
                                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        <Camera className="h-4 w-4" strokeWidth={1.8} />
                                        Publish Listing
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                        <Button type="button" variant="outline" className="h-12 px-6" onClick={() => navigate('/gear')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
