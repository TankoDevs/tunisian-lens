import { motion } from "framer-motion";

interface LoadingScreenProps {
    onFinished?: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={(definition) => {
                if (definition === "exit" && onFinished) {
                    onFinished();
                }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas"
        >
            {/* Ochre line animation */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 56 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="h-[2px] bg-ochre mb-8 rounded-full shadow-lg shadow-ochre/20"
            />

            {/* Brand wordmark */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                className="font-serif text-3xl md:text-4xl text-alabaster tracking-tight font-normal"
            >
                Tunisian Lens
            </motion.h1>

            {/* Tagline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-mist/70 text-xs tracking-[0.25em] uppercase mt-3 font-sans"
            >
                Archival Visual Platform · Tunis
            </motion.p>
        </motion.div>
    );
}
