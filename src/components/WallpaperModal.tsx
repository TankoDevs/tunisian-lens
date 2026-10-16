import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Square, Download, X, Loader2, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

type AspectPreset = 'mobile' | 'desktop' | 'square';

export const WallpaperModal: React.FC<WallpaperModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  const [selectedFormat, setSelectedFormat] = useState<AspectPreset>('mobile');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const downloadWallpaper = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
          // If crossOrigin anonymous fails due to strict CORS, retry with proxy or direct
          const fallback = new Image();
          fallback.src = imageUrl;
          fallback.onload = resolve;
          fallback.onerror = reject;
        };
      });

      let targetW = 1080;
      let targetH = 1920; // Mobile default (9:16)

      if (selectedFormat === 'desktop') {
        targetW = 3840; // 4K 16:9
        targetH = 2160;
      } else if (selectedFormat === 'square') {
        targetW = 2048; // 1:1 High Res
        targetH = 2048;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Center crop with cover scaling
      const imgRatio = img.width / img.height;
      const targetRatio = targetW / targetH;
      let renderW = targetW;
      let renderH = targetH;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
        renderW = targetH * imgRatio;
        offsetX = -(renderW - targetW) / 2;
      } else {
        renderH = targetW / imgRatio;
        offsetY = -(renderH - targetH) / 2;
      }

      // Render image on canvas
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      // Subtle curatorial watermark at bottom of wallpaper
      const fontSize = Math.max(16, Math.round(targetH * 0.016));
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = `500 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fillText(`Tunisian Lens • ${title}`, targetW / 2, targetH - Math.round(targetH * 0.03));

      // Trigger direct download
      const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `tunisian-lens-${sanitizedTitle}-${selectedFormat}.jpg`;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.94);

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Wallpaper render failed:', err);
      alert('Could not render wallpaper. Please ensure image is accessible.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md bg-surface border border-edge rounded-3xl p-6 md:p-7 text-alabaster shadow-2xl smooth-gpu"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-canvas/80 text-mist hover:text-alabaster hover:bg-canvas transition border border-edge/60"
            aria-label="Close wallpaper modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ochre font-bold flex items-center gap-1">
              <Sparkles size={12} /> Canvas Rendering Engine
            </span>
          </div>

          <h3 className="text-xl font-serif font-normal text-alabaster">Download Device Wallpaper</h3>
          <p className="text-xs text-mist font-light mt-1">
            Select the aspect ratio crop formatted for your device:
          </p>

          {/* Format Selector Grid */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <button
              onClick={() => setSelectedFormat('mobile')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs gap-2 transition-all duration-200 ${
                selectedFormat === 'mobile'
                  ? 'border-ochre bg-ochre/15 text-alabaster shadow-lg shadow-ochre/15 scale-102 font-medium'
                  : 'border-edge bg-canvas/60 text-mist hover:border-edge/80 hover:text-alabaster'
              }`}
            >
              <Smartphone size={22} className={selectedFormat === 'mobile' ? 'text-ochre' : 'text-mist'} />
              <span className="font-medium text-[11px]">Mobile</span>
              <span className="text-[9px] font-mono text-mist/70">9:16 HD</span>
            </button>

            <button
              onClick={() => setSelectedFormat('desktop')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs gap-2 transition-all duration-200 ${
                selectedFormat === 'desktop'
                  ? 'border-ochre bg-ochre/15 text-alabaster shadow-lg shadow-ochre/15 scale-102 font-medium'
                  : 'border-edge bg-canvas/60 text-mist hover:border-edge/80 hover:text-alabaster'
              }`}
            >
              <Monitor size={22} className={selectedFormat === 'desktop' ? 'text-ochre' : 'text-mist'} />
              <span className="font-medium text-[11px]">Desktop</span>
              <span className="text-[9px] font-mono text-mist/70">16:9 4K</span>
            </button>

            <button
              onClick={() => setSelectedFormat('square')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs gap-2 transition-all duration-200 ${
                selectedFormat === 'square'
                  ? 'border-ochre bg-ochre/15 text-alabaster shadow-lg shadow-ochre/15 scale-102 font-medium'
                  : 'border-edge bg-canvas/60 text-mist hover:border-edge/80 hover:text-alabaster'
              }`}
            >
              <Square size={22} className={selectedFormat === 'square' ? 'text-ochre' : 'text-mist'} />
              <span className="font-medium text-[11px]">Square</span>
              <span className="text-[9px] font-mono text-mist/70">1:1 Square</span>
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={downloadWallpaper}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-ochre hover:bg-ochre-light disabled:opacity-50 text-canvas rounded-2xl text-xs uppercase tracking-wider font-semibold transition shadow-xl shadow-ochre/20"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Rasterizing High-Res Canvas...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check size={16} />
                <span>Wallpaper Downloaded!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download {selectedFormat.toUpperCase()} Crop</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
