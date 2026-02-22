import { motion } from "framer-motion";
import { Camera } from "lucide-react";

interface LoadingScreenProps {
    onFinished?: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={(definition) => {
                if (definition === "exit" && onFinished) {
                    onFinished();
                }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="text-white"
            >
                <Camera size={64} strokeWidth={1.5} />
            </motion.div>
        </motion.div>
    );
}
