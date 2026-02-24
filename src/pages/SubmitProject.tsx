import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Upload, X, Lock, Unlock, ShieldAlert, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/mockData";
import { cn } from "../lib/utils";
import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { Captcha } from "../components/ui/Captcha";
import { uploadImage } from "../lib/cloudinary";

import { checkImageSafety } from "../lib/api";

export function SubmitProject() {
    const { addProject } = useProjects();
    const { isAuthenticated } = useAuth();
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
            setIsDownloadable(true); // Private work is automatically downloadable
            if (!generatedCode) {
                // Generate a random 6-char code
                const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 for clarity
                let result = '';
                for (let i = 0; i < 6; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                // Add hyphen for readability: ABC-DEF
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

        // Simulation interval for UI beauty while API works
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 90) return 90; // Hold at 90 until API returns
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

                // Still keep the low confidence hint for generic names for extra transparency
                const genericPatterns = ['untitled', 'image', 'photo', 'download', 'img_', 'dsc', 'asset', 'screenshot'];
                if (genericPatterns.some(p => file.name.toLowerCase().includes(p))) {
                    setLowConfidence(true);
                }
            }
        } catch (error) {
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

    const handleFile = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setSelectedImage(e.target?.result as string);
        reader.readAsDataURL(file);

        // Trigger Scan
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

            // Real Upload to Cloudinary
            if (imageFile) {
                try {
                    const uploadedUrl = await uploadImage(imageFile);
                    imageUrl = uploadedUrl;
                } catch (uploadError) {
                    console.error("Cloudinary upload failed:", uploadError);
                    showAlert("Image upload failed. Using local preview for submission.", "warning");
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
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            showAlert("Failed to publish project. Please try again.", "error");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl bg-background min-h-screen relative">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold">Upload Project</h1>
                    <p className="text-muted-foreground">Share your visual story with the community.</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit} noValidate>

                    {/* Image Upload Area */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Project Image</label>
                        <div
                            className={cn(
                                "group relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out overflow-hidden touch-none",
                                dragActive
                                    ? "border-primary bg-primary/5 scale-[0.99]"
                                    : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30",
                                selectedImage && "border-none p-0"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {selectedImage ? (
                                <div className="relative w-full h-full min-h-[300px] overflow-hidden rounded-xl">
                                    <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />

                                    {/* AI & SAFETY SCANNING OVERLAY */}
                                    {isScanning && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                                            <div className="w-64 space-y-4">
                                                <div className="flex items-center justify-between text-white text-sm font-medium">
                                                    <span>Safety & AI Scan...</span>
                                                    <span>{scanProgress}%</span>
                                                </div>
                                                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-100 ease-linear"
                                                        style={{ width: `${scanProgress}% ` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-white/70 text-center animate-pulse">
                                                    Checking for content safety violations...
                                                </p>
                                            </div>
                                            {/* Scanning Line Animation */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent w-full h-[50%] animate-scan" />
                                        </div>
                                    )}

                                    {/* SAFETY VIOLATION WARNING */}
                                    {safetyResult === 'unsafe' && (
                                        <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center z-30 backdrop-blur-md p-6 text-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                                                <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Inappropriate Content</h3>
                                            <p className="text-red-100 text-sm mb-6 max-w-sm">
                                                This image has been flagged for violating our community safety standards (18+, offensive, or harmful content).
                                                <br /><br />
                                                <strong>We maintain a safe and respectful environment for all.</strong>
                                            </p>
                                            <Button
                                                variant="destructive"
                                                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setSafetyResult(null); }}
                                            >
                                                Remove & Upload Safe Image
                                            </Button>
                                        </div>
                                    )}

                                    {/* AI DETECTED WARNING */}
                                    {scanResult === 'ai-detected' && safetyResult !== 'unsafe' && (
                                        <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center z-20 backdrop-blur-md p-6 text-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                                <ShieldAlert className="w-8 h-8 text-red-500" strokeWidth={2} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">AI Content Detected</h3>
                                            <p className="text-red-100 text-sm mb-6 max-w-sm">
                                                Our systems have detected distinctive patterns associated with generative AI.
                                                <br /><br />
                                                <strong>Tunisian Lens is a platform for human artists only.</strong>
                                            </p>
                                            <Button
                                                variant="destructive"
                                                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setScanResult(null); }}
                                            >
                                                Remove & Upload Original
                                            </Button>
                                        </div>
                                    )}

                                    {/* VERIFIED BADGE */}
                                    {scanResult === 'safe' && safetyResult === 'safe' && !isScanning && (
                                        <div className="absolute bottom-4 left-4 bg-green-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10 animate-in fade-in slide-in-from-bottom-2">
                                            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                                            Metadata Verified: Safe & Human
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <p className="text-white font-medium">Click or Drag to Replace</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-4 right-4 h-9 w-9 rounded-full shadow-lg hover:scale-105 transition-transform z-30"
                                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setScanResult(null); setSafetyResult(null); setLowConfidence(false); }}
                                    >
                                        <X className="h-5 w-5" strokeWidth={2} />
                                    </Button>
                                </div>
                            ) : (
                                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full py-12 px-4 cursor-pointer">
                                    <div className={cn(
                                        "flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-muted transition-all duration-300 group-hover:scale-110",
                                        dragActive && "bg-primary/20 scale-110"
                                    )}>
                                        <Upload className={cn(
                                            "w-10 h-10 text-muted-foreground transition-colors",
                                            dragActive ? "text-primary" : "group-hover:text-foreground"
                                        )} strokeWidth={2} />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-medium">
                                            <span className="text-primary">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            High-quality JPG, PNG, or GIF recommended.
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 pt-2">
                                            No explicit size limit, but larger files take longer to process.
                                        </p>
                                    </div>
                                    <input id="image-upload" type="file" className="hidden" onChange={handleChange} accept="image/*" />
                                </label>
                            )}
                        </div>

                        {/* Metadata Confidence Warning (Generic Filename) */}
                        <AnimatePresence>
                            {lowConfidence && selectedImage && !isScanning && scanResult === 'safe' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start"
                                >
                                    <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" strokeWidth={2} />
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-amber-700">Metadata Confidence: Low</p>
                                        <p className="text-xs text-amber-600/80 leading-relaxed">
                                            This file has a generic name or missing metadata. Automated scans are less effective on generic files.
                                            <br />
                                            <strong>Please ensure you are uploading original, human-created artwork.</strong>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Certification Checkbox */}
                    <div
                        className={cn(
                            "p-4 rounded-xl border transition-all cursor-pointer flex gap-3",
                            isCertified
                                ? "bg-primary/5 border-primary/20"
                                : "bg-card border-border hover:border-muted-foreground/25"
                        )}
                        onClick={() => setIsCertified(!isCertified)}
                    >
                        <div className={cn(
                            "w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors",
                            isCertified ? "bg-primary border-primary" : "border-muted-foreground/30"
                        )}>
                            {isCertified && <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2} />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Human Artist Certification</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                I certify that this work is my own original creation and was not generated by AI or automated tools.
                                I understand that uploading AI-generated content violates our terms.
                            </p>
                        </div>
                    </div>

                    {/* Toggles: Visibility & Downloads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Private Toggle */}
                        <div
                            className={cn(
                                "relative overflow-hidden rounded-xl border transition-all duration-300",
                                isPrivate
                                    ? "bg-primary/5 border-primary/20 shadow-sm"
                                    : "bg-card border-border hover:border-muted-foreground/25"
                            )}
                        >
                            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => togglePrivate(!isPrivate)}>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-full transition-colors",
                                        isPrivate ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                    )}>
                                        {isPrivate ? <Lock className="h-5 w-5" strokeWidth={2} /> : <Unlock className="h-5 w-5" strokeWidth={2} />}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">Private Work</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Hidden from gallery.
                                        </p>
                                    </div>
                                </div>

                                <div className={cn(
                                    "w-10 h-5 bg-muted rounded-full relative transition-colors duration-200",
                                    isPrivate && "bg-primary"
                                )}>
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200",
                                        isPrivate && "translate-x-5"
                                    )} />
                                </div>
                            </div>

                            {/* Expandable Code Section */}
                            <div className={cn(
                                "grid transition-all duration-300 ease-in-out",
                                isPrivate ? "grid-rows-[1fr] opacity-100 pb-3" : "grid-rows-[0fr] opacity-0"
                            )}>
                                <div className="overflow-hidden px-4">
                                    <div className="bg-background border rounded-lg p-2 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                                            Access Code
                                        </span>
                                        <div className="text-lg font-mono font-bold tracking-widest text-primary select-all">
                                            {generatedCode}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Downloadable Toggle */}
                        <div
                            className={cn(
                                "relative overflow-hidden rounded-xl border transition-all duration-300",
                                isDownloadable
                                    ? "bg-primary/5 border-primary/20 shadow-sm"
                                    : "bg-card border-border hover:border-muted-foreground/25",
                                isPrivate && "opacity-80 grayscale-[0.2]"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-between p-4",
                                    !isPrivate ? "cursor-pointer" : "cursor-not-allowed"
                                )}
                                onClick={() => !isPrivate && setIsDownloadable(!isDownloadable)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-full transition-colors",
                                        isDownloadable ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                    )}>
                                        <Download className="h-5 w-5" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">Downloadable</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {isPrivate ? "Automatic for private work." : (isDownloadable ? "Users can download." : "Download restricted.")}
                                        </p>
                                    </div>
                                </div>

                                <div className={cn(
                                    "w-10 h-5 bg-muted rounded-full relative transition-colors duration-200",
                                    isDownloadable && "bg-primary"
                                )}>
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200",
                                        isDownloadable && "translate-x-5"
                                    )} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Project Title <span className="text-red-500">*</span></label>
                            <Input
                                id="title"
                                placeholder="e.g. Sunset in Sidi Bou Said"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="" disabled>Select a category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <textarea
                                id="description"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                placeholder="Tell us about the location, the lighting, the moment..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="tags" className="text-sm font-medium">Tags (space separated, auto-hashtag)</label>
                            <Input
                                id="tags"
                                placeholder="#summer #sea"
                                value={tags}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Allow user to delete
                                    if (val.length < tags.length) {
                                        setTags(val);
                                        return;
                                    }

                                    // If space or comma, format previous word
                                    if (val.endsWith(' ') || val.endsWith(',')) {
                                        const cleanVal = val.replace(/,/g, ' ').replace(/\s+/g, ' ');
                                        const words = cleanVal.trim().split(' ');
                                        const formatted = words.map(w => w.startsWith('#') ? w : '#' + w).join(' ');
                                        // Ensure space at end for next word
                                        setTags(formatted + ' ');
                                    } else {
                                        setTags(val);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="pt-4 pb-2">
                        <Captcha onVerify={setIsVerified} />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Publishing..." : "Publish Project"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
