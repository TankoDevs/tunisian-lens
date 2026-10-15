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
        <div className="min-h-screen bg-canvas text-alabaster">
            <div className="container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-5xl">
                <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] md:rounded-2xl border border-edge overflow-hidden shadow-2xl bg-surface">

                    {/* ── Conversation List ─────────────────────────────── */}
                    <div className={`${showList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r border-edge bg-surface flex-shrink-0`}>
                        <div className="p-4 border-b border-edge">
                            <h1 className="font-serif text-lg font-normal text-alabaster flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-ochre" strokeWidth={1.5} />
                                Encrypted Dispatches
                            </h1>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 text-mist">
                                    <MessageSquare className="h-10 w-10 opacity-20 text-ochre" strokeWidth={1.5} />
                                    <p className="text-sm font-medium text-alabaster">No active dispatches</p>
                                    <p className="text-xs">When a client reviews your treatment, a secure direct channel initiates here.</p>
                                </div>
                            ) : (
                                <ul>
                                    {conversations.map(conv => {
                                        const isActive = conv.id === conversationId;
                                        const isMe = user.role === 'client';
                                        const otherName = isMe ? conv.creativeName : conv.clientName;

                                        return (
                                            <li key={conv.id}>
                                                <button
                                                    onClick={() => navigate(`/messages/${conv.id}`)}
                                                    className={`w-full text-left px-4 py-3.5 border-b border-edge last:border-b-0 hover:bg-surface.elevated transition-colors
                                                        ${isActive ? 'bg-surface.elevated border-l-2 border-l-ochre' : ''}`}
                                                >
                                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                                        <p className="text-xs font-semibold text-alabaster truncate">{otherName}</p>
                                                        {conv.lastMessageAt && (
                                                            <span className="text-[10px] font-mono text-mist/60 flex-shrink-0 mt-0.5">
                                                                {formatTime(conv.lastMessageAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-ochre truncate">{conv.jobTitle}</p>
                                                    {conv.lastMessage && (
                                                        <p className="text-[11px] text-mist truncate mt-0.5 italic">
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
                    <div className={`${!showList ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-canvas`}>
                        {activeConv ? (
                            <>
                                {/* Thread Header */}
                                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-edge bg-surface">
                                    <button
                                        onClick={() => navigate('/messages')}
                                        className="md:hidden p-1 rounded-lg hover:bg-surface.elevated text-mist transition-colors"
                                    >
                                        <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-alabaster truncate">
                                            {user.role === 'client' ? activeConv.creativeName : activeConv.clientName}
                                        </p>
                                        <p className="text-[11px] text-ochre truncate">{activeConv.jobTitle}</p>
                                    </div>
                                    <Link
                                        to={`/jobs/${activeConv.jobId}`}
                                        className="text-xs text-mist hover:text-ochre transition-colors flex-shrink-0 uppercase tracking-wider font-semibold"
                                    >
                                        Inspect Brief →
                                    </Link>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                                    {msgs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-2 text-mist">
                                            <Clock className="h-8 w-8 opacity-20 text-ochre" strokeWidth={1.5} />
                                            <p className="text-sm">Initiate the brief dialogue.</p>
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
                                                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed
                                                            ${isOwn
                                                                ? 'bg-ochre text-canvas font-medium rounded-br-sm shadow-md'
                                                                : 'bg-surface border border-edge text-alabaster rounded-bl-sm shadow-sm'
                                                            }`}>
                                                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                            <p className={`text-[9px] font-mono mt-1 ${isOwn ? 'text-canvas/70 text-right' : 'text-mist'}`}>
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
                                <div className="border-t border-edge p-3.5 bg-surface">
                                    <div className="flex items-end gap-2.5">
                                        <textarea
                                            ref={inputRef}
                                            value={draft}
                                            onChange={e => setDraft(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Transmit secure message… (Enter to dispatch)"
                                            rows={1}
                                            className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-edge bg-surface.elevated text-alabaster text-xs focus:outline-none focus:border-ochre max-h-32 overflow-y-auto placeholder:text-mist/40"
                                            style={{ minHeight: '42px' }}
                                        />
                                        <Button
                                            size="icon"
                                            onClick={handleSend}
                                            disabled={!draft.trim()}
                                            className="h-10 w-10 rounded-xl flex-shrink-0 bg-ochre hover:bg-ochre/90 text-canvas border-none"
                                        >
                                            <Send className="h-4 w-4" strokeWidth={1.8} />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-mist">
                                <MessageSquare className="h-12 w-12 opacity-20 text-ochre" strokeWidth={1.5} />
                                <p className="font-serif text-lg font-normal text-alabaster">Select a Dispatch Channel</p>
                                <p className="text-xs text-center max-w-xs text-mist">Choose an active client or photographer conversation from the index to exchange details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
