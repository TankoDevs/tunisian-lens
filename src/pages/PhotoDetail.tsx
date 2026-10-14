import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, User, Share2, Check, Sparkles } from 'lucide-react';
import { getPhotoBySlug, CULTURAL_PHOTOS } from '../data/photos';
import type { PhotoItem } from '../types/photo';
import { GalleryGrid } from '../components/GalleryGrid';
import { PhotoModal } from '../components/PhotoModal';

export const PhotoDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [modalPhoto, setModalPhoto] = useState<PhotoItem | null>(null);
  const [copied, setCopied] = useState(false);

  const photo = slug ? getPhotoBySlug(slug) : undefined;

  if (!photo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-canvas text-white">
        <h1 className="text-3xl font-serif font-bold text-white mb-3">Photograph Not Found</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          The requested cultural photograph or story could not be located in our archive.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sidi text-white text-sm font-semibold hover:bg-sidi/90 transition"
        >
          <ArrowLeft size={16} /> Return to Stories
        </Link>
      </div>
    );
  }

  const relatedPhotos = CULTURAL_PHOTOS.filter(
    (p) => p.region === photo.region && p.id !== photo.id
  ).slice(0, 3);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://tunisian-lens.pages.dev/photo/${photo.slug}`;

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
        // Fallback
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-canvas min-h-screen text-white pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition py-2"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-surface border border-edge text-zinc-300 hover:text-white hover:border-zinc-700 transition"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share Story'}</span>
          </button>
        </div>

        {/* Hero Deep-View Card */}
        <div className="relative flex flex-col lg:flex-row w-full bg-surface border border-edge rounded-3xl overflow-hidden shadow-2xl mb-16">
          {/* Main Visual */}
          <div className="lg:w-2/3 bg-black flex items-center justify-center p-4 md:p-8">
            <div className={`w-full max-h-[82vh] overflow-hidden rounded-xl`}>
              <img
                src={photo.fullImageUrl}
                alt={photo.title}
                className="w-full h-full object-contain max-h-[80vh] mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Context Sidebar */}
          <div className="lg:w-1/3 p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-edge bg-surface">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-ochre">
                  <MapPin size={14} />
                  <span>{photo.locationName}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sidi/10 text-sidi border border-sidi/20">
                  {photo.region}
                </span>
              </div>

              <h1 className="text-3xl font-serif font-bold text-white mt-3 leading-tight">
                {photo.title}
              </h1>

              <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
                <User size={14} />
                <span>
                  Photographed by <strong className="text-white">{photo.author.name}</strong> (
                  <span className="text-sidi">{photo.author.handle}</span>)
                </span>
              </div>

              <div className="my-6 border-t border-edge" />

              <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                The Story
              </h2>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                {photo.story}
              </p>

              {photo.exif && (
                <div className="mt-6 bg-black/40 border border-edge rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sidi mb-3">
                    <Camera size={14} />
                    <span>Technical EXIF & Optics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-zinc-300">
                    <div>
                      <span className="text-zinc-500">Camera:</span> {photo.exif.camera || '—'}
                    </div>
                    <div>
                      <span className="text-zinc-500">Lens:</span> {photo.exif.lens || '—'}
                    </div>
                    <div>
                      <span className="text-zinc-500">Aperture:</span> {photo.exif.aperture || '—'}
                    </div>
                    <div>
                      <span className="text-zinc-500">Shutter:</span> {photo.exif.shutterSpeed || '—'}
                    </div>
                    <div>
                      <span className="text-zinc-500">Focal:</span> {photo.exif.focalLength || '—'}
                    </div>
                    <div>
                      <span className="text-zinc-500">ISO:</span> {photo.exif.iso || '—'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-4 border-t border-edge">
              <div className="flex flex-wrap gap-1.5">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-canvas text-zinc-400 border border-edge"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Regional Photography */}
        {relatedPhotos.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-ochre tracking-widest flex items-center gap-1.5">
                  <Sparkles size={13} /> More from {photo.region}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  Cultural Perspectives
                </h3>
              </div>
              <Link
                to="/"
                className="text-xs font-semibold text-sidi hover:underline underline-offset-4"
              >
                View all stories →
              </Link>
            </div>

            <GalleryGrid photos={relatedPhotos} onPhotoClick={(p) => setModalPhoto(p)} />
          </div>
        )}
      </div>

      {modalPhoto && (
        <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
      )}
    </div>
  );
};
