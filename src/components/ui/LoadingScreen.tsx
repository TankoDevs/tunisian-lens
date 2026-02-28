import { motion } from "framer-motion";

interface LoadingScreenProps {
    onFinished?: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            onAnimationComplete={(definition) => {
                if (definition === "exit" && onFinished) {
                    onFinished();
                }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A]"
        >
            {/* Warm sand line animation */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="h-[1.5px] bg-[#C8A97E] mb-8"
            />

            {/* Brand wordmark */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                className="font-serif text-2xl md:text-3xl text-white/90 tracking-tight font-bold"
            >
                Tunisian Lens
            </motion.h1>

            {/* Tagline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-white/30 text-xs tracking-[0.3em] uppercase mt-3"
            >
                Where vision meets opportunity
            </motion.p>
        </motion.div>
    );
}
