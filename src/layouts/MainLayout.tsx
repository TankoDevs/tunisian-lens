import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { GlobalAlert } from "../components/ui/GlobalAlert";
import { ScrollButton } from "../components/ui/ScrollButton";
import { ChatWidget } from "../components/ui/ChatWidget";
import { MessageSquare, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

export function MainLayout() {
    const { isAuthenticated } = useAuth();
    const { unreadCount } = useChat();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col font-sans text-alabaster bg-canvas selection:bg-ochre/25 selection:text-alabaster relative">
            <div className="noise-overlay" aria-hidden="true" />
            <GlobalAlert />
            <Navbar />
            <main className="flex-1 flex flex-col">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 flex flex-col"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <ScrollButton />
            <ChatWidget />

            {/* Mobile Floating Action Buttons */}
            <div className="md:hidden">
                {/* Messages Floating Badge */}
                {isAuthenticated && (
                    <Link
                        to="/messages"
                        className="fixed bottom-6 left-6 z-40"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-13 h-13 bg-surface border border-edge rounded-full shadow-2xl flex items-center justify-center relative text-alabaster backdrop-blur-xl"
                        >
                            <MessageSquare className="h-5 w-5 text-ochre" strokeWidth={1.6} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-ochre text-canvas text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-canvas">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </motion.button>
                    </Link>
                )}

                {/* Post Job / Main CTA */}
                <Link
                    to="/jobs/post"
                    className="fixed bottom-6 right-6 z-40"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-12 px-5 bg-ochre hover:bg-ochre-light text-canvas rounded-full shadow-2xl flex items-center gap-2 font-semibold text-xs uppercase tracking-wider"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Commission
                    </motion.button>
                </Link>
            </div>
        </div>
    );
}
