import React, { useState, useRef } from "react";
import { X, Camera, Upload, User as UserIcon, Check, MapPin, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { CITIES } from "../../data/mockData";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        name?: string;
        avatar?: string;
        bio?: string;
        title?: string;
        location?: string;
    };
    onSaveSuccess?: () => void;
}

const PRESET_AVATARS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
];

export function EditProfileModal({ isOpen, onClose, initialData, onSaveSuccess }: EditProfileModalProps) {
    const { user, updateProfile } = useAuth();
    const { showAlert } = useAlert();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(initialData?.name || user?.name || "");
    const [avatar, setAvatar] = useState(initialData?.avatar || user?.avatar || "");
    const [bio, setBio] = useState(initialData?.bio || user?.bio || "");
    const [title, setTitle] = useState(initialData?.title || user?.title || "");
    const [location, setLocation] = useState(initialData?.location || user?.location || "Tunis, Tunisia");
    const [isSaving, setIsSaving] = useState(false);
    const [avatarInputUrl, setAvatarInputUrl] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    if (!isOpen) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg("Image size exceeds 5MB limit.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setAvatar(reader.result);
                setErrorMsg("");
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!name.trim()) {
            setErrorMsg("Please specify your display name.");
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({
                name: name.trim(),
                avatar: avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
                bio: bio.trim(),
                title: title.trim(),
                location: location.trim(),
            });

            showAlert("Profile updated successfully!", "success");
            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to update profile.";
            setErrorMsg(msg);
            showAlert(msg, "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-xl bg-surface border border-edge rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-edge">
                        <div>
                            <div className="flex items-center gap-2 text-ochre text-[11px] font-mono uppercase tracking-[0.2em]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Public Talent Dossier</span>
                            </div>
                            <h2 className="text-2xl font-serif text-alabaster tracking-tight mt-1">Edit Profile &amp; Bio</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-mist hover:text-alabaster hover:bg-surface-elevated transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="mt-6 space-y-6">
                        {/* ── Photo / Avatar Section ── */}
                        <div className="space-y-3">
                            <label className="text-xs font-mono uppercase tracking-wider text-mist block">
                                Profile Photograph
                            </label>

                            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-canvas border border-edge">
                                <div className="relative group flex-shrink-0">
                                    <img
                                        src={avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                                        alt={name}
                                        className="w-20 h-20 rounded-full object-cover ring-2 ring-ochre/40 ring-offset-2 ring-offset-canvas shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-ochre"
                                        title="Upload photo"
                                    >
                                        <Camera className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-2 flex-1 text-center sm:text-left">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                    />
                                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3.5 py-1.5 rounded-xl bg-ochre hover:bg-ochre-light text-canvas text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            Upload Photo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowUrlInput(!showUrlInput)}
                                            className="px-3 py-1.5 rounded-xl border border-edge text-mist hover:text-alabaster text-xs font-mono transition-colors"
                                        >
                                            Image URL
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-mist/60 font-light">
                                        Recommended: Square portrait, JPEG or PNG up to 5MB.
                                    </p>
                                </div>
                            </div>

                            {/* Preset avatars selection */}
                            <div className="space-y-1.5">
                                <span className="text-[10px] text-mist/60 font-mono uppercase tracking-wider">Or select a sample portrait</span>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {PRESET_AVATARS.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setAvatar(url)}
                                            className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                                                avatar === url ? "border-ochre scale-110" : "border-edge opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* URL Input collapse */}
                            {showUrlInput && (
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="url"
                                        value={avatarInputUrl}
                                        onChange={(e) => setAvatarInputUrl(e.target.value)}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="flex-1 h-9 px-3 rounded-lg border border-edge bg-canvas text-xs text-alabaster focus:outline-none focus:border-ochre"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (avatarInputUrl.trim()) {
                                                setAvatar(avatarInputUrl.trim());
                                                setAvatarInputUrl("");
                                                setShowUrlInput(false);
                                            }
                                        }}
                                        className="h-9 px-3 rounded-lg bg-surface-elevated border border-edge text-xs text-alabaster hover:text-ochre"
                                    >
                                        Apply
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── Name & Professional Title ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase tracking-wider text-mist">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Aziz Ben Youssef"
                                        className="w-full h-11 pl-9 pr-3 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre"
                                    />
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist/50" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase tracking-wider text-mist">
                                    Professional Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Editorial & Drone Photographer"
                                    className="w-full h-11 px-3 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre"
                                />
                            </div>
                        </div>

                        {/* ── Regional Location (Safe - no raw coordinates) ── */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase tracking-wider text-mist flex items-center justify-between">
                                <span>Regional Base</span>
                                <span className="text-[10px] text-ochre/80 font-normal">GPS coordinates kept strictly private</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full h-11 pl-9 pr-4 rounded-xl border border-edge bg-canvas text-alabaster text-sm focus:outline-none focus:border-ochre appearance-none cursor-pointer"
                                >
                                    {CITIES.map((c) => (
                                        <option key={c} value={`${c}, Tunisia`} className="bg-surface text-alabaster">
                                            {c}, Tunisia
                                        </option>
                                    ))}
                                    <option value="International / Remote" className="bg-surface text-alabaster">
                                        International / Remote
                                    </option>
                                </select>
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ochre" />
                            </div>
                        </div>

                        {/* ── Bio / Creative Statement ── */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono uppercase tracking-wider text-mist">
                                    Curatorial Bio &amp; Philosophy
                                </label>
                                <span className={`text-[10px] font-mono ${bio.length > 500 ? 'text-rose-400' : 'text-mist/60'}`}>
                                    {bio.length} / 500
                                </span>
                            </div>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                maxLength={500}
                                placeholder="Describe your documentary focus, equipment setup, editorial background, and the stories you tell across Tunisia..."
                                className="w-full p-3.5 rounded-xl border border-edge bg-canvas text-alabaster text-xs leading-relaxed placeholder:text-mist/40 focus:outline-none focus:border-ochre resize-none"
                            />
                        </div>

                        {/* ── Action Buttons ── */}
                        <div className="pt-2 flex items-center justify-end gap-3 border-t border-edge">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                                className="px-5 py-2.5 rounded-full border border-edge text-mist hover:text-alabaster text-xs font-mono uppercase tracking-wider transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-full bg-ochre hover:bg-ochre-light disabled:opacity-50 text-canvas font-semibold text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2 shadow-md"
                            >
                                {isSaving ? (
                                    <span>Saving Profile...</span>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
