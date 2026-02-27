import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Conversation {
    id: string;
    jobId: string;
    jobTitle: string;
    clientId: string;
    clientName: string;
    photographerId: string;
    photographerName: string;
    createdAt: string;
    lastMessage?: string;
    lastMessageAt?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    text: string;
    createdAt: string;
}

interface ChatContextType {
    conversations: Conversation[];
    messages: Record<string, Message[]>; // keyed by conversationId
    unreadCount: number;
    createConversation: (params: Omit<Conversation, 'id' | 'createdAt' | 'lastMessage' | 'lastMessageAt'>) => Conversation;
    sendMessage: (conversationId: string, text: string) => void;
    getMessages: (conversationId: string) => Message[];
    getMyConversations: () => Conversation[];
    markRead: (conversationId: string) => void;
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const CONV_KEY = 'tunisian_lens_conversations';
const MSG_KEY = 'tunisian_lens_messages';
const READ_KEY = 'tunisian_lens_read_at'; // { [convId]: isoString }

// ── Context ───────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const [conversations, setConversations] = useState<Conversation[]>(() =>
        JSON.parse(localStorage.getItem(CONV_KEY) || '[]')
    );

    const [messages, setMessages] = useState<Record<string, Message[]>>(() =>
        JSON.parse(localStorage.getItem(MSG_KEY) || '{}')
    );

    const [readAt, setReadAt] = useState<Record<string, string>>(() =>
        JSON.parse(localStorage.getItem(READ_KEY) || '{}')
    );

    // Persist to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem(CONV_KEY, JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        localStorage.setItem(MSG_KEY, JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem(READ_KEY, JSON.stringify(readAt));
    }, [readAt]);

    const createConversation = useCallback(
        (params: Omit<Conversation, 'id' | 'createdAt' | 'lastMessage' | 'lastMessageAt'>): Conversation => {
            // Avoid duplicate conversations for the same job + photographer pair
            const existing = conversations.find(
                c => c.jobId === params.jobId && c.photographerId === params.photographerId
            );
            if (existing) return existing;

            const conv: Conversation = {
                ...params,
                id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                createdAt: new Date().toISOString(),
            };
            setConversations(prev => [conv, ...prev]);
            return conv;
        },
        [conversations]
    );

    const sendMessage = useCallback(
        (conversationId: string, text: string) => {
            if (!user || !text.trim()) return;
            const msg: Message = {
                id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                conversationId,
                senderId: user.id,
                senderName: user.name,
                text: text.trim(),
                createdAt: new Date().toISOString(),
            };
            setMessages(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), msg],
            }));
            // Update lastMessage on conversation
            setConversations(prev =>
                prev.map(c =>
                    c.id === conversationId
                        ? { ...c, lastMessage: text.trim(), lastMessageAt: msg.createdAt }
                        : c
                )
            );
        },
        [user]
    );

    const getMessages = useCallback(
        (conversationId: string): Message[] => messages[conversationId] || [],
        [messages]
    );

    const getMyConversations = useCallback((): Conversation[] => {
        if (!user) return [];
        return conversations.filter(
            c => c.clientId === user.id || c.photographerId === user.id
        );
    }, [conversations, user]);

    const markRead = useCallback((conversationId: string) => {
        setReadAt(prev => ({ ...prev, [conversationId]: new Date().toISOString() }));
    }, []);

    // Count conversations the user is in that have messages newer than their last-read timestamp
    const unreadCount = getMyConversations().filter(conv => {
        const convMessages = messages[conv.id] || [];
        if (convMessages.length === 0) return false;
        const lastMsg = convMessages[convMessages.length - 1];
        if (lastMsg.senderId === user?.id) return false; // own message, not unread
        const readTimestamp = readAt[conv.id];
        if (!readTimestamp) return true;
        return new Date(lastMsg.createdAt) > new Date(readTimestamp);
    }).length;

    return (
        <ChatContext.Provider value={{
            conversations,
            messages,
            unreadCount,
            createConversation,
            sendMessage,
            getMessages,
            getMyConversations,
            markRead,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used within ChatProvider');
    return ctx;
}
