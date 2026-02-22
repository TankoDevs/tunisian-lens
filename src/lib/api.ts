/**
 * Sightengine API integration utility
 * 
 * To use this in production, replace the placeholders with your actual API keys.
 */

const API_USER = 'YOUR_SIGHTENGINE_API_USER_PLACEHOLDER';
const API_SECRET = 'YOUR_SIGHTENGINE_API_SECRET_PLACEHOLDER';

export interface DetectionResult {
    status: 'success' | 'failure';
    type: 'ai' | 'safety' | 'clean' | 'error';
    score?: number;
    message?: string;
}

export async function checkImageSafety(imageFile: File): Promise<DetectionResult> {
    // If placeholders are not replaced, return a mock result for demo beauty
    if (API_USER.includes('PLACEHOLDER')) {
        console.warn("Sightengine API keys not configured. Running in DEMO MOCK mode.");

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        const name = imageFile.name.toLowerCase();

        // Safety Keywords
        const safetyKeywords = ['porn', 'nsfw', 'naked', 'sex', 'violence', 'blood', 'hate', 'racist', 'kill'];
        if (safetyKeywords.some(k => name.includes(k))) {
            return { status: 'success', type: 'safety', message: 'Inappropriate content detected' };
        }

        // AI Keywords
        const aiKeywords = ['ai', 'bot', 'gen', 'midjourney', 'stable', 'sdxl', 'flux', 'v6', 'render'];
        if (aiKeywords.some(k => name.includes(k))) {
            return { status: 'success', type: 'ai', score: 0.98 };
        }

        return { status: 'success', type: 'clean' };
    }

    // Real API Logic
    const data = new FormData();
    data.append('media', imageFile);
    data.append('models', 'genai,nudity,wad,offensive'); // genai=AI, nudity/wad/offensive=Safety
    data.append('api_user', API_USER);
    data.append('api_secret', API_SECRET);

    try {
        const response = await fetch('https://api.sightengine.com/1.0/check.json', {
            method: 'POST',
            body: data
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();

        // Check for AI - Look at the genai model result
        // Sightengine returns a 'type' property in 'genai'
        if (result.genai && result.genai.ai_generated > 0.8) {
            return { status: 'success', type: 'ai', score: result.genai.ai_generated };
        }

        // Check for Safety - Nudity
        if (result.nudity && (result.nudity.raw > 0.5 || result.nudity.partial > 0.5)) {
            return { status: 'success', type: 'safety', message: 'Inappropriate content (Nudity)' };
        }

        // Check for Violence
        if (result.weapon > 0.5 || result.alcohol > 0.8 || result.drugs > 0.8) {
            return { status: 'success', type: 'safety', message: 'Inappropriate content (Violence/Drugs)' };
        }

        return { status: 'success', type: 'clean' };

    } catch (error) {
        console.error("Sightengine API error:", error);
        return { status: 'failure', type: 'error', message: "Hardware failure in detection engine" };
    }
}
