import { Outlet, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { GlobalAlert } from "../components/ui/GlobalAlert";
import { ScrollButton } from "../components/ui/ScrollButton";
import { ChatWidget } from "../components/ui/ChatWidget";
import { MessageSquare, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { motion } from "framer-motion";

export function MainLayout() {
    const { isAuthenticated } = useAuth();
    const { unreadCount } = useChat();
    return (
        <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
            <GlobalAlert />
            <Navbar />
            <main className="flex-1">
                <Outlet />
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
                            className="w-14 h-14 bg-background border border-border rounded-full shadow-2xl flex items-center justify-center relative text-foreground"
                        >
                            <MessageSquare className="h-6 w-6" strokeWidth={1.5} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-sand-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
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
                        className="h-14 px-6 bg-[hsl(var(--accent))] text-white rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm"
                    >
                        <Plus className="h-5 w-5" strokeWidth={2.5} />
                        Post Job
                    </motion.button>
                </Link>
            </div>
        </div>
    );
}
