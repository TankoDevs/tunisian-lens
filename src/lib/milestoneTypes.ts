/**
 * Milestone Payment Architecture – Phase 2 Prep
 *
 * Full UI not yet implemented. Types are production-ready for
 * future Stripe / Konnect integration.
 */

export type MilestoneStatus = 'pending' | 'submitted' | 'approved' | 'released' | 'disputed';

export interface Milestone {
    id: string;
    jobId: string;
    description: string;            // "Initial delivery", "Final edits", etc.
    amount: number;
    currency: string;
    dueDate: string;                // ISO date string
    status: MilestoneStatus;
    submittedAt?: string;
    approvedAt?: string;
    releasedAt?: string;
    notes?: string;
}

export interface MilestonePaymentPlan {
    jobId: string;
    totalAmount: number;
    currency: string;
    milestones: Milestone[];
    createdAt: string;
    updatedAt: string;
}

/** Helper: creates a simple 3-milestone plan (50% / 25% / 25%) */
export function createDefaultMilestonePlan(
    jobId: string,
    totalAmount: number,
    currency = 'USD'
): MilestonePaymentPlan {
    const now = new Date();
    const plan: MilestonePaymentPlan = {
        jobId,
        totalAmount,
        currency,
        milestones: [
            {
                id: `${jobId}-m1`,
                jobId,
                description: 'Project kickoff & initial delivery',
                amount: Math.round(totalAmount * 0.5),
                currency,
                dueDate: new Date(now.getTime() + 7 * 86400000).toISOString(),
                status: 'pending',
            },
            {
                id: `${jobId}-m2`,
                jobId,
                description: 'Mid-project review & revisions',
                amount: Math.round(totalAmount * 0.25),
                currency,
                dueDate: new Date(now.getTime() + 14 * 86400000).toISOString(),
                status: 'pending',
            },
            {
                id: `${jobId}-m3`,
                jobId,
                description: 'Final delivery & sign-off',
                amount: Math.round(totalAmount * 0.25),
                currency,
                dueDate: new Date(now.getTime() + 21 * 86400000).toISOString(),
                status: 'pending',
            },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
    };
    return plan;
}
