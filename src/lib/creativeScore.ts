/**
 * Creative Score Algorithm (internal – never displayed publicly)
 *
 * Score influences default sort order on /creatives.
 * Weights:
 *   Reviews/ratings  : 40%
 *   Completion rate  : 30%
 *   Response speed   : 15%
 *   Portfolio depth  : 15%
 */

export interface CreativeScoreInput {
    rating?: number;            // 0–5
    reviewCount?: number;
    jobsCompleted?: number;
    successRate?: number;       // 0–100
    avgResponseHours?: number;  // lower = better
    portfolioCount?: number;    // number of portfolio items
    badgeLevel?: 'verified' | 'pro' | 'elite';
}

export function computeCreativeScore(input: CreativeScoreInput): number {
    const {
        rating = 3,
        reviewCount = 0,
        jobsCompleted = 0,
        successRate = 70,
        avgResponseHours = 24,
        portfolioCount = 0,
        badgeLevel,
    } = input;

    // Normalise rating to 0–100
    const ratingScore = (rating / 5) * 100;

    // Review volume bonus (cap at 20 reviews for scoring)
    const reviewBonus = Math.min(reviewCount / 20, 1) * 20;

    // Completion score (0–100)
    const completionScore = Math.min(jobsCompleted / 30, 1) * 100;

    // Response score: 2h = 100, 48h+ = 0
    const responseScore = Math.max(0, 100 - (avgResponseHours / 48) * 100);

    // Portfolio depth (cap at 12 items)
    const portfolioScore = Math.min(portfolioCount / 12, 1) * 100;

    // Badge multiplier
    const badgeBonus = badgeLevel === 'elite' ? 15 : badgeLevel === 'pro' ? 8 : 0;

    const raw =
        ratingScore * 0.4 +
        reviewBonus * 0.1 +
        (completionScore + (successRate ?? 70)) / 2 * 0.3 +
        responseScore * 0.15 +
        portfolioScore * 0.15 +
        badgeBonus;

    return Math.round(Math.min(raw, 100) * 10) / 10;
}
