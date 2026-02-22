import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight, Camera, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface CaptchaProps {
    onVerify: (verified: boolean) => void;
    className?: string;
}

export function Captcha({ onVerify, className }: CaptchaProps) {
    const [isVerified, setIsVerified] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    // Width of the handle is 50px (h-12 w-12 approx)
    // We calculate the drag range based on container width
    const [dragRange, setDragRange] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setDragRange(containerRef.current.offsetWidth - 52); // 50px handle + 2px padding
        }
    }, []);

    const opacity = useTransform(x, [0, dragRange * 0.8], [1, 0]);

    const handleDragEnd = () => {
        if (x.get() >= dragRange - 5) {
            setIsVerified(true);
            onVerify(true);
        } else {
            x.set(0);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative h-14 w-full bg-muted/30 rounded-full p-1 overflow-hidden border border-border shadow-inner flex items-center transition-all duration-300",
                isVerified && "bg-green-500/10 border-green-500/20",
                className
            )}
        >
            {/* Background text */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 flex items-center justify-center text-sm font-medium text-muted-foreground select-none pointer-events-none"
            >
                Slide to Verify
            </motion.div>

            {/* Success message */}
            <AnimatePresence>
                {isVerified && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-green-600 select-none pointer-events-none gap-2"
                    >
                        <Check className="h-4 w-4" strokeWidth={3} />
                        Verified
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Draggable handle */}
            {!isVerified && (
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: dragRange }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    style={{ x }}
                    className="z-10 h-12 w-12 bg-background border border-border rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-transform"
                >
                    <div className="relative">
                        <Camera className="h-5 w-5 text-foreground opacity-20" strokeWidth={2} />
                        <ChevronRight className="absolute inset-0 h-5 w-5 text-primary animate-pulse" strokeWidth={2.5} />
                    </div>
                </motion.div>
            )}

            {/* Progress Bar background */}
            {!isVerified && (
                <motion.div
                    style={{ width: x }}
                    className="absolute left-0 h-full bg-primary/10 transition-colors pointer-events-none"
                />
            )}
        </div>
    );
}


