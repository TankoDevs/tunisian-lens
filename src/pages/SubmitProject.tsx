import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Upload, X, Lock, Unlock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "../data/mockData";
import { cn } from "../lib/utils";
import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";

export function SubmitProject() {
    const { addProject } = useProjects();
    const navigate = useNavigate();

    const [dragActive, setDragActive] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI Detection State
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<'safe' | 'ai-detected' | null>(null);
    const [scanProgress, setScanProgress] = useState(0);

    // Auto-generate code when Private is toggled on
    const togglePrivate = (checked: boolean) => {
        setIsPrivate(checked);
        if (checked && !generatedCode) {
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
    };

    const simulateScan = (file: File) => {
        setIsScanning(true);
        setScanProgress(0);
        setScanResult(null);

        // Simulation interval
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5; // Fast scan
            });
        }, 100);

        // Heuristic Check after 2 seconds
        setTimeout(() => {
            clearInterval(interval);
            setScanProgress(100);
            setIsScanning(false);

            // DEMO LOGIC: Check filename for keywords
            const name = file.name.toLowerCase();
            const aiKeywords = ['ai', 'bot', 'gen', 'midjourney', 'dall-e', 'diffusion'];

            const isSuspicious = aiKeywords.some(keyword => name.includes(keyword));

            if (isSuspicious) {
                setScanResult('ai-detected');
            } else {
                setScanResult('safe');
            }
        }, 2500);
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
        const reader = new FileReader();
        reader.onload = (e) => setSelectedImage(e.target?.result as string);
        reader.readAsDataURL(file);

        // Trigger Scan
        simulateScan(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (scanResult === 'ai-detected') {
            alert("Cannot publish AI-generated content.");
            return;
        }

        if (isScanning) {
            alert("Please wait for the AI scan to complete.");
            return;
        }

        if (!title || (!category && !isPrivate) || !selectedImage) {
            // Category is optional if private? Let's keep it required for simplicity, or make it optional.
            // For now, let's say Category is required always for organization.
            if (!category) {
                alert("Please select a category.");
                return;
            }
            if (!title || !selectedImage) {
                alert("Please fill in all required fields (Image, Title)");
                return;
            }
        }

        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            addProject({
                title,
                category,
                image: selectedImage,
                description,
                tags: tags.split(' ').map(tag => tag.replace(/^#/, '').trim()).filter(tag => tag !== ''),
                isPrivate,
                accessCode: isPrivate ? generatedCode : undefined,
            });
            setIsSubmitting(false);

            if (isPrivate) {
                // If private, show success but maybe don't go to Explore immediately, 
                // or go to Explore but filter won't show it.
                // Best UX: Go to Client Access page or Home with a message?
                // For simplicity: Go to Explore, but alert user they won't see it there.
                alert(`Project Published Privately!\nAccess Code: ${generatedCode}\n\nSave this code to give to your client.`);
                navigate('/explore'); // Or /client-access
            } else {
                navigate('/explore');
            }
        }, 800);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl bg-background min-h-screen">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold">Upload Project</h1>
                    <p className="text-muted-foreground">Share your visual story with the community.</p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>

                    {/* Image Upload Area */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Project Image <span className="text-red-500">*</span></label>
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

                                    {/* AI SCANNING OVERLAY */}
                                    {isScanning && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                                            <div className="w-64 space-y-4">
                                                <div className="flex items-center justify-between text-white text-sm font-medium">
                                                    <span>AI Scan in progress...</span>
                                                    <span>{scanProgress}%</span>
                                                </div>
                                                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-100 ease-linear"
                                                        style={{ width: `${scanProgress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-white/70 text-center animate-pulse">
                                                    Analyzing patterns and metadata...
                                                </p>
                                            </div>
                                            {/* Scanning Line Animation */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent w-full h-[50%] animate-scan" />
                                        </div>
                                    )}

                                    {/* AI DETECTED WARNING */}
                                    {scanResult === 'ai-detected' && (
                                        <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center z-20 backdrop-blur-md p-6 text-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                                <ShieldAlert className="w-8 h-8 text-red-500" />
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
                                    {scanResult === 'safe' && !isScanning && (
                                        <div className="absolute bottom-4 left-4 bg-green-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10 animate-in fade-in slide-in-from-bottom-2">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Verified Human Art
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
                                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setScanResult(null); }}
                                    >
                                        <X className="h-5 w-5" />
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
                                        )} />
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
                    </div>

                    {/* Private / Client Delivery Toggle */}
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
                                    {isPrivate ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h3 className="font-medium">Private Client Gallery</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Create a hidden gallery accessible only via a secure code.
                                    </p>
                                </div>
                            </div>

                            {/* Custom Switch UI */}
                            <div className={cn(
                                "w-11 h-6 bg-muted rounded-full relative transition-colors duration-200",
                                isPrivate && "bg-primary"
                            )}>
                                <div className={cn(
                                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200",
                                    isPrivate && "translate-x-5"
                                )} />
                            </div>
                        </div>

                        {/* Expandable Code Section */}
                        <div className={cn(
                            "grid transition-all duration-300 ease-in-out",
                            isPrivate ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"
                        )}>
                            <div className="overflow-hidden px-4">
                                <div className="bg-background border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Your Secure Access Code
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="text-3xl font-mono font-bold tracking-widest text-primary select-all">
                                            {generatedCode}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Share this code with your client to give them access.
                                    </p>
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
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
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
