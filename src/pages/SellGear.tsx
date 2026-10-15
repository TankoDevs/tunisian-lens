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
        <div className="min-h-screen bg-canvas text-alabaster">
            {/* Header */}
            <div className="border-b border-edge bg-surface/40 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
                    <button
                        onClick={() => navigate('/gear')}
                        className="flex items-center gap-2 text-mist hover:text-ochre transition-colors text-xs font-semibold uppercase tracking-wider mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                        Back to Gear Exchange
                    </button>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ochre mb-2">Equipment Provenance</p>
                    <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-alabaster mb-2">List Photographic Equipment</h1>
                    <p className="text-mist text-sm max-w-xl leading-relaxed">
                        Circulate bodies, optics, and studio lighting to fellow working creatives across Tunisia.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-10">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">

                    {/* ── Photo Upload ── */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-ochre">Hardware Imagery</h2>
                            <span className="text-xs font-mono text-mist">{previewImages.length}/4 captures</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {previewImages.map((src, i) => (
                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-surface.elevated group border border-edge">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-canvas/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-edge"
                                    >
                                        <X className="h-3.5 w-3.5 text-alabaster" />
                                    </button>
                                    {i === 0 && (
                                        <span className="absolute bottom-2 left-2 text-[9px] font-semibold uppercase tracking-wider bg-canvas/90 text-ochre px-2 py-0.5 rounded-md border border-edge">Hero</span>
                                    )}
                                </div>
                            ))}

                            {previewImages.length < 4 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-edge hover:border-ochre/50 bg-surface hover:bg-surface.elevated transition-all duration-200 flex flex-col items-center justify-center gap-2 text-mist hover:text-alabaster"
                                >
                                    <Upload className="h-5 w-5 text-ochre" strokeWidth={1.5} />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider">Add Capture</span>
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
                            <p className="text-xs text-mist">
                                Provide at least 1 crisp photo showing optical elements, serial labels, or mount condition.
                            </p>
                        )}
                    </section>

                    {/* ── Listing Info ── */}
                    <section className="space-y-5">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-ochre">Specification &amp; Model</h2>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Equipment Title <span className="text-ochre">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Sony FE 24-70mm f/2.8 GM II Lens"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                maxLength={80}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-sm text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40 transition-all"
                            />
                        </div>

                        {/* Category + Brand */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-mist">Category <span className="text-ochre">*</span></label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre cursor-pointer transition-all"
                                >
                                    <option value="">Select category</option>
                                    {GEAR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-mist">Brand / System <span className="text-ochre">*</span></label>
                                <select
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre cursor-pointer transition-all"
                                >
                                    <option value="">Select brand</option>
                                    {GEAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Price + Location */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-mist">Asking Price (USD) <span className="text-ochre">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mist font-mono text-sm">$</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        min="1"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        className="w-full h-11 pl-8 pr-4 rounded-xl border border-edge bg-surface text-sm text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-mist">Governorate Location <span className="text-ochre">*</span></label>
                                <select
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre cursor-pointer transition-all"
                                >
                                    <option value="">Select region</option>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Appraised Condition <span className="text-ochre">*</span></label>
                            <div className="grid grid-cols-3 gap-3">
                                {CONDITIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setCondition(opt.value)}
                                        className={cn(
                                            "flex flex-col gap-1 p-4 rounded-xl border text-left transition-all duration-200",
                                            condition === opt.value
                                                ? "border-ochre bg-ochre/10 text-ochre shadow-sm"
                                                : "border-edge bg-surface hover:bg-surface.elevated text-mist"
                                        )}
                                    >
                                        <span className="text-xs font-semibold uppercase tracking-wider text-alabaster">{opt.label}</span>
                                        <span className="text-[10px] text-mist leading-tight">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-mist">Technical Summary &amp; Accessories Included <span className="text-ochre">*</span></label>
                            <textarea
                                placeholder="Detail shutter count, sensor cleanliness, included lens caps, original packaging, and receipt provenance..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-edge bg-surface text-xs text-alabaster focus:outline-none focus:border-ochre placeholder:text-mist/40 transition-all resize-none"
                            />
                            <p className="text-[10px] font-mono text-mist/60 text-right">{description.length} characters</p>
                        </div>
                    </section>

                    {/* ── Submit ── */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-12">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="flex-1 h-12 text-sm font-semibold gap-2 bg-ochre hover:bg-ochre/90 text-canvas border-none rounded-xl"
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
                                        <span className="w-4 h-4 border-2 border-canvas/30 border-t-canvas rounded-full animate-spin" />
                                        Publishing to Catalog…
                                    </motion.span>
                                ) : (
                                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        <Camera className="h-4 w-4" strokeWidth={1.8} />
                                        Publish to Gear Exchange
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                        <Button type="button" variant="outline" className="h-12 px-6 border-edge text-alabaster hover:bg-surface.elevated rounded-xl" onClick={() => navigate('/gear')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
