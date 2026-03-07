import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const PROXIMITY_THRESHOLD = 150; // px from top/bottom before button slides away

export function ScrollButton() {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [visible, setVisible] = useState(false);
    const [nearTarget, setNearTarget] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            const pageIsTall = docHeight > windowHeight + 100;
            setVisible(pageIsTall);

            const atBottom = scrollTop + windowHeight >= docHeight - 100;
            setIsAtBottom(atBottom);

            if (!pageIsTall) return;

            if (atBottom) {
                // pointing up → near target when close to the very top
                setNearTarget(scrollTop <= PROXIMITY_THRESHOLD);
            } else {
                // pointing down → near target when close to the very bottom
                setNearTarget(docHeight - (scrollTop + windowHeight) <= PROXIMITY_THRESHOLD);
            }
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const handleClick = () => {
        if (isAtBottom) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, x: 80 }}
                    exit={{ opacity: 0, x: 80 }}
                    animate={
                        nearTarget
                            ? { opacity: 0, x: 80 }   // slide off-screen right + gone
                            : { opacity: 1, x: 0 }    // visible in place
                    }
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    onClick={handleClick}
                    className={cn(
                        "fixed right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#C8A97E] text-white shadow-lg",
                        "bottom-24 md:bottom-24" // Moved higher to avoid overlapping with Post Job (bottom-6)
                    )}
                    aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
                >
                    <motion.div
                        key={isAtBottom ? "up" : "down"}
                        initial={{ rotate: isAtBottom ? 180 : -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: isAtBottom ? -180 : 180, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {isAtBottom
                            ? <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
                            : <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
                        }
                    </motion.div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
