import React, { useEffect, useState } from 'react';
import { X, MapPin, Camera, User, Share2, Check, ExternalLink } from 'lucide-react';
import type { PhotoItem } from '../types/photo';

interface PhotoModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!photo) return null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/photo/${photo.slug}`
    : `https://tunisian-lens.pages.dev/photo/${photo.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${photo.title} — Tunisian Lens`,
          text: photo.story,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col lg:flex-row w-full max-w-6xl max-h-[92vh] bg-surface border border-edge rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-canvas/80 text-mist hover:text-alabaster transition backdrop-blur-md hover:bg-canvas border border-edge/60"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Media Frame (65% width on desktop) */}
        <div className="lg:w-2/3 bg-black flex items-center justify-center p-4 min-h-[300px] max-h-[50vh] lg:max-h-[88vh]">
          <img
            src={photo.fullImageUrl}
            alt={photo.title}
            className="max-h-[82vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Context & Metadata Sidebar (35% width) */}
        <div className="lg:w-1/3 p-6 md:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-edge bg-surface">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-ochre">
                <MapPin size={13} />
                <span>{photo.locationName}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sidi/10 text-sidi border border-sidi/20">
                {photo.region}
              </span>
            </div>

            <h2 className="text-2xl font-serif font-normal text-alabaster mt-2 leading-tight">
              {photo.title}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-xs text-mist">
              <User size={13} />
              <span>By {photo.author.name} (<span className="text-sidi">{photo.author.handle}</span>)</span>
            </div>

            <div className="my-5 border-t border-edge" />

            <h4 className="text-[11px] uppercase tracking-wider text-ochre font-semibold mb-2">Curatorial Note</h4>
            <p className="text-xs text-mist/90 font-light leading-relaxed">
              {photo.story}
            </p>

            {photo.exif && (
              <div className="mt-5 bg-canvas border border-edge rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-sidi mb-3">
                  <Camera size={13} />
                  <span>Technical EXIF & Optics</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-mist font-mono">
                  <div><span className="text-mist/50">Body:</span> {photo.exif.camera || '—'}</div>
                  <div><span className="text-mist/50">Lens:</span> {photo.exif.lens || '—'}</div>
                  <div><span className="text-mist/50">Aperture:</span> {photo.exif.aperture || '—'}</div>
                  <div><span className="text-mist/50">Shutter:</span> {photo.exif.shutterSpeed || '—'}</div>
                  <div><span className="text-mist/50">Focal:</span> {photo.exif.focalLength || '—'}</div>
                  <div><span className="text-mist/50">ISO:</span> {photo.exif.iso || '—'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer: Tags & Share Button */}
          <div className="mt-6 pt-4 border-t border-edge space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {photo.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-canvas text-mist border border-edge">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-ochre hover:bg-ochre-light text-canvas text-xs font-semibold transition shadow-md shadow-ochre/15"
              >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
                <span>{copied ? 'Link Copied for WhatsApp / Social!' : 'Share Photo Story'}</span>
              </button>
              
              <a
                href={`/photo/${photo.slug}`}
                className="p-2 rounded-lg bg-surface-elevated hover:bg-canvas border border-edge text-mist hover:text-alabaster transition"
                title="Open permalink page"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
