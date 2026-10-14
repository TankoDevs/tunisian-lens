import { supabase, isConfigured } from './supabaseClient';
import { detectImageMetadata } from '../utils/exifDetector';
import type { TunisianRegion } from '../types/photo';

export interface PhotoUploadPayload {
  file: File;
  title: string;
  story: string;
  region: TunisianRegion;
  locationName: string;
  tags?: string[];
  userId?: string;
}

export interface ModerationResult {
  isSafe: boolean;
  suggestedTags: string[];
  status: 'published' | 'flagged';
}

/**
 * Runs automated moderation & auto-tagging via Cloudflare Pages Function /api/detect
 */
export async function moderateImage(imageUrl: string, title?: string): Promise<ModerationResult> {
  try {
    const res = await fetch('/api/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, title }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        isSafe: data.isSafe ?? true,
        suggestedTags: data.suggestedTags ?? ['tunisia', 'heritage', 'photography'],
        status: data.status ?? (data.isSafe === false ? 'flagged' : 'published'),
      };
    }
  } catch (err) {
    console.warn('API detection call failed, using safe fallback:', err);
  }

  return {
    isSafe: true,
    suggestedTags: ['tunisia', 'heritage', 'photography'],
    status: 'published',
  };
}

/**
 * Complete upload pipeline:
 * 1. Extracts EXIF in browser
 * 2. Uploads file to Supabase Storage bucket 'photos'
 * 3. Runs AI moderation / detection
 * 4. Inserts record into Supabase 'photos' table
 */
export async function uploadCulturalPhoto(payload: PhotoUploadPayload, onProgress?: (msg: string) => void) {
  const { file, title, story, region, locationName, tags = [], userId } = payload;

  // Step 1: Detect EXIF in browser
  onProgress?.('Extracting camera EXIF & optics metadata...');
  const exif = await detectImageMetadata(file);

  // Step 2: Storage upload
  onProgress?.('Uploading image to secure storage...');
  let imageUrl = '';
  let storagePath = '';

  if (isConfigured && supabase) {
    const fileExt = file.name.split('.').pop() || 'webp';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    storagePath = `${userId || 'anonymous'}/${Date.now()}_${cleanFileName}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(uploadData.path);

    imageUrl = publicUrlData.publicUrl;
    storagePath = uploadData.path;
  } else {
    // Development / preview fallback when Supabase env vars are not yet linked
    imageUrl = URL.createObjectURL(file);
    storagePath = `mock/${file.name}`;
  }

  // Step 3: Automated Content Moderation & AI Tag Suggestion
  onProgress?.('Running AI content moderation & tag inspection...');
  const moderation = await moderateImage(imageUrl, title);

  const combinedTags = Array.from(new Set([...tags, ...moderation.suggestedTags]));

  // Step 4: Insert record into database
  onProgress?.('Saving photo record to database...');
  let recordId = crypto.randomUUID();

  if (isConfigured && supabase && userId) {
    const { data: insertData, error: insertError } = await supabase
      .from('photos')
      .insert({
        user_id: userId,
        title,
        story,
        region,
        location_name: locationName,
        image_url: imageUrl,
        storage_path: storagePath,
        aspect_ratio: exif.aspectRatio || 'aspect-[4/5]',
        status: moderation.status,
        tags: combinedTags,
        camera: exif.camera,
        lens: exif.lens,
        aperture: exif.aperture,
        shutter_speed: exif.shutterSpeed,
        focal_length: exif.focalLength,
        iso: exif.iso,
        latitude: exif.latitude,
        longitude: exif.longitude,
      })
      .select('id')
      .single();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }
    if (insertData?.id) {
      recordId = insertData.id;
    }
  }

  onProgress?.('Upload complete!');

  return {
    success: true,
    photoId: recordId,
    imageUrl,
    exif,
    moderation,
    tags: combinedTags,
  };
}
