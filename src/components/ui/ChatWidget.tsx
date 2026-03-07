import { MessageSquare, X, ExternalLink } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export function ChatWidget() {
    const { user, isAuthenticated } = useAuth();
    const { unreadCount, getMyConversations } = useChat();
    const [isOpen, setIsOpen] = useState(false);

    if (!isAuthenticated || !user) return null;

    const myConversations = getMyConversations();

    return (
        <div className="hidden md:block fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Messages</h3>
                            <div className="flex items-center gap-2">
                                <Link to="/messages" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Mini List */}
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {myConversations.length > 0 ? (
                                myConversations.slice(0, 5).map(conv => {
                                    const isClient = conv.clientId === user.id;
                                    const otherName = isClient ? conv.creativeName : conv.clientName;
                                    // Basic avatar fallback using name initial
                                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&background=random&color=fff`;

                                    return (
                                        <Link
                                            key={conv.id}
                                            to={`/messages/${conv.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b border-border last:border-0"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <img src={avatarUrl} className="w-10 h-10 rounded-full object-cover border border-border" alt="" />
                                                {/* Simple unread visual - if last message isn't from us and no global check yet, we just show a dot if it has a last message at least */}
                                                {conv.lastMessage && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--accent))] rounded-full ring-2 ring-card" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold truncate">{otherName}</p>
                                                <p className="text-[10px] text-muted-foreground truncate italic">{conv.jobTitle}</p>
                                                <p className="text-[10px] text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-xs">
                                    No messages yet.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <Link
                            to="/messages"
                            onClick={() => setIsOpen(false)}
                            className="p-3 text-center text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--accent))] hover:bg-muted transition-colors border-t border-border"
                        >
                            View All Messages
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-12 h-12 rounded-xl shadow-xl flex items-center justify-center relative transition-colors bg-background border border-border",
                    isOpen ? "bg-muted text-foreground" : "text-foreground hover:bg-muted"
                )}
            >
                <MessageSquare className="h-6 w-6" strokeWidth={1.5} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-[hsl(var(--accent))] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </motion.button>
        </div>
    );
}
