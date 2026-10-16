import React, { useState, useEffect } from 'react';
import { Heart, Repeat2, Share2, Check, Download } from 'lucide-react';
import { supabase, isConfigured } from '../lib/supabaseClient';

interface SocialActionBarProps {
  photoId: string;
  initialLikes?: number;
  initialReposts?: number;
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
  title: string;
  onOpenWallpaper: () => void;
}

export const SocialActionBar: React.FC<SocialActionBarProps> = ({
  photoId,
  initialLikes = 0,
  initialReposts = 0,
  isLikedByUser = false,
  isRepostedByUser = false,
  title,
  onOpenWallpaper,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(() => {
    try {
      return isLikedByUser || localStorage.getItem(`tl_liked_${photoId}`) === 'true';
    } catch {
      return isLikedByUser;
    }
  });
  const [reposts, setReposts] = useState(initialReposts);
  const [hasReposted, setHasReposted] = useState(() => {
    try {
      return isRepostedByUser || localStorage.getItem(`tl_reposted_${photoId}`) === 'true';
    } catch {
      return isRepostedByUser;
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    setReposts(initialReposts);
  }, [initialReposts]);

  const handleLike = async () => {
    const nextState = !hasLiked;
    // Optimistic UI update
    setHasLiked(nextState);
    setLikes(prev => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    try {
      localStorage.setItem(`tl_liked_${photoId}`, String(nextState));
    } catch {
      // ignore storage quota error
    }

    if (isConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Keep optimistic local state or prompt
          return;
        }

        const { error } = await supabase.rpc('toggle_like', {
          p_photo_id: photoId,
          p_user_id: user.id,
        });

        if (error) {
          console.warn('Like toggle sync error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase toggle_like exception:', err);
      }
    }
  };

  const handleRepost = async () => {
    const nextState = !hasReposted;
    // Optimistic UI update
    setHasReposted(nextState);
    setReposts(prev => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    try {
      localStorage.setItem(`tl_reposted_${photoId}`, String(nextState));
    } catch {
      // ignore
    }

    if (isConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.rpc('toggle_repost', {
          p_photo_id: photoId,
          p_user_id: user.id,
        });

        if (error) {
          console.warn('Repost toggle sync error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase toggle_repost exception:', err);
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/photo/${photoId}`
      : `https://tunisian-lens.pages.dev/photo/${photoId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Tunisian Lens`,
          text: `Check out this capture of "${title}" on Tunisian Lens Archive!`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled share or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center justify-between py-3 my-3 border-y border-edge text-mist select-none">
      <div className="flex items-center gap-5 sm:gap-6">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`group flex items-center gap-1.5 transition-colors duration-200 ${
            hasLiked ? 'text-rose-500' : 'hover:text-rose-400'
          }`}
          title={hasLiked ? 'Unlike' : 'Like'}
          aria-label="Like plate"
        >
          <Heart
            size={18}
            className={`transition-transform duration-200 group-hover:scale-110 ${
              hasLiked ? 'fill-current scale-105' : ''
            }`}
          />
          <span className="text-xs font-mono font-medium">{likes}</span>
        </button>

        {/* Repost Button */}
        <button
          onClick={handleRepost}
          className={`group flex items-center gap-1.5 transition-colors duration-200 ${
            hasReposted ? 'text-emerald-400' : 'hover:text-emerald-400'
          }`}
          title={hasReposted ? 'Remove repost' : 'Repost to collection'}
          aria-label="Repost plate"
        >
          <Repeat2
            size={18}
            className={`transition-transform duration-200 group-hover:rotate-12 ${
              hasReposted ? 'scale-105' : ''
            }`}
          />
          <span className="text-xs font-mono font-medium">{reposts}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="group flex items-center gap-1.5 hover:text-ochre transition-colors duration-200"
          title="Share direct link"
          aria-label="Share plate"
        >
          {copied ? (
            <Check size={18} className="text-emerald-400 animate-in zoom-in-75 duration-150" />
          ) : (
            <Share2 size={18} className="group-hover:scale-110 transition-transform" />
          )}
          <span className="text-xs font-mono font-medium">{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Dynamic Wallpaper Generator Trigger */}
      <button
        onClick={onOpenWallpaper}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ochre/10 border border-ochre/25 text-ochre hover:bg-ochre/20 hover:border-ochre/40 text-xs font-medium transition shadow-sm"
        title="Crop & Download Wallpaper"
        aria-label="Download device wallpaper"
      >
        <Download size={14} />
        <span>Wallpapers</span>
      </button>
    </div>
  );
};
