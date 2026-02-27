import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, ArrowLeft, Clock } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";

function formatTime(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function Messages() {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { getMyConversations, getMessages, sendMessage, markRead } = useChat();

    const [draft, setDraft] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const conversations = getMyConversations();
    const activeConv = conversations.find(c => c.id === conversationId);
    const msgs = activeConv ? getMessages(activeConv.id) : [];

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [msgs.length]);

    // Mark as read when opening a conversation
    useEffect(() => {
        if (conversationId) markRead(conversationId);
    }, [conversationId, markRead]);

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <p className="text-lg font-medium">Please log in to view messages</p>
                <Link to="/login"><Button>Log In</Button></Link>
            </div>
        );
    }

    const handleSend = () => {
        if (!draft.trim() || !conversationId) return;
        sendMessage(conversationId, draft);
        setDraft('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Mobile: show thread if conversationId present, else show list
    const showList = !conversationId;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-5xl">
                <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] md:rounded-2xl border overflow-hidden shadow-sm">

                    {/* ── Conversation List ─────────────────────────────── */}
                    <div className={`${showList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r bg-card flex-shrink-0`}>
                        <div className="p-4 border-b">
                            <h1 className="font-serif text-xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" strokeWidth={2} />
                                Messages
                            </h1>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 text-muted-foreground">
                                    <MessageSquare className="h-10 w-10 opacity-20" strokeWidth={1.5} />
                                    <p className="text-sm font-medium">No conversations yet</p>
                                    <p className="text-xs">When a client accepts your proposal, a chat will open here.</p>
                                </div>
                            ) : (
                                <ul>
                                    {conversations.map(conv => {
                                        const isActive = conv.id === conversationId;
                                        const isMe = user.role === 'client';
                                        const otherName = isMe ? conv.photographerName : conv.clientName;

                                        return (
                                            <li key={conv.id}>
                                                <button
                                                    onClick={() => navigate(`/messages/${conv.id}`)}
                                                    className={`w-full text-left px-4 py-3.5 border-b last:border-b-0 hover:bg-accent/50 transition-colors
                                                        ${isActive ? 'bg-accent' : ''}`}
                                                >
                                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                                        <p className="text-sm font-semibold truncate">{otherName}</p>
                                                        {conv.lastMessageAt && (
                                                            <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">
                                                                {formatTime(conv.lastMessageAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">{conv.jobTitle}</p>
                                                    {conv.lastMessage && (
                                                        <p className="text-xs text-muted-foreground truncate mt-0.5 italic">
                                                            {conv.lastMessage}
                                                        </p>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* ── Chat Thread ────────────────────────────────────── */}
                    <div className={`${!showList ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-background`}>
                        {activeConv ? (
                            <>
                                {/* Thread Header */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b bg-card">
                                    <button
                                        onClick={() => navigate('/messages')}
                                        className="md:hidden p-1 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {user.role === 'client' ? activeConv.photographerName : activeConv.clientName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{activeConv.jobTitle}</p>
                                    </div>
                                    <Link
                                        to={`/jobs/${activeConv.jobId}`}
                                        className="text-xs text-primary hover:underline flex-shrink-0"
                                    >
                                        View Job →
                                    </Link>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {msgs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                            <Clock className="h-8 w-8 opacity-20" strokeWidth={1.5} />
                                            <p className="text-sm">No messages yet. Say hello!</p>
                                        </div>
                                    ) : (
                                        <AnimatePresence initial={false}>
                                            {msgs.map(msg => {
                                                const isOwn = msg.senderId === user.id;
                                                return (
                                                    <motion.div
                                                        key={msg.id}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm
                                                            ${isOwn
                                                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                                : 'bg-muted text-foreground rounded-bl-sm'
                                                            }`}>
                                                            <p className="leading-relaxed">{msg.text}</p>
                                                            <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground'}`}>
                                                                {formatTime(msg.createdAt)}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <div className="border-t p-3 bg-card">
                                    <div className="flex items-end gap-2">
                                        <textarea
                                            ref={inputRef}
                                            value={draft}
                                            onChange={e => setDraft(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type a message… (Enter to send)"
                                            rows={1}
                                            className="flex-1 resize-none px-3.5 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-32 overflow-y-auto"
                                            style={{ minHeight: '42px' }}
                                        />
                                        <Button
                                            size="icon"
                                            onClick={handleSend}
                                            disabled={!draft.trim()}
                                            className="h-10 w-10 rounded-xl flex-shrink-0"
                                        >
                                            <Send className="h-4 w-4" strokeWidth={2} />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                <MessageSquare className="h-12 w-12 opacity-20" strokeWidth={1.5} />
                                <p className="text-base font-medium">Select a conversation</p>
                                <p className="text-sm text-center max-w-xs">Choose a conversation from the left to start chatting.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
