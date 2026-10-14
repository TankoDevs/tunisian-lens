// types/photo.ts
export type TunisianRegion = 'North' | 'Sahel' | 'Tunis & Suburbs' | 'South & Sahara';

export interface PhotoExif {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
}

export interface PhotoItem {
  id: string;
  title: string;
  slug: string;
  region: TunisianRegion;
  locationName: string; // e.g., "Sidi Bou Said, Tunis"
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  thumbnailUrl: string;
  fullImageUrl: string;
  aspectRatio: 'aspect-[3/4]' | 'aspect-[4/5]' | 'aspect-[16/9]' | 'aspect-square';
  story: string;
  tags: string[];
  exif?: PhotoExif;
  capturedAt?: string;
}
