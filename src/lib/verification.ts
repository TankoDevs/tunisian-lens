import { ARTISTS } from "../data/mockData";

const VERIFICATION_KEY = 'tunisian_lens_verified_artists';

/** Read all verified artist IDs from localStorage */
export function getVerifiedArtists(): Record<string, boolean> {
    try {
        return JSON.parse(localStorage.getItem(VERIFICATION_KEY) || '{}');
    } catch {
        return {};
    }
}

/** Persist a single artist's verification status */
export function setArtistVerification(artistId: string, verified: boolean) {
    const current = getVerifiedArtists();
    current[artistId] = verified;
    localStorage.setItem(VERIFICATION_KEY, JSON.stringify(current));
}

/** Check if an artist is verified (checks localStorage override first, then mock data default) */
export function isArtistVerified(artistId: string): boolean {
    const overrides = getVerifiedArtists();
    if (artistId in overrides) return overrides[artistId];
    const artist = ARTISTS.find(a => a.id === artistId);
    return !!artist?.isVerified;
}
