import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';
import { type Job, type JobApplication, MOCK_JOBS } from '../data/mockData';
import { useAuth } from './AuthContext';

const INITIAL_CONNECTS = 20;

interface MarketplaceContextType {
    jobs: Job[];
    applications: JobApplication[];
    isLoading: boolean;
    postJob: (data: Omit<Job, 'id' | 'createdAt' | 'applicantCount' | 'clientId' | 'clientName' | 'status'>) => Promise<void>;
    applyToJob: (jobId: string, coverLetter: string, proposedPrice: number) => Promise<{ success: boolean; message: string }>;
    acceptApplication: (applicationId: string) => Promise<{ success: boolean; creativeId: string; creativeName: string }>;
    getJobApplications: (jobId: string) => JobApplication[];
    getMyApplications: () => JobApplication[];
    getConnects: (userId: string) => number;
    hasApplied: (jobId: string) => boolean;
    closeJob: (jobId: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [connectsBalance, setConnectsBalance] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!isConfigured) {
            setJobs(MOCK_JOBS);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            // 1. Fetch Jobs
            const { data: jobsData, error: jobsError } = await supabase
                .from('jobs')
                .select('*, client:users(name)')
                .order('created_at', { ascending: false });

            if (jobsError) throw jobsError;

            // 2. Fetch Proposals (Applications)
            const { data: proposalsData, error: propsError } = await supabase
                .from('proposals')
                .select('*, job:jobs(title), photographer:photographers(user_id, users(name, avatar_url))');

            if (propsError) throw propsError;

            // 3. Fetch Photographers (for connects)
            const { data: photoData, error: photoError } = await supabase
                .from('photographers')
                .select('user_id, connects_balance');

            if (photoError) throw photoError;

            // Map Jobs
            const mappedJobs: Job[] = jobsData.map(j => ({
                id: j.id,
                title: j.title,
                description: j.description || '',
                budget: j.budget,
                currency: 'USD',
                location: j.location || '',
                isRemote: !j.location,
                category: j.category || 'Other',
                deadline: j.deadline || '',
                connectsRequired: j.connects_required,
                clientId: j.client_id,
                clientName: j.client?.name || 'Client',
                status: j.status,
                createdAt: j.created_at,
                applicantCount: proposalsData.filter(p => p.job_id === j.id).length,
                verifiedOnly: j.verified_only ?? false,
                creativeTypeRequired: j.creative_type_required || 'both',
            }));

            // Map Applications
            const mappedApps: JobApplication[] = proposalsData.map(p => ({
                id: p.id,
                jobId: p.job_id,
                creativeId: p.photographer?.user_id,
                creativeName: p.photographer?.users?.name || 'Creative',
                creativeAvatar: p.photographer?.users?.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg",
                coverLetter: p.cover_letter || '',
                proposedPrice: p.proposed_price,
                currency: 'USD',
                status: p.status,
                createdAt: p.created_at
            }));

            // Map Connects
            const balanceMap: Record<string, number> = {};
            photoData.forEach(p => {
                balanceMap[p.user_id] = p.connects_balance;
            });

            setJobs(mappedJobs);
            setApplications(mappedApps);
            setConnectsBalance(balanceMap);

        } catch (_secret_e) {
            console.error("Error refreshing marketplace data:", _secret_e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const postJob = async (data: Omit<Job, 'id' | 'createdAt' | 'applicantCount' | 'clientId' | 'clientName' | 'status'>) => {
        if (!user || !isConfigured) return;

        const { error } = await supabase.from('jobs').insert({
            client_id: user.id,
            title: data.title,
            description: data.description,
            budget: data.budget,
            category: data.category,
            location: data.location,
            deadline: data.deadline,
            connects_required: data.connectsRequired,
            verified_only: data.verifiedOnly ?? false,
        });

        if (error) throw error;
        await refreshData();
    };

    const applyToJob = async (jobId: string, coverLetter: string, proposedPrice: number): Promise<{ success: boolean; message: string }> => {
        if (!user || !isConfigured) return { success: false, message: 'Supabase not configured or user not logged in.' };
        if (user.role !== 'creative') return { success: false, message: 'Only creatives can apply.' };

        // ── 7-day account age restriction ─────────────────────────
        if (user.createdAt) {
            const ageMs = Date.now() - new Date(user.createdAt).getTime();
            const ageDays = ageMs / (1000 * 60 * 60 * 24);
            if (ageDays < 7) {
                const daysLeft = Math.ceil(7 - ageDays);
                return {
                    success: false,
                    message: `Your account must be at least 7 days old to apply. You can apply in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`,
                };
            }
        }

        // ── Verified-only job restriction ──────────────────────────
        const job = jobs.find(j => j.id === jobId);
        if (!job) return { success: false, message: 'Job not found.' };
        try {
            const { data: photo, error: photoError } = await supabase
                .from('photographers')
                .select('id, connects_balance, is_verified:users(is_verified)')
                .eq('user_id', user.id)
                .single();

            if (photoError) throw photoError;

            const isVerifiedResult = photo.is_verified as unknown as { is_verified: boolean } | { is_verified: boolean }[];
            const isVerified = Array.isArray(isVerifiedResult)
                ? isVerifiedResult[0]?.is_verified
                : isVerifiedResult?.is_verified;

            // Check verified-only restriction (only block if job requires it)
            if (job.verifiedOnly && !isVerified) {
                return { success: false, message: 'This job requires a verified creative.' };
            }

            if (photo.connects_balance < job.connectsRequired) {
                return { success: false, message: 'Insufficient connects.' };
            }

            // Create Proposal & Deduct Connects (Transaction-like)
            const { error: propError } = await supabase.from('proposals').insert({
                job_id: jobId,
                photographer_id: photo.id,
                cover_letter: coverLetter,
                proposed_price: proposedPrice
            });

            if (propError) {
                if (propError.code === '23505') return { success: false, message: 'You have already applied.' };
                throw propError;
            }

            // Update Connects
            const { error: updateError } = await supabase
                .from('photographers')
                .update({ connects_balance: photo.connects_balance - job.connectsRequired })
                .eq('id', photo.id);

            if (updateError) throw updateError;

            // Log Transaction
            await supabase.from('connect_transactions').insert({
                photographer_id: photo.id,
                amount: -job.connectsRequired,
                reason: 'job_apply'
            });

            await refreshData();
            return { success: true, message: 'Application sent!' };

        } catch (e: unknown) {
            console.error("Application error:", e);
            return { success: false, message: (e as Error).message || 'Failed to submit application.' };
        }
    };

    const getJobApplications = (jobId: string) => applications.filter(a => a.jobId === jobId);
    const getMyApplications = () => applications.filter(a => a.creativeId === user?.id);
    const getConnects = (userId: string) => connectsBalance[userId] ?? INITIAL_CONNECTS;
    const hasApplied = (jobId: string) => applications.some(a => a.jobId === jobId && a.creativeId === user?.id);

    const closeJob = async (jobId: string) => {
        if (!isConfigured) return;
        await supabase.from('jobs').update({ status: 'closed' }).eq('id', jobId);
        await refreshData();
    };

    const acceptApplication = async (applicationId: string): Promise<{ success: boolean; creativeId: string; creativeName: string }> => {
        const app = applications.find(a => a.id === applicationId);
        if (!app) return { success: false, creativeId: '', creativeName: '' };
        if (isConfigured) {
            await supabase.from('proposals').update({ status: 'accepted' }).eq('id', applicationId);
            // Reject all other proposals for this job
            await supabase.from('proposals')
                .update({ status: 'rejected' })
                .eq('job_id', app.jobId)
                .neq('id', applicationId);
            await refreshData();
        }
        return { success: true, creativeId: app.creativeId, creativeName: app.creativeName };
    };

    return (
        <MarketplaceContext.Provider value={{
            jobs, applications, isLoading,
            postJob, applyToJob, acceptApplication,
            getJobApplications, getMyApplications,
            getConnects, hasApplied, closeJob,
            refreshData
        }}>
            {children}
        </MarketplaceContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useMarketplace() {
    const ctx = useContext(MarketplaceContext);
    if (!ctx) throw new Error('useMarketplace must be used within MarketplaceProvider');
    return ctx;
}
