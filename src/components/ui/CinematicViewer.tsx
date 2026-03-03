import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface CinematicViewerProps {
    images: string[];
    initialIndex?: number;
    title?: string;
    onClose: () => void;
}

export function CinematicViewer({ images, initialIndex = 0, title, onClose }: CinematicViewerProps) {
    const [current, setCurrent] = useState(initialIndex);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [audioEnabled, setAudioEnabled] = useState(false);

    const prev = useCallback(() => {
        setDirection(-1);
        setCurrent(i => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const next = useCallback(() => {
        setDirection(1);
        setCurrent(i => (i + 1) % images.length);
    }, [images.length]);

    // Keyboard nav
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, prev, next]);

    // Auto-advance every 4s when not actively navigating
    useEffect(() => {
        const t = setTimeout(next, 4000);
        return () => clearTimeout(t);
    }, [current, next]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const variants = {
        enter: (d: number) => ({ x: d > 0 ? "8%" : "-8%", opacity: 0, scale: 1.04 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d: number) => ({ x: d > 0 ? "-8%" : "8%", opacity: 0, scale: 0.97 }),
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            onClick={onClose}
        >
            {/* Image */}
            <AnimatePresence custom={direction} mode="wait">
                <motion.img
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    src={images[current]}
                    alt={`Portfolio ${current + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                />
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Top bar */}
            <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-5 z-10">
                <div className="flex items-center gap-3">
                    <span className="text-white/60 text-xs font-semibold uppercase tracking-[0.18em]">
                        Cinematic View
                    </span>
                    {title && (
                        <span className="text-white/40 text-xs">· {title}</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* Audio toggle (visual only) */}
                    <button
                        className="text-white/40 hover:text-white/80 text-xs transition-colors"
                        onClick={(e) => { e.stopPropagation(); setAudioEnabled(a => !a); }}
                        title="Ambient sound (coming soon)"
                    >
                        {audioEnabled ? "♫ On" : "♫ Off"}
                    </button>
                    <button
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                    >
                        <X className="h-4 w-4 text-white" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Prev / Next */}
            <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                onClick={(e) => { e.stopPropagation(); prev(); }}
            >
                <ChevronLeft className="h-5 w-5 text-white" strokeWidth={1.5} />
            </button>
            <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                onClick={(e) => { e.stopPropagation(); next(); }}
            >
                <ChevronRight className="h-5 w-5 text-white" strokeWidth={1.5} />
            </button>

            {/* Bottom: dots + counter */}
            <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4 z-10">
                <div className="flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setDirection(i > current ? 1 : -1); setCurrent(i); }}
                            className={`h-[3px] rounded-full transition-all duration-400 ${i === current ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/50"}`}
                        />
                    ))}
                </div>
                <p className="text-white/30 text-[10px] tracking-widest uppercase">
                    {current + 1} / {images.length}
                </p>
            </div>
        </motion.div>
    );
}
