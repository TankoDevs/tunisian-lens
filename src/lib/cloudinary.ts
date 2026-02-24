/**
 * Cloudinary Image Upload Utility
 * Handles optimized image uploads using unsigned presets.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
}

/**
 * Uploads a file to Cloudinary with automatic optimizations:
 * - Resize max width: 1600px
 * - Convert to WebP
 * - Quality: Auto (Optimized for size/quality balance)
 */
export async function uploadImage(file: File): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error("Cloudinary configuration missing. Please check your .env file.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    // Cloudinary Transformations on upload (optional but cleaner)
    // We can also apply these as URL parameters on retrieval.
    // Here we use eager transformations or upload tags if needed, 
    // but the most efficient way for MVPs is Fetch Format (f_auto) and Quality (q_auto).

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload image to Cloudinary');
        }

        const data: CloudinaryUploadResponse = await response.json();

        // Return optimized URL
        // We inject transformations: f_webp (WebP format), w_1600 (width), c_limit (limit resize), q_auto (auto quality)
        return getOptimizedUrl(data.secure_url);
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
}

/**
 * Injects Cloudinary optimization parameters into a secure URL.
 */
export function getOptimizedUrl(url: string): string {
    if (!url.includes('cloudinary.com')) return url;

    // Transformation string
    const transformation = 'f_webp,w_1600,c_limit,q_auto';

    // Cloudinary URL format: .../upload/[transformation]/v[version]/...
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
}
