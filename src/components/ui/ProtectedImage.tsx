import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { useAntiScreenshot } from '../../context/AntiScreenshotContext';
import { cn } from '../../lib/utils';

interface ProtectedImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  imgClassName?: string;
  watermarkAuthor?: string;
  watermarkTitle?: string;
  watermarkLocation?: string;
  watermarkId?: string;
  showWatermark?: boolean;
  showFineTile?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-[4/5]',
  className = '',
  imgClassName = '',
  watermarkAuthor,
  watermarkTitle,
  watermarkLocation,
  watermarkId,
  showWatermark = true,
  showFineTile = true,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isShieldActive, triggerShield } = useAntiScreenshot();

  const handleInterceptAction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerShield('Direct image saving and drag-copying are restricted');
  };

  const idTag = watermarkId || (watermarkTitle ? `TL-${Math.abs(watermarkTitle.split('').reduce((a, b) => a + b.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(4, '0')}` : 'TL-ARCHIVE');

  return (
    <div
      data-protected-image="true"
      className={cn(
        'relative overflow-hidden protected-image-container select-none',
        aspectRatio,
        className
      )}
      onContextMenu={handleInterceptAction}
      onDragStart={handleInterceptAction}
    >
      {/* Shimmer loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 shimmer-placeholder z-0" />
      )}

      {/* The Raw Protected Photograph */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        draggable={false}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={onError}
        className={cn(
          'w-full h-full object-cover pointer-events-none select-none transition-all duration-700 ease-out',
          isLoaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-[1.03] blur-sm',
          isShieldActive && 'blur-xl brightness-50 contrast-125 transition-all duration-150',
          imgClassName
        )}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
        }}
      />

      {/* Repeating Diagonal Micro-Pattern Watermark */}
      {showFineTile && isLoaded && (
        <div 
          className="absolute inset-0 watermark-pattern pointer-events-none z-10 opacity-70"
          aria-hidden="true"
        />
      )}

      {/* Curatorial Provenance Watermark Ribbon */}
      {showWatermark && isLoaded && (
        <div 
          className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-alabaster shadow-md"
          aria-hidden="true"
        >
          <Shield size={10} className="text-ochre shrink-0" />
          <span className="text-[9px] font-mono tracking-wider uppercase text-mist/90">
            {watermarkAuthor ? `© ${watermarkAuthor}` : '© Tunisian Lens'}{watermarkLocation ? ` · ${watermarkLocation}` : ''} • <span className="text-ochre">{idTag}</span>
          </span>
        </div>
      )}

      {/* Transparent Click & Drag Shield (Prevents right-click and save-as) */}
      <div
        className="absolute inset-0 z-30 pointer-events-auto cursor-pointer"
        onContextMenu={handleInterceptAction}
        onDragStart={handleInterceptAction}
        aria-hidden="true"
      />

      {/* Security Privacy Veil when Snipping / Shield is active */}
      {isShieldActive && (
        <div className="absolute inset-0 z-40 bg-canvas/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center border border-ochre/30">
          <div className="w-10 h-10 rounded-full bg-ochre/20 text-ochre flex items-center justify-center mb-2 border border-ochre/40 shadow-lg shadow-ochre/15">
            <Lock size={18} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ochre font-bold">
            Archival Protected Plate
          </span>
          <p className="text-[11px] text-mist max-w-xs mt-1">
            Screen capture obscured by Tunisian Lens Heritage Security.
          </p>
        </div>
      )}
    </div>
  );
};
