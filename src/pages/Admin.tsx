import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Clock, CheckCircle2, XCircle, User,
    ChevronDown, ChevronUp, Search, SlidersHorizontal, Crown, Star
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ARTISTS } from "../data/mockData";
import { BadgePill } from "../components/ui/BadgePill";
import { type BadgeLevel } from "../data/mockData";
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
        dot: 'bg-ochre',
        badge: 'text-ochre bg-ochre/10 border-ochre/25',
        card: 'border-edge hover:border-ochre/40',
    },
    approved: {
        icon: CheckCircle2,
        label: 'Approved',
        dot: 'bg-emerald-400',
        badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
        card: 'border-edge hover:border-emerald-500/40',
    },
    denied: {
        icon: XCircle,
        label: 'Denied',
        dot: 'bg-rose-400',
        badge: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
        card: 'border-edge hover:border-rose-500/40',
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
            className={`group rounded-2xl border bg-surface overflow-hidden transition-all duration-300 shadow-md ${cfg.card}`}
        >
            {/* Top accent line */}
            <div className={`h-[2px] w-full ${cfg.dot}`} />

            <div className="p-6">
                {/* Header row */}
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full bg-canvas border border-edge flex items-center justify-center overflow-hidden">
                            <User className="h-5 w-5 text-mist" strokeWidth={1.5} />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${cfg.dot}`} />
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                        <p className="font-serif text-base text-alabaster font-normal truncate">{req.userName}</p>
                        <p className="text-xs text-mist font-mono truncate mt-0.5">{req.userEmail}</p>
                        <p className="text-[10px] text-mist/60 mt-1 font-mono">
                            Submitted {formatDate(req.submittedAt)}
                        </p>
                    </div>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border whitespace-nowrap ${cfg.badge}`}>
                        <Icon className="h-3 w-3" strokeWidth={2} />
                        {cfg.label}
                    </span>
                </div>

                {/* Message preview / expand */}
                <div className="mt-5">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="w-full text-left group/msg"
                    >
                        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-mist mb-2">
                            <span>Photographer Statement</span>
                            {expanded
                                ? <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
                                : <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />}
                        </div>
                        <motion.div
                            animate={{ height: expanded ? 'auto' : '3.5rem' }}
                            className="overflow-hidden"
                        >
                            <p className={`text-sm text-alabaster/80 leading-relaxed italic bg-canvas/60 rounded-xl px-4 py-3 border border-edge font-serif ${!expanded ? 'line-clamp-2' : ''}`}>
                                "{req.message}"
                            </p>
                        </motion.div>
                    </button>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-edge/60">
                    {req.status === 'pending' ? (
                        <>
                            <button
                                className="h-8 px-4 text-xs font-mono tracking-wider rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center"
                                onClick={onDeny}
                            >
                                <XCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                                Deny
                            </button>
                            <button
                                className="h-8 px-4 text-xs font-mono tracking-wider rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center shadow-sm"
                                onClick={onApprove}
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                                Approve
                            </button>
                        </>
                    ) : (
                        <button
                            className="h-8 px-3 text-xs font-mono text-mist hover:text-alabaster transition-colors"
                            onClick={onUndo}
                        >
                            Undo
                        </button>
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

    // COTM state
    const [cotmId, setCotmId] = useState<string>(() => localStorage.getItem('tunisian_lens_cotm') || '');

    // Badge override state: {[artistId]: BadgeLevel | 'none'}
    const [badgeOverrides, setBadgeOverrides] = useState<Record<string, string>>(() => {
        try { return JSON.parse(localStorage.getItem('tunisian_lens_badge_overrides') || '{}'); } catch { return {}; }
    });

    function setCOTM(id: string) {
        setCotmId(id);
        if (id) localStorage.setItem('tunisian_lens_cotm', id);
        else localStorage.removeItem('tunisian_lens_cotm');
    }

    function setBadge(artistId: string, level: string) {
        const next = { ...badgeOverrides, [artistId]: level };
        if (level === 'none') delete next[artistId];
        setBadgeOverrides(next);
        localStorage.setItem('tunisian_lens_badge_overrides', JSON.stringify(next));
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-canvas text-alabaster flex flex-col items-center justify-center gap-6 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-surface border border-edge flex items-center justify-center text-ochre">
                    <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-3xl font-serif text-alabaster mb-2">Curatorial Access Restricted</h1>
                    <p className="text-mist text-sm font-light">You need administrator privileges to govern verification requests.</p>
                </div>
                <Link to="/">
                    <button className="px-5 py-2.5 rounded-full border border-edge bg-surface hover:bg-surface-elevated text-alabaster text-xs font-mono tracking-wider uppercase transition-colors">
                        Return to Archive
                    </button>
                </Link>
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
        { key: 'all', label: 'All Records', count: requests.length },
    ];

    return (
        <div className="min-h-screen bg-canvas text-alabaster">

            {/* ── Hero Header ──────────────────────────────────────── */}
            <div className="relative overflow-hidden border-b border-edge">
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-0 right-10 w-[500px] h-[300px] bg-ochre/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-6 py-16 max-w-5xl">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-ochre mb-3">Archive Governance</p>
                        <h1 className="font-serif text-4xl md:text-5xl text-alabaster tracking-tight mb-3">
                            Verification & Guild Administration
                        </h1>
                        <p className="text-mist max-w-xl text-sm leading-relaxed font-light">
                            Review candidate portfolio submissions, verify optical authenticity, and manage national creative credentials.
                        </p>
                    </div>

                    {/* Stat pills */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        {[
                            { label: 'Pending Review', value: pendingCount, color: 'text-ochre bg-ochre/10 border-ochre/25' },
                            { label: 'Verified Artists', value: approvedCount, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
                            { label: 'Denied / Incomplete', value: deniedCount, color: 'text-rose-400 bg-rose-500/10 border-rose-500/25' },
                        ].map(s => (
                            <div key={s.label} className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-sm ${s.color}`}>
                                <span className="text-xl font-serif font-bold">{s.value}</span>
                                <span className="text-xs font-mono uppercase tracking-wider opacity-80">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────── */}
            <div className="container mx-auto px-6 py-12 max-w-5xl">

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" strokeWidth={1.8} />
                        <input
                            type="text"
                            placeholder="Filter applicants by name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-edge bg-surface text-alabaster placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                        />
                    </div>

                    {/* Filter chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <SlidersHorizontal className="h-4 w-4 text-mist flex-shrink-0" strokeWidth={1.8} />
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${filter === f.key
                                    ? 'bg-ochre text-canvas border-ochre font-semibold shadow-sm'
                                    : 'border-edge bg-surface text-mist hover:text-alabaster hover:border-edge/80'
                                    }`}
                            >
                                {f.label}
                                {f.count !== undefined && f.count > 0 && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${filter === f.key
                                        ? 'bg-canvas/20 text-canvas'
                                        : 'bg-canvas text-mist'
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
                    <div className="rounded-2xl border border-dashed border-edge p-16 text-center bg-surface/30">
                        <div className="w-16 h-16 rounded-2xl bg-surface border border-edge mx-auto mb-4 flex items-center justify-center text-mist">
                            <ShieldCheck className="h-8 w-8 opacity-40" strokeWidth={1.5} />
                        </div>
                        <p className="font-serif text-lg text-alabaster mb-1">No requests found</p>
                        <p className="text-sm text-mist font-light">
                            {search ? 'Try adjusting your search criteria' : filter === 'pending' ? 'All caught up — no pending applications' : `No ${filter} requests on record`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

                {/* ── CREATIVE OF THE MONTH PICKER ── */}
                <div className="mt-16 border-t border-edge pt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-ochre/10 border border-ochre/25 flex items-center justify-center text-ochre">
                            <Crown className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-ochre">Curatorial Spotlight</p>
                            <h2 className="font-serif text-2xl text-alabaster">Creative of the Month</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <select
                            value={cotmId}
                            onChange={e => setCOTM(e.target.value)}
                            className="h-11 px-4 rounded-xl border border-edge bg-surface text-alabaster text-sm focus:outline-none focus:border-ochre min-w-[280px]"
                        >
                            <option value="">-- No Featured Creative --</option>
                            {ARTISTS.map(a => (
                                <option key={a.id} value={a.id}>{a.name} – {a.location}</option>
                            ))}
                        </select>
                        {cotmId && (
                            <button
                                onClick={() => setCOTM('')}
                                className="h-11 px-4 rounded-xl border border-edge bg-surface hover:bg-surface-elevated text-xs font-mono uppercase tracking-wider text-mist hover:text-alabaster"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>
                    {cotmId && (() => {
                        const cotm = ARTISTS.find(a => a.id === cotmId);
                        return cotm ? (
                            <div className="mt-4 flex items-center gap-4 p-4 rounded-2xl border border-ochre/30 bg-surface">
                                <img src={cotm.avatar} className="w-12 h-12 rounded-full object-cover border border-edge" alt={cotm.name} />
                                <div>
                                    <p className="font-serif text-base text-alabaster">{cotm.name}</p>
                                    <p className="text-xs text-mist font-mono mt-0.5">{cotm.location} · {cotm.categories.join(', ')}</p>
                                </div>
                                <Crown className="h-5 w-5 text-ochre ml-auto" strokeWidth={1.5} />
                            </div>
                        ) : null;
                    })()}
                </div>

                {/* ── BADGE OVERRIDE PANEL ── */}
                <div className="mt-14 border-t border-edge pt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-surface border border-edge flex items-center justify-center text-sidi-azure">
                            <Star className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-ochre">Guild Tier Management</p>
                            <h2 className="font-serif text-2xl text-alabaster">Artist Credential Overrides</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ARTISTS.map(a => {
                            const current = (badgeOverrides[a.id] || a.badgeLevel || 'none') as string;
                            return (
                                <div key={a.id} className="flex items-center gap-3 p-4 rounded-2xl border border-edge bg-surface">
                                    <img src={a.avatar} className="w-10 h-10 rounded-full object-cover border border-edge flex-shrink-0" alt={a.name} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-serif text-sm text-alabaster truncate">{a.name}</p>
                                        <p className="text-xs text-mist font-mono truncate">{a.location}</p>
                                    </div>
                                    {current !== 'none' && <BadgePill level={current as BadgeLevel} size="sm" />}
                                    <select
                                        value={current}
                                        onChange={e => setBadge(a.id, e.target.value)}
                                        className="h-8 px-2.5 rounded-lg border border-edge bg-canvas text-alabaster text-xs font-mono focus:outline-none focus:border-ochre"
                                    >
                                        <option value="none">No Badge</option>
                                        <option value="verified">Verified</option>
                                        <option value="pro">Pro</option>
                                        <option value="elite">Elite</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
