import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ProfileAvatarProps {
    src: string;
    alt: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function ProfileAvatar({ src, alt, className, size = "md" }: ProfileAvatarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-20 h-20 md:w-24 md:h-24",
        xl: "w-32 h-32 md:w-40 md:h-40"
    };

    return (
        <>
            <div
                className={cn(
                    "relative cursor-pointer overflow-hidden rounded-full transition-transform hover:scale-105 active:scale-95 ring-offset-2 ring-offset-background hover:ring-2 hover:ring-sand-400/50",
                    sizeClasses[size],
                    className
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsOpen(true);
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                        >
                            <X className="h-6 w-6" />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-[90vw] max-h-[80vh] aspect-square"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={src}
                                alt={alt}
                                className="h-full w-full object-cover rounded-3xl shadow-2xl ring-4 ring-white/10"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
