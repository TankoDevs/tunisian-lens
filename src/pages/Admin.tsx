import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Clock, CheckCircle2, XCircle, User,
    ChevronDown, ChevronUp, Search, SlidersHorizontal
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
    getVerificationRequests,
    updateVerificationRequest,
    type VerificationRequest,
} from "../lib/verification";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

type Filter = 'all' | 'pending' | 'approved' | 'denied';

const STATUS_CONFIG = {
    pending: {
        icon: Clock,
        label: 'Under Review',
        dot: 'bg-sand-400',
        badge: 'text-sand-700 bg-sand-50 border-sand-200 dark:text-sand-400 dark:bg-sand-900/20 dark:border-sand-800',
        card: 'border-sand-200/60 dark:border-sand-800/40',
    },
    approved: {
        icon: CheckCircle2,
        label: 'Approved',
        dot: 'bg-emerald-400',
        badge: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800',
        card: 'border-emerald-200/60 dark:border-emerald-800/40',
    },
    denied: {
        icon: XCircle,
        label: 'Denied',
        dot: 'bg-rose-400',
        badge: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-800',
        card: 'border-rose-200/60 dark:border-rose-800/40',
    },
} as const;

function RequestCard({
    req,
    onApprove,
    onDeny,
    onUndo,
}: {
    req: VerificationRequest;
    onApprove: () => void;
    onDeny: () => void;
    onUndo: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const cfg = STATUS_CONFIG[req.status];
    const Icon = cfg.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className={`group rounded-lg border bg-card overflow-hidden transition-all duration-300 card-hover ${cfg.card}`}
        >
            {/* Top accent line */}
            <div className={`h-[1.5px] w-full ${cfg.dot}`} />

            <div className="p-5">
                {/* Header row */}
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                            <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${cfg.dot}`} />
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                        <p className="font-sans font-semibold text-sm leading-tight truncate">{req.userName}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{req.userEmail}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                            Submitted {formatDate(req.submittedAt)}
                        </p>
                    </div>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${cfg.badge}`}>
                        <Icon className="h-3 w-3" strokeWidth={2} />
                        {cfg.label}
                    </span>
                </div>

                {/* Message preview / expand */}
                <div className="mt-4">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="w-full text-left group/msg"
                    >
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
                            <span>Message</span>
                            {expanded
                                ? <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
                                : <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />}
                        </div>
                        <motion.div
                            animate={{ height: expanded ? 'auto' : '3.5rem' }}
                            className="overflow-hidden"
                        >
                            <p className={`text-sm text-foreground/75 leading-relaxed italic bg-muted/40 rounded-lg px-4 py-3 border border-border/50 ${!expanded ? 'line-clamp-2' : ''}`}>
                                "{req.message}"
                            </p>
                        </motion.div>
                    </button>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-end gap-2">
                    {req.status === 'pending' ? (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-4 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                onClick={onDeny}
                            >
                                <XCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                                Deny
                            </Button>
                            <Button
                                size="sm"
                                className="h-8 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                onClick={onApprove}
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                                Approve
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
                            onClick={onUndo}
                        >
                            Undo
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function Admin() {
    const { user, isAuthenticated } = useAuth();
    const [filter, setFilter] = useState<Filter>('pending');
    const [search, setSearch] = useState('');
    const [requests, setRequests] = useState<VerificationRequest[]>(getVerificationRequests);

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
                {/* Inspiring background image */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <img
                        src="https://picsum.photos/seed/admin-lock/1920/1080"
                        alt=""
                        className="h-full w-full object-cover opacity-10 dark:opacity-5"
                    />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-muted border flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-sans mb-2">Admin Access Only</h1>
                    <p className="text-muted-foreground text-sm">You need admin privileges to view this page.</p>
                </div>
                <Link to="/"><Button variant="outline">Go Back Home</Button></Link>
            </div>
        );
    }

    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const deniedCount = requests.filter(r => r.status === 'denied').length;

    const filtered = requests
        .filter(r => filter === 'all' || r.status === filter)
        .filter(r =>
            !search.trim() ||
            r.userName.toLowerCase().includes(search.toLowerCase()) ||
            r.userEmail.toLowerCase().includes(search.toLowerCase())
        );

    const refresh = () => setRequests(getVerificationRequests());

    const handle = (id: string, action: 'approved' | 'denied') => {
        updateVerificationRequest(id, action);
        refresh();
    };

    const FILTERS: { key: Filter; label: string; count?: number }[] = [
        { key: 'pending', label: 'Pending', count: pendingCount },
        { key: 'approved', label: 'Approved', count: approvedCount },
        { key: 'denied', label: 'Denied', count: deniedCount },
        { key: 'all', label: 'All', count: requests.length },
    ];

    return (
        <div className="min-h-screen bg-background">

            {/* ── Hero Header ──────────────────────────────────────── */}
            <div className="relative overflow-hidden border-b">
                {/* Background image */}
                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://picsum.photos/seed/tunis-cityscape/1920/600"
                        alt=""
                        className="h-full w-full object-cover"
                    />
                    {/* Gradient overlay — adapts to dark/light */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 dark:from-black dark:via-black/80 dark:to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent dark:from-black" />
                </div>

                <div className="container mx-auto px-6 py-16 max-w-4xl">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sand-500 mb-3">Administration</p>
                        <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-3">
                            Verification Panel
                        </h1>
                        <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">
                            Review and manage creative verification requests.
                        </p>
                    </div>

                    {/* Stat pills */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        {[
                            { label: 'Pending Review', value: pendingCount, color: 'text-sand-700 dark:text-sand-400 bg-sand-50 dark:bg-sand-900/20 border-sand-200 dark:border-sand-800' },
                            { label: 'Approved', value: approvedCount, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
                            { label: 'Denied', value: deniedCount, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
                        ].map(s => (
                            <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-semibold ${s.color}`}>
                                <span className="text-xl font-bold">{s.value}</span>
                                <span className="text-xs font-medium opacity-75">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────── */}
            <div className="container mx-auto px-6 py-10 max-w-4xl">

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-sand-400/30 focus:border-sand-400 transition-all duration-300"
                        />
                    </div>

                    {/* Filter chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={2} />
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md text-xs font-semibold border transition-all duration-300 ${filter === f.key
                                    ? 'bg-foreground text-background border-foreground shadow-sm'
                                    : 'border-border hover:bg-accent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {f.label}
                                {f.count !== undefined && f.count > 0 && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.key
                                        ? 'bg-background/20 text-background'
                                        : f.key === 'pending'
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {f.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card grid */}
                {filtered.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-16 text-center bg-card/40">
                        <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                            <ShieldCheck className="h-8 w-8 text-muted-foreground opacity-40" strokeWidth={1.5} />
                        </div>
                        <p className="font-sans text-base font-semibold mb-1">No requests found</p>
                        <p className="text-sm text-muted-foreground">
                            {search ? 'Try a different search query' : filter === 'pending' ? 'All caught up — no pending requests' : `No ${filter} requests yet`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {filtered.map(req => (
                                <RequestCard
                                    key={req.id}
                                    req={req}
                                    onApprove={() => handle(req.id, 'approved')}
                                    onDeny={() => handle(req.id, 'denied')}
                                    onUndo={() => {
                                        handle(req.id, req.status === 'approved' ? 'denied' : 'approved');
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty-state inspiration quote */}
                {pendingCount === 0 && filter === 'pending' && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 relative rounded-lg overflow-hidden"
                    >
                        <img
                            src="https://picsum.photos/seed/photography-inspiration/1200/300"
                            alt="Inspiring photography"
                            className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end pb-8 text-center px-4">
                            <p className="font-sans text-white text-xl font-bold">"Every great photograph begins with a single shutter click."</p>
                            <p className="text-white/60 text-sm mt-1">Keep verifying the talent that captures the world.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div >
    );
}
