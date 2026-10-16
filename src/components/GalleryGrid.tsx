import React from 'react';
import { MapPin, Maximize2, ShieldCheck, Heart, Repeat2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PhotoItem } from '../types/photo';
import { ProtectedImage } from './ui/ProtectedImage';

interface GalleryGridProps {
  photos: PhotoItem[];
  onPhotoClick: (photo: PhotoItem) => void;
}

function GalleryCard({ photo, onPhotoClick }: { photo: PhotoItem; onPhotoClick: (photo: PhotoItem) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onPhotoClick(photo)}
      className="break-inside-avoid relative mb-6 group cursor-pointer overflow-hidden rounded-2xl bg-surface border border-edge shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-ochre/40 smooth-gpu"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPhotoClick(photo);
        }
      }}
      aria-label={`View ${photo.title} by ${photo.author.name}`}
    >
      {/* Protected Archival Photo with Dynamic Watermarking */}
      <ProtectedImage
        src={photo.thumbnailUrl}
        alt={photo.title}
        aspectRatio={photo.aspectRatio}
        watermarkAuthor={photo.author.name}
        watermarkTitle={photo.title}
        watermarkLocation={photo.locationName}
        imgClassName="group-hover:scale-105"
      />

      {/* Verified RAW Badge Chip */}
      {photo.isRawVerified && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-ochre/40 text-[9px] font-mono font-bold tracking-wider text-ochre shadow-xl pointer-events-none">
          <ShieldCheck size={11} className="text-ochre" />
          <span>RAW VERIFIED</span>
        </div>
      )}

      {/* Hover Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5 pointer-events-none">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-ochre bg-ochre/15 px-2 py-0.5 rounded border border-ochre/20">
              {photo.region}
            </span>
            <h3 className="text-base font-serif font-normal text-alabaster mt-1.5">{photo.title}</h3>
            <div className="flex items-center gap-1.5 text-xs text-sidi mt-1">
              <MapPin size={12} />
              <span>{photo.locationName}</span>
            </div>

            {/* Social Counts Preview */}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-mist/90 font-mono">
              <span className="flex items-center gap-1">
                <Heart size={11} className="text-rose-400 fill-rose-400/40" />
                {photo.likesCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Repeat2 size={11} className="text-emerald-400" />
                {photo.repostsCount || 0}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-elevated/80 border border-edge/80 backdrop-blur-md text-alabaster group-hover:bg-ochre group-hover:text-canvas transition-colors">
            <Maximize2 size={15} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, onPhotoClick }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-4 md:px-8 max-w-7xl mx-auto">
      <AnimatePresence mode="popLayout">
        {photos.map((photo) => (
          <GalleryCard
            key={photo.id}
            photo={photo}
            onPhotoClick={onPhotoClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

