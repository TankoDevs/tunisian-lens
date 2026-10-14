import type { PhotoItem } from '../types/photo';
import photosData from './photos.json';

export const CULTURAL_PHOTOS: PhotoItem[] = photosData as PhotoItem[];

export function getPhotoBySlug(slug: string): PhotoItem | undefined {
  return CULTURAL_PHOTOS.find((p) => p.slug === slug);
}

export function getPhotosByRegion(region: string): PhotoItem[] {
  if (!region || region === 'All') return CULTURAL_PHOTOS;
  return CULTURAL_PHOTOS.filter((p) => p.region === region);
}
