import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollButton() {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Show button after scrolling a tiny bit, or always if page is long enough
            setVisible(docHeight > windowHeight + 100);

            // Consider "at bottom" when within 100px of the bottom
            setIsAtBottom(scrollTop + windowHeight >= docHeight - 100);
        };

        handleScroll(); // initial check
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onClick={handleClick}
                    className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#C8A97E] text-white shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-[#b89868] active:scale-95 md:h-12 md:w-12"
                    aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
                >
                    <motion.div
                        key={isAtBottom ? "up" : "down"}
                        initial={{ rotate: isAtBottom ? 180 : -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: isAtBottom ? -180 : 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isAtBottom ? (
                            <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
                        ) : (
                            <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
                        )}
                    </motion.div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
