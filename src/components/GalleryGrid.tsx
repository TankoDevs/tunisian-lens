import React from 'react';
import { MapPin, Maximize2 } from 'lucide-react';
import type { PhotoItem } from '../types/photo';

interface GalleryGridProps {
  photos: PhotoItem[];
  onPhotoClick: (photo: PhotoItem) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, onPhotoClick }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-4 md:px-8 max-w-7xl mx-auto">
      {photos.map((photo) => (
        <div
          key={photo.id}
          onClick={() => onPhotoClick(photo)}
          className="break-inside-avoid relative mb-6 group cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-zinc-700"
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
          {/* Aspect-ratio container preventing Cumulative Layout Shift (CLS) */}
          <div className={`w-full overflow-hidden ${photo.aspectRatio} bg-zinc-950`}>
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              loading="lazy"
              width="480"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>

          {/* Hover Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
                  {photo.region}
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5">{photo.title}</h3>
                <div className="flex items-center gap-1 text-xs text-sky-400 mt-1">
                  <MapPin size={13} />
                  <span>{photo.locationName}</span>
                </div>
              </div>

              <div className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white group-hover:bg-sky-600 transition">
                <Maximize2 size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
