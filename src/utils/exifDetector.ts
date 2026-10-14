import exifr from 'exifr';

export interface DetectedPhotoMeta {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  latitude?: number;
  longitude?: number;
  captureDate?: Date;
  width?: number;
  height?: number;
  aspectRatio?: 'aspect-[3/4]' | 'aspect-[4/5]' | 'aspect-[16/9]' | 'aspect-square';
}

export async function detectImageMetadata(file: File): Promise<DetectedPhotoMeta> {
  try {
    const rawData = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
    });

    if (!rawData) return {};

    // Calculate aspect ratio helper
    let calculatedRatio: 'aspect-[3/4]' | 'aspect-[4/5]' | 'aspect-[16/9]' | 'aspect-square' | undefined;
    const width = rawData.ImageWidth || rawData.ExifImageWidth;
    const height = rawData.ImageHeight || rawData.ExifImageHeight;

    if (width && height) {
      const ratio = width / height;
      if (Math.abs(ratio - 1) < 0.1) {
        calculatedRatio = 'aspect-square';
      } else if (Math.abs(ratio - 16 / 9) < 0.2 || Math.abs(ratio - 9 / 16) < 0.2) {
        calculatedRatio = 'aspect-[16/9]';
      } else if (Math.abs(ratio - 4 / 5) < 0.15 || Math.abs(ratio - 5 / 4) < 0.15) {
        calculatedRatio = 'aspect-[4/5]';
      } else {
        calculatedRatio = 'aspect-[3/4]';
      }
    }

    return {
      camera: rawData.Model ? `${rawData.Make || ''} ${rawData.Model}`.trim() : undefined,
      lens: rawData.LensModel,
      focalLength: rawData.FocalLength ? `${Math.round(rawData.FocalLength)}mm` : undefined,
      aperture: rawData.FNumber ? `f/${rawData.FNumber}` : undefined,
      shutterSpeed: rawData.ExposureTime
        ? (rawData.ExposureTime < 1
            ? `1/${Math.round(1 / rawData.ExposureTime)}s`
            : `${rawData.ExposureTime}s`)
        : undefined,
      iso: rawData.ISO,
      latitude: rawData.latitude,
      longitude: rawData.longitude,
      captureDate: rawData.DateTimeOriginal,
      width,
      height,
      aspectRatio: calculatedRatio,
    };
  } catch (error) {
    console.warn('Could not extract EXIF data:', error);
    return {};
  }
}
