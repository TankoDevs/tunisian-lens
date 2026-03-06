import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";

interface CinematicViewerProps {
    images: string[];
    initialIndex?: number;
    title?: string;
    onClose: () => void;
}

export function CinematicViewer({ images, initialIndex = 0, title, onClose }: CinematicViewerProps) {
    const [current, setCurrent] = useState(initialIndex);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const DURATION = 5000; // ms per slide

    const prev = useCallback(() => {
        setDirection(-1);
        setCurrent(i => (i - 1 + images.length) % images.length);
        setProgress(0);
    }, [images.length]);

    const next = useCallback(() => {
        setDirection(1);
        setCurrent(i => (i + 1) % images.length);
        setProgress(0);
    }, [images.length]);

    const goTo = useCallback((idx: number) => {
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
        setProgress(0);
    }, [current]);

    // Keyboard nav
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === " ") { e.preventDefault(); setPaused(p => !p); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, prev, next]);

    // Progress bar ticker
    useEffect(() => {
        if (paused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        setProgress(0);
        const tickMs = 50;
        intervalRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    next();
                    return 0;
                }
                return p + (tickMs / DURATION) * 100;
            });
        }, tickMs);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [current, paused, next]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const variants = {
        enter: (d: number) => ({ x: d > 0 ? "6%" : "-6%", opacity: 0, scale: 1.03 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d: number) => ({ x: d > 0 ? "-6%" : "6%", opacity: 0, scale: 0.97 }),
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            onClick={onClose}
        >
            {/* ── Progress bar ── */}
            <div className="absolute top-0 inset-x-0 z-20 h-[2px] bg-white/10">
                <motion.div
                    className="h-full bg-[hsl(var(--accent))]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>

            {/* ── Main image ── */}
            <AnimatePresence custom={direction} mode="wait">
                <motion.img
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                    src={images[current]}
                    alt={`Portfolio ${current + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                    loading="lazy"
                />
            </AnimatePresence>

            {/* ── Gradient overlays ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/90 to-transparent" />
            </div>

            {/* ── Top bar ── */}
            <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-5 z-20">
                <div className="flex items-center gap-3">
                    <Maximize2 className="h-3.5 w-3.5 text-white/40" strokeWidth={1.5} />
                    <span className="text-white/60 text-xs font-semibold uppercase tracking-[0.18em]">
                        Cinematic View
                    </span>
                    {title && (
                        <span className="text-white/40 text-xs hidden sm:inline">· {title}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Pause/Play */}
                    <button
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        onClick={(e) => { e.stopPropagation(); setPaused(p => !p); }}
                        title={paused ? "Resume" : "Pause"}
                    >
                        {paused
                            ? <Play className="h-3.5 w-3.5 text-white" strokeWidth={2} fill="currentColor" />
                            : <Pause className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                        }
                    </button>
                    {/* Close */}
                    <button
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                    >
                        <X className="h-4 w-4 text-white" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* ── Prev / Next ── */}
            <button
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all duration-200 hover:scale-110"
                onClick={(e) => { e.stopPropagation(); prev(); }}
            >
                <ChevronLeft className="h-5 w-5 text-white" strokeWidth={1.5} />
            </button>
            <button
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all duration-200 hover:scale-110"
                onClick={(e) => { e.stopPropagation(); next(); }}
            >
                <ChevronRight className="h-5 w-5 text-white" strokeWidth={1.5} />
            </button>

            {/* ── Bottom: counter + dots + thumbnail strip ── */}
            <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center gap-3 pb-6 px-6">
                {/* Counter */}
                <p className="text-white/40 text-[10px] tracking-widest uppercase font-medium">
                    {current + 1} / {images.length}
                </p>

                {/* Dot indicators */}
                <div className="flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); goTo(i); }}
                            className={`h-[3px] rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/50"}`}
                        />
                    ))}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-md mt-1" onClick={e => e.stopPropagation()}>
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`flex-shrink-0 w-12 h-9 rounded overflow-hidden transition-all duration-200 ${i === current
                                        ? "ring-2 ring-[hsl(var(--accent))] opacity-100 scale-110"
                                        : "opacity-50 hover:opacity-80"
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
