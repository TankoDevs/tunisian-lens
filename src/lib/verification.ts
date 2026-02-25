import { ARTISTS } from "../data/mockData";

const VERIFICATION_KEY = 'tunisian_lens_verified_artists';
const VERIFICATION_REQUESTS_KEY = 'tunisian_lens_verification_requests';

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

// ── Verification Requests ──────────────────────────────────────────────────

export type VerificationStatus = 'pending' | 'approved' | 'denied';

export interface VerificationRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    message: string;
    submittedAt: string;
    status: VerificationStatus;
}

export function getVerificationRequests(): VerificationRequest[] {
    try {
        return JSON.parse(localStorage.getItem(VERIFICATION_REQUESTS_KEY) || '[]');
    } catch {
        return [];
    }
}

/** Submit a new verification request (one per user) */
export function submitVerificationRequest(
    userId: string,
    userName: string,
    userEmail: string,
    message: string
): void {
    const requests = getVerificationRequests();
    // Overwrite any previous request from this user
    const filtered = requests.filter(r => r.userId !== userId);
    filtered.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        userName,
        userEmail,
        message,
        submittedAt: new Date().toISOString(),
        status: 'pending',
    });
    localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(filtered));
}

/** Update the status of a request and (if approved) set artist verified */
export function updateVerificationRequest(
    requestId: string,
    status: 'approved' | 'denied'
): void {
    const requests = getVerificationRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return;
    req.status = status;
    localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(requests));
    if (status === 'approved') {
        setArtistVerification(req.userId, true);
    }
}
