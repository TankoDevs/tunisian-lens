import { Upload, X, Lock, Unlock, ShieldAlert, ShieldCheck, CheckCircle2, AlertCircle, Download, Sparkles, Camera, MapPin, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/mockData";
import { cn } from "../lib/utils";
import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { uploadImage } from "../lib/cloudinary";
import { checkImageSafety } from "../lib/api";
import { detectImageMetadata, type DetectedPhotoMeta } from "../utils/exifDetector";
import { uploadCulturalPhoto } from "../lib/photoUploadService";
import type { TunisianRegion } from "../types/photo";

const SUGGESTED_TAGS: Record<string, string[]> = {
    "Wedding": ["Wedding", "Bride", "Groom", "Love", "Ceremony", "Couple", "Portrait"],
    "Event": ["Event", "Party", "Music", "Stage", "BTS", "Flash", "Crowd"],
    "Product": ["Product", "Minimal", "Studio", "Macro", "Advertising", "Commercial"],
    "Drone": ["Aerial", "Drone", "Landscape", "Nature", "Panorama", "Architecture"],
    "Videography": ["Cinematic", "B-Roll", "4K", "ShortFilm", "Documentary", "Action"],
    "Fashion": ["Fashion", "Model", "Style", "Vogue", "Editorial", "Runway"],
    "Food": ["Food", "Culinary", "Plating", "Gastronomy", "Restaurant", "Delicious"],
    "Street": ["Street", "Urban", "Candid", "City", "Documentary", "BlackAndWhite"],
};

export function SubmitProject() {
    const { addProject } = useProjects();
    const { isAuthenticated, user } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const [dragActive, setDragActive] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isDownloadable, setIsDownloadable] = useState(true);
    const [isCertified, setIsCertified] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatusMsg, setUploadStatusMsg] = useState("");

    // Cultural Region & Location State
    const [region, setRegion] = useState<TunisianRegion>("Tunis & Suburbs");
    const [locationName, setLocationName] = useState("Sidi Bou Said, Tunis");

    // Client-side EXIF Optics Detection State
    const [detectedExif, setDetectedExif] = useState<DetectedPhotoMeta | null>(null);
    const [isExtractingExif, setIsExtractingExif] = useState(false);

    // AI & Safety Detection State
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<'safe' | 'ai-detected' | 'api-error' | null>(null);
    const [safetyResult, setSafetyResult] = useState<'safe' | 'unsafe' | 'api-error' | null>(null);
    const [lowConfidence, setLowConfidence] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [isVerified, setIsVerified] = useState(false);

    // Auto-generate code when Private is toggled on
    const togglePrivate = (checked: boolean) => {
        setIsPrivate(checked);
        if (checked) {
            setIsDownloadable(true);
            if (!generatedCode) {
                const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                let result = '';
                for (let i = 0; i < 6; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                const formatted = result.slice(0, 3) + '-' + result.slice(3);
                setGeneratedCode(formatted);
            }
        }
    };

    const runPixelAnalysis = async (file: File) => {
        setIsScanning(true);
        setScanProgress(0);
        setScanResult(null);
        setSafetyResult(null);
        setLowConfidence(false);

        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 90) return 90;
                return prev + 2;
            });
        }, 100);

        try {
            const result = await checkImageSafety(file);
            clearInterval(interval);
            setScanProgress(100);
            setIsScanning(false);

            if (result.status === 'failure') {
                setScanResult('api-error');
                setSafetyResult('api-error');
                showAlert(result.message || "Detection engine failure. Please try again.", "error");
                return;
            }

            if (result.type === 'safety') {
                setSafetyResult('unsafe');
                showAlert(result.message || "Content safety violation detected.", "error");
            } else if (result.type === 'ai') {
                setScanResult('ai-detected');
                showAlert("AI-generated content detected. Submission restricted.", "error");
            } else {
                setScanResult('safe');
                setSafetyResult('safe');

                const genericPatterns = ['untitled', 'image', 'photo', 'download', 'img_', 'dsc', 'asset', 'screenshot'];
                if (genericPatterns.some(p => file.name.toLowerCase().includes(p))) {
                    setLowConfidence(true);
                }
            }
        } catch {
            clearInterval(interval);
            setIsScanning(false);
            setScanResult('api-error');
            showAlert("External connection error. Please try again.", "error");
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setSelectedImage(e.target?.result as string);
        reader.readAsDataURL(file);

        // Client-side EXIF Optics Detection
        setIsExtractingExif(true);
        try {
            const meta = await detectImageMetadata(file);
            setDetectedExif(meta);
            if (meta.camera || meta.lens) {
                setScanResult('safe');
                setSafetyResult('safe');
            }
        } catch (err) {
            console.warn("EXIF extraction notice:", err);
        } finally {
            setIsExtractingExif(false);
        }

        runPixelAnalysis(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (safetyResult === 'unsafe') {
            showAlert("Inappropriate content detected. Submission blocked.", "error");
            return;
        }

        if (scanResult === 'ai-detected') {
            showAlert("Cannot publish AI-generated content.", "error");
            return;
        }

        if (isScanning) {
            showAlert("Please wait for the safety and AI scans to complete.", "warning");
            return;
        }

        if (!isCertified) {
            showAlert("You must certify that this is your own original creation.", "warning");
            return;
        }

        if (!isVerified) {
            showAlert("Please complete the verification slider", "warning");
            return;
        }

        if (!title || !category || !selectedImage) {
            if (!selectedImage) {
                showAlert("Please upload a project image.", "error");
                return;
            }
            if (!title) {
                showAlert("Please provide a title for your project.", "error");
                return;
            }
            if (!category) {
                showAlert("Please select a category.", "error");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            let imageUrl = selectedImage!;

            if (imageFile) {
                try {
                    const uploadResult = await uploadCulturalPhoto({
                        file: imageFile,
                        title,
                        story: description,
                        region,
                        locationName: locationName || 'Tunisia',
                        tags: tags.split(' ').map(tag => tag.replace(/^#/, '').trim()).filter(Boolean),
                        userId: user?.id,
                    }, (msg) => setUploadStatusMsg(msg));

                    imageUrl = uploadResult.imageUrl;
                } catch (uploadError: unknown) {
                    console.warn("Storage upload notice:", uploadError);
                    try {
                        const fallbackUrl = await uploadImage(imageFile);
                        imageUrl = fallbackUrl;
                    } catch {
                        // Keep preview image URL
                    }
                }
            }

            await addProject({
                title,
                category,
                image: imageUrl,
                description,
                tags: tags.split(' ').map(tag => tag.replace(/^#/, '').trim()).filter(tag => tag !== ''),
                isPrivate,
                isDownloadable,
                accessCode: isPrivate ? generatedCode : undefined,
            });

            setIsSubmitting(false);

            if (isPrivate) {
                showAlert(`Published Privately! Access Code: ${generatedCode}`, "success");
                setTimeout(() => navigate('/explore'), 3000);
            } else {
                navigate('/explore');
            }
        } catch {
            setIsSubmitting(false);
            showAlert("Failed to publish project. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-canvas text-alabaster py-12 md:py-20">
            <div className="container mx-auto px-6 max-w-3xl space-y-8">
                {/* Header */}
                <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-ochre">Archival Studio</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-alabaster tracking-tight">Upload Cultural Series</h1>
                    <p className="text-sm md:text-base text-mist font-light">
                        Contribute human-captured photography or cinematography to the national Tunisian archive.
                    </p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit} noValidate>

                    {/* Image Upload Area */}
                    <div className="space-y-3">
                        <label className="text-xs font-mono uppercase tracking-wider text-mist">
                            Master Image Asset <span className="text-ochre">*</span>
                        </label>
                        <div
                            className={cn(
                                "group relative flex flex-col items-center justify-center w-full min-h-[320px] border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-in-out overflow-hidden",
                                dragActive
                                    ? "border-ochre bg-ochre/5"
                                    : "border-edge bg-surface hover:border-ochre/50 hover:bg-surface-elevated",
                                selectedImage && "border-none p-0 bg-transparent"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {selectedImage ? (
                                <div className="relative w-full h-full min-h-[360px] overflow-hidden rounded-2xl border border-edge bg-canvas">
                                    <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />

                                    {/* AI & SAFETY SCANNING OVERLAY */}
                                    {isScanning && (
                                        <div className="absolute inset-0 bg-canvas/80 flex flex-col items-center justify-center z-10 backdrop-blur-md">
                                            <div className="w-64 space-y-4">
                                                <div className="flex items-center justify-between text-alabaster text-xs font-mono uppercase tracking-wider">
                                                    <span>Optical & AI Scan...</span>
                                                    <span>{scanProgress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-edge rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-ochre transition-all duration-100 ease-linear"
                                                        style={{ width: `${scanProgress}%` }}
                                                    />
                                                </div>
                                                <p className="text-[11px] text-mist text-center animate-pulse font-mono">
                                                    Verifying human capture & content integrity...
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* SAFETY VIOLATION WARNING */}
                                    {safetyResult === 'unsafe' && (
                                        <div className="absolute inset-0 bg-rose-950/90 flex flex-col items-center justify-center z-30 backdrop-blur-md p-6 text-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-4 border border-rose-500/30">
                                                <AlertCircle className="w-8 h-8 text-rose-500" strokeWidth={2} />
                                            </div>
                                            <h3 className="text-xl font-serif text-white mb-2">Inappropriate Content</h3>
                                            <p className="text-rose-200 text-xs mb-6 max-w-sm font-light">
                                                This frame violated our community safety standards. Tunisian Lens maintains an authentic, respectful national archive.
                                            </p>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-mono uppercase tracking-wider"
                                                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setSafetyResult(null); }}
                                            >
                                                Remove Asset
                                            </button>
                                        </div>
                                    )}

                                    {/* AI DETECTED WARNING */}
                                    {scanResult === 'ai-detected' && safetyResult !== 'unsafe' && (
                                        <div className="absolute inset-0 bg-rose-950/80 flex flex-col items-center justify-center z-20 backdrop-blur-md p-6 text-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
                                                <ShieldAlert className="w-8 h-8 text-rose-500" strokeWidth={2} />
                                            </div>
                                            <h3 className="text-xl font-serif text-white mb-2">Synthetic Pattern Detected</h3>
                                            <p className="text-rose-200 text-xs mb-6 max-w-sm font-light">
                                                Our verification engine identified algorithmic diffusion characteristics. Tunisian Lens is exclusively reserved for human artists.
                                            </p>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-mono uppercase tracking-wider"
                                                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setScanResult(null); }}
                                            >
                                                Remove AI File
                                            </button>
                                        </div>
                                    )}

                                    {/* VERIFIED BADGE */}
                                    {scanResult === 'safe' && safetyResult === 'safe' && !isScanning && (
                                        <div className="absolute bottom-4 left-4 bg-canvas/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md z-10">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                                            <span>Certified Human Capture</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <p className="text-alabaster font-mono text-xs uppercase tracking-wider">Click or Drag to Replace</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-canvas/80 border border-edge hover:bg-canvas text-alabaster transition-all z-30 flex items-center justify-center"
                                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setScanResult(null); setSafetyResult(null); setLowConfidence(false); }}
                                    >
                                        <X className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full py-16 px-6 cursor-pointer">
                                    <div className={cn(
                                        "flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-canvas border border-edge text-ochre transition-all duration-300 group-hover:scale-105",
                                        dragActive && "border-ochre bg-ochre/10 scale-105"
                                    )}>
                                        <Upload className="w-7 h-7" strokeWidth={1.8} />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-base font-serif text-alabaster">
                                            <span className="text-ochre">Click to select frame</span> or drag high-res asset
                                        </p>
                                        <p className="text-xs text-mist font-light max-w-sm mx-auto">
                                            Accepts raw or high-res WebP, JPEG, PNG, TIFF. Camera EXIF headers preserved automatically.
                                        </p>
                                    </div>
                                    <input id="image-upload" type="file" className="hidden" onChange={handleChange} accept="image/*" />
                                </label>
                            )}
                        </div>

                        {/* Metadata Confidence Warning (Generic Filename) */}
                        {lowConfidence && selectedImage && !isScanning && scanResult === 'safe' && (
                            <div className="bg-ochre/10 border border-ochre/30 rounded-2xl p-4 flex gap-3 items-start">
                                <ShieldAlert className="h-5 w-5 text-ochre mt-0.5 flex-shrink-0" strokeWidth={1.8} />
                                <div className="space-y-1 text-xs">
                                    <p className="font-serif text-alabaster font-normal">Metadata Notice: Generic Filename</p>
                                    <p className="text-mist font-light leading-relaxed">
                                        This asset was uploaded with a generic filename. Optical scans prioritize original camera naming conventions to verify human provenance.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* EXIF OPTICS READOUT */}
                        {selectedImage && (
                            <div className="bg-surface border border-edge rounded-2xl p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Camera className="w-4 h-4 text-ochre" />
                                        <h4 className="text-xs font-mono uppercase tracking-wider text-alabaster">Camera Optics & EXIF Readout</h4>
                                    </div>
                                    {isExtractingExif ? (
                                        <span className="text-xs font-mono text-mist animate-pulse">Extracting optical metadata…</span>
                                    ) : detectedExif?.camera ? (
                                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} /> Optical Capture Verified
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-mono text-mist">Standard asset headers</span>
                                    )}
                                </div>

                                {detectedExif && (detectedExif.camera || detectedExif.lens || detectedExif.aperture || detectedExif.shutterSpeed) ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                                        <div className="p-3 rounded-xl bg-canvas border border-edge">
                                            <span className="text-mist/60 block text-[9px] uppercase tracking-wider">Camera Body</span>
                                            <span className="font-medium text-alabaster truncate block">{detectedExif.camera || '—'}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-canvas border border-edge">
                                            <span className="text-mist/60 block text-[9px] uppercase tracking-wider">Optics / Lens</span>
                                            <span className="font-medium text-alabaster truncate block">{detectedExif.lens || '—'}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-canvas border border-edge">
                                            <span className="text-mist/60 block text-[9px] uppercase tracking-wider">Aperture</span>
                                            <span className="font-medium text-ochre">{detectedExif.aperture || '—'}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-canvas border border-edge">
                                            <span className="text-mist/60 block text-[9px] uppercase tracking-wider">Shutter Speed</span>
                                            <span className="font-medium text-alabaster">{detectedExif.shutterSpeed || '—'}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-canvas border border-edge">
                                            <span className="text-mist/60 block text-[9px] uppercase tracking-wider">Focal Length</span>
                                            <span className="font-medium text-alabaster">{detectedExif.focalLength || '—'}</span>
                                        </div>
                                        <div className="p-3 rounded-xl bg-canvas border border-edge">
                                            <span className="text-mist/60 block text-[9px] uppercase tracking-wider">ISO Sensitivity</span>
                                            <span className="font-medium text-alabaster">{detectedExif.iso || '—'}</span>
                                        </div>
                                        {detectedExif.latitude && detectedExif.longitude && (
                                            <div className="col-span-2 sm:col-span-3 p-3 rounded-xl bg-canvas border border-edge flex items-center gap-2.5">
                                                <ShieldCheck className="w-4 h-4 text-ochre flex-shrink-0" />
                                                <span className="text-xs text-mist">
                                                    Geographic Provenance: <strong className="text-alabaster">Tunisia (Verified)</strong>
                                                    <span className="text-[10px] text-mist/60 block sm:inline sm:ml-2">
                                                        • Raw GPS coordinates protected &amp; hidden from public view for privacy
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-mist font-light">
                                        No hardware camera metadata detected in headers. You can still publish, but frames with verified optics receive curatorial spotlight priority.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Certification Checkbox */}
                    <div
                        className={cn(
                            "p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start",
                            isCertified
                                ? "bg-ochre/10 border-ochre/40"
                                : "bg-surface border-edge hover:border-edge/80"
                        )}
                        onClick={() => setIsCertified(!isCertified)}
                    >
                        <div className={cn(
                            "w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-colors flex-shrink-0",
                            isCertified ? "bg-ochre border-ochre text-canvas" : "border-edge bg-canvas"
                        )}>
                            {isCertified && <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-serif text-alabaster">Human Origin & Copyright Attestation</p>
                            <p className="text-xs text-mist font-light leading-relaxed">
                                I solemnly certify that this photograph/cinematography was captured with physical optical equipment and has not been synthetically generated. I hold sovereign copyright to this work.
                            </p>
                        </div>
                    </div>

                    {/* Toggles: Visibility & Downloads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Private Toggle */}
                        <div
                            className={cn(
                                "rounded-2xl border p-5 transition-all cursor-pointer",
                                isPrivate
                                    ? "bg-surface border-ochre/40 shadow-sm"
                                    : "bg-surface border-edge hover:border-edge/80"
                            )}
                            onClick={() => togglePrivate(!isPrivate)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                                        isPrivate ? "bg-ochre/15 text-ochre" : "bg-canvas text-mist"
                                    )}>
                                        {isPrivate ? <Lock className="h-4 w-4" strokeWidth={2} /> : <Unlock className="h-4 w-4" strokeWidth={2} />}
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-sm text-alabaster">Private Commission</h3>
                                        <p className="text-xs text-mist font-light">Hidden from public gallery.</p>
                                    </div>
                                </div>

                                <div className={cn(
                                    "w-10 h-5 bg-canvas rounded-full relative transition-colors duration-200 border border-edge",
                                    isPrivate && "bg-ochre border-ochre"
                                )}>
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 bg-alabaster w-4 h-4 rounded-full shadow-sm transition-transform duration-200",
                                        isPrivate && "translate-x-5 bg-canvas"
                                    )} />
                                </div>
                            </div>

                            {isPrivate && (
                                <div className="mt-4 pt-4 border-t border-edge/60 text-center">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-mist block mb-1">
                                        Client Access Passcode
                                    </span>
                                    <div className="text-lg font-mono font-bold tracking-widest text-ochre select-all">
                                        {generatedCode}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Downloadable Toggle */}
                        <div
                            className={cn(
                                "rounded-2xl border p-5 transition-all cursor-pointer",
                                isDownloadable
                                    ? "bg-surface border-ochre/40 shadow-sm"
                                    : "bg-surface border-edge hover:border-edge/80"
                            )}
                            onClick={() => !isPrivate && setIsDownloadable(!isDownloadable)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                                        isDownloadable ? "bg-ochre/15 text-ochre" : "bg-canvas text-mist"
                                    )}>
                                        <Download className="h-4 w-4" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-sm text-alabaster">Direct Downloads</h3>
                                        <p className="text-xs text-mist font-light">
                                            {isPrivate ? "Automatic for private clients." : isDownloadable ? "High-res public access." : "Restricted view only."}
                                        </p>
                                    </div>
                                </div>

                                <div className={cn(
                                    "w-10 h-5 bg-canvas rounded-full relative transition-colors duration-200 border border-edge",
                                    isDownloadable && "bg-ochre border-ochre"
                                )}>
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 bg-alabaster w-4 h-4 rounded-full shadow-sm transition-transform duration-200",
                                        isDownloadable && "translate-x-5 bg-canvas"
                                    )} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Curatorial Inputs */}
                    <div className="space-y-5 bg-surface border border-edge p-6 rounded-2xl">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-xs font-mono uppercase tracking-wider text-mist">
                                Series / Frame Title <span className="text-ochre">*</span>
                            </label>
                            <input
                                id="title"
                                placeholder="e.g. Dawn over the Roman Amphitheatre, El Jem"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                            />
                        </div>

                        {/* Region & Location Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-mist flex items-center gap-1.5">
                                    <Compass size={14} className="text-ochre" /> Tunisian Cultural Region <span className="text-ochre">*</span>
                                </label>
                                <select
                                    className="w-full h-11 px-3 rounded-xl border border-edge bg-canvas text-alabaster text-sm focus:outline-none focus:border-ochre transition-all font-sans"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value as TunisianRegion)}
                                >
                                    <option value="Tunis & Suburbs">Tunis & Suburbs (Carthage, Sidi Bou Said, Medina)</option>
                                    <option value="Sahel">Sahel (Sousse, Monastir, Mahdia, El Jem)</option>
                                    <option value="South & Sahara">South & Sahara (Tozeur, Tataouine, Matmata, Douz)</option>
                                    <option value="North">North (Bizerte, Tabarka, Cap Bon, Ain Draham)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-wider text-mist flex items-center gap-1.5">
                                    <MapPin size={14} className="text-sidi-azure" /> Governorate / Specific Site
                                </label>
                                <input
                                    placeholder="e.g. Sidi Bou Said, Tunis"
                                    value={locationName}
                                    onChange={(e) => setLocationName(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="text-xs font-mono uppercase tracking-wider text-mist">
                                Curatorial Discipline <span className="text-ochre">*</span>
                            </label>
                            <select
                                id="category"
                                className="w-full h-11 px-3 rounded-xl border border-edge bg-canvas text-alabaster text-sm focus:outline-none focus:border-ochre transition-all"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" disabled>Select a Category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-xs font-mono uppercase tracking-wider text-mist">
                                Curatorial Story & Lighting Notes
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                className="w-full p-4 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all resize-y font-light leading-relaxed"
                                placeholder="Narrate the cultural context, the hour of capture, atmospheric light, or historical significance..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="tags" className="text-xs font-mono uppercase tracking-wider text-mist">
                                Archival Tags (Space separated)
                            </label>
                            <input
                                id="tags"
                                placeholder="#sahara #architecture #monochrome"
                                value={tags}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length < tags.length) {
                                        setTags(val);
                                        return;
                                    }
                                    if (val.endsWith(' ') || val.endsWith(',')) {
                                        const cleanVal = val.replace(/,/g, ' ').replace(/\s+/g, ' ');
                                        const words = cleanVal.trim().split(' ');
                                        const formatted = words.map(w => w.startsWith('#') ? w : '#' + w).join(' ');
                                        setTags(formatted + ' ');
                                    } else {
                                        setTags(val);
                                    }
                                }}
                                className="w-full h-11 px-4 rounded-xl border border-edge bg-canvas text-alabaster text-sm placeholder:text-mist/40 focus:outline-none focus:border-ochre transition-all font-mono"
                            />

                            {/* Smart Suggestions */}
                            {category && SUGGESTED_TAGS[category] && (
                                <div className="space-y-2 pt-1">
                                    <p className="text-[10px] font-mono uppercase tracking-wider text-mist flex items-center gap-1.5">
                                        <Sparkles className="h-3 w-3 text-ochre" />
                                        Suggested for {category}:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {SUGGESTED_TAGS[category].map(tag => {
                                            const hashTag = `#${tag}`;
                                            const isSelected = tags.includes(hashTag);
                                            return (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isSelected) return;
                                                        setTags(prev => prev.trim() + (prev ? ' ' : '') + hashTag + ' ');
                                                    }}
                                                    disabled={isSelected}
                                                    className={cn(
                                                        "text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all duration-200",
                                                        isSelected
                                                            ? "bg-canvas text-mist/40 border-edge cursor-default"
                                                            : "bg-canvas border-edge text-mist hover:text-ochre hover:border-ochre/40"
                                                    )}
                                                >
                                                    {hashTag}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Captcha onVerify={setIsVerified} />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-edge">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-full border border-edge bg-surface hover:bg-surface-elevated text-xs font-mono uppercase tracking-wider text-mist hover:text-alabaster transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-full bg-ochre hover:bg-ochre-light disabled:opacity-50 text-canvas font-medium text-xs font-mono uppercase tracking-widest transition-all shadow-md"
                        >
                            {isSubmitting ? (uploadStatusMsg || "Archiving Series...") : "Publish to Archive"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
