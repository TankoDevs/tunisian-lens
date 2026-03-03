import { useState, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";

interface BeforeAfterSliderProps {
    before: string;
    after: string;
    label?: string;
    className?: string;
}

export function BeforeAfterSlider({ before, after, label, className }: BeforeAfterSliderProps) {
    const [position, setPosition] = useState(50); // percentage
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const updatePosition = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(95, Math.max(5, pct)));
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        updatePosition(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        updatePosition(e.touches[0].clientX);
    };

    return (
        <div className={cn("relative overflow-hidden rounded-xl select-none", className)}>
            {/* After image (underneath, full width) */}
            <img
                src={after}
                alt="After"
                className="w-full h-full object-cover"
                draggable={false}
            />

            {/* Before image (clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
                <img
                    src={before}
                    alt="Before"
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white bg-black/40 px-2 py-0.5 rounded-full pointer-events-none">
                Before
            </div>
            <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-white bg-black/40 px-2 py-0.5 rounded-full pointer-events-none">
                After
            </div>

            {/* Divider line */}
            <div
                className="absolute top-0 bottom-0 w-[2px] bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.5)] pointer-events-none"
                style={{ left: `calc(${position}% - 1px)` }}
            />

            {/* Drag handle */}
            <div
                ref={containerRef}
                className="absolute inset-0 cursor-ew-resize"
                onMouseDown={(e) => { isDragging.current = true; updatePosition(e.clientX); }}
                onMouseMove={handleMouseMove}
                onMouseUp={() => { isDragging.current = false; }}
                onMouseLeave={() => { isDragging.current = false; }}
                onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
                onTouchMove={handleTouchMove}
            >
                {/* Handle circle */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-none"
                    style={{ left: `${position}%` }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5 4L1 8L5 12M11 4L15 8L11 12" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Optional label */}
            {label && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white/70 bg-black/40 px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
                    {label}
                </div>
            )}
        </div>
    );
}
