import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';
import { type Job, type JobApplication, MOCK_JOBS } from '../data/mockData';
import { useAuth } from './AuthContext';

const INITIAL_CONNECTS = 20;
const MOCK_APPS_KEY = 'tunisian_lens_mock_applications';
const MOCK_CONNECTS_KEY = 'tunisian_lens_mock_connects';
const MOCK_CUSTOM_JOBS_KEY = 'tunisian_lens_mock_custom_jobs';

interface MarketplaceContextType {
    jobs: Job[];
    applications: JobApplication[];
    isLoading: boolean;
    postJob: (data: Omit<Job, 'id' | 'createdAt' | 'applicantCount' | 'clientId' | 'clientName' | 'status'>) => Promise<void>;
    applyToJob: (jobId: string, coverLetter: string, proposedPrice: number) => Promise<{ success: boolean; message: string }>;
    acceptApplication: (applicationId: string) => Promise<{ success: boolean; creativeId: string; creativeName: string }>;
    addConnects: (userId: string, amount: number) => Promise<void>;
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
            // Load custom mock jobs if any
            let customJobs: Job[] = [];
            try {
                customJobs = JSON.parse(localStorage.getItem(MOCK_CUSTOM_JOBS_KEY) || '[]');
            } catch {
                customJobs = [];
            }

            // Link job-2 to demo-client-1 so client login sees their assignment
            const baseJobs: Job[] = MOCK_JOBS.map(j => {
                if (j.id === 'job-2') {
                    return { ...j, clientId: 'demo-client-1', clientName: 'Nour Ben Ali (Boutique Nour)' };
                }
                return j;
            });

            const mergedJobs = [...customJobs, ...baseJobs];

            // Load mock applications
            let storedApps: JobApplication[] = [];
            try {
                storedApps = JSON.parse(localStorage.getItem(MOCK_APPS_KEY) || '[]');
            } catch {
                storedApps = [];
            }

            // Seed sample application for demo photographer if none exists
            if (storedApps.length === 0) {
                storedApps = [
                    {
                        id: 'seed-app-1',
                        jobId: 'job-1',
                        creativeId: 'demo-photo-0',
                        creativeName: 'Street Photographer',
                        creativeAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                        coverLetter: 'Passionate street and documentary visual storyteller with 5+ years covering Sidi Bou Said and Tunis Medina.',
                        proposedPrice: 750,
                        currency: 'USD',
                        status: 'pending',
                        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    }
                ];
                localStorage.setItem(MOCK_APPS_KEY, JSON.stringify(storedApps));
            }

            // Load connects balance
            let storedConnects: Record<string, number> = {};
            try {
                storedConnects = JSON.parse(localStorage.getItem(MOCK_CONNECTS_KEY) || '{}');
            } catch {
                storedConnects = {};
            }

            setJobs(mergedJobs);
            setApplications(storedApps);
            setConnectsBalance(storedConnects);
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
            const mappedJobs: Job[] = (jobsData || []).map(j => ({
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
                applicantCount: (proposalsData || []).filter(p => p.job_id === j.id).length,
                verifiedOnly: j.verified_only ?? false,
                creativeTypeRequired: j.creative_type_required || 'both',
            }));

            // Map Applications
            const mappedApps: JobApplication[] = (proposalsData || []).map(p => ({
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
            (photoData || []).forEach(p => {
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
        if (!user) return;

        if (!isConfigured) {
            const newJob: Job = {
                id: 'custom-job-' + Math.random().toString(36).substr(2, 9),
                title: data.title,
                description: data.description,
                budget: data.budget,
                currency: 'USD',
                location: data.location || '',
                isRemote: !data.location,
                category: data.category,
                deadline: data.deadline,
                connectsRequired: data.connectsRequired,
                clientId: user.id,
                clientName: user.name,
                status: 'open',
                createdAt: new Date().toISOString(),
                applicantCount: 0,
                verifiedOnly: data.verifiedOnly ?? false,
                creativeTypeRequired: data.creativeTypeRequired || 'both',
            };
            const currentCustom = JSON.parse(localStorage.getItem(MOCK_CUSTOM_JOBS_KEY) || '[]');
            const updated = [newJob, ...currentCustom];
            localStorage.setItem(MOCK_CUSTOM_JOBS_KEY, JSON.stringify(updated));
            await refreshData();
            return;
        }

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

    const addConnects = async (userId: string, amount: number) => {
        const current = connectsBalance[userId] ?? INITIAL_CONNECTS;
        const next = Math.max(0, current + amount);
        const updated = { ...connectsBalance, [userId]: next };
        setConnectsBalance(updated);

        if (!isConfigured) {
            localStorage.setItem(MOCK_CONNECTS_KEY, JSON.stringify(updated));
            return;
        }

        try {
            const { data: photo } = await supabase.from('photographers').select('id').eq('user_id', userId).maybeSingle();
            if (photo) {
                await supabase.from('photographers').update({ connects_balance: next }).eq('id', photo.id);
                await supabase.from('connect_transactions').insert({
                    photographer_id: photo.id,
                    amount: amount,
                    reason: 'purchase'
                });
            }
        } catch (e) {
            console.error("Failed to add connects in supabase:", e);
        }
    };

    const applyToJob = async (jobId: string, coverLetter: string, proposedPrice: number): Promise<{ success: boolean; message: string }> => {
        if (!user) return { success: false, message: 'Please sign in to submit a proposal.' };
        if (user.role !== 'creative') return { success: false, message: 'Only creatives can apply to briefs.' };

        const job = jobs.find(j => j.id === jobId);
        if (!job) return { success: false, message: 'Assignment brief not found.' };

        const userConnects = connectsBalance[user.id] ?? INITIAL_CONNECTS;
        if (userConnects < job.connectsRequired) {
            return { success: false, message: `Insufficient connects. This assignment requires ${job.connectsRequired} connects.` };
        }

        if (!isConfigured) {
            // Mock Apply
            const newBalance = userConnects - job.connectsRequired;
            const updatedBalances = { ...connectsBalance, [user.id]: newBalance };
            setConnectsBalance(updatedBalances);
            localStorage.setItem(MOCK_CONNECTS_KEY, JSON.stringify(updatedBalances));

            const newApp: JobApplication = {
                id: 'app-' + Math.random().toString(36).substr(2, 9),
                jobId,
                creativeId: user.id,
                creativeName: user.name,
                creativeAvatar: user.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
                coverLetter,
                proposedPrice,
                currency: 'USD',
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            const storedApps = JSON.parse(localStorage.getItem(MOCK_APPS_KEY) || '[]');
            const updatedApps = [newApp, ...storedApps];
            localStorage.setItem(MOCK_APPS_KEY, JSON.stringify(updatedApps));
            setApplications(updatedApps);

            // Increment job applicant count
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j));

            return { success: true, message: 'Your proposal treatment has been dispatched to the client!' };
        }

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

            // Check verified-only restriction
            if (job.verifiedOnly && !isVerified) {
                return { success: false, message: 'This brief requires curatorial verification.' };
            }

            if (photo.connects_balance < job.connectsRequired) {
                return { success: false, message: 'Insufficient connects.' };
            }

            // Create Proposal & Deduct Connects
            const { error: propError } = await supabase.from('proposals').insert({
                job_id: jobId,
                photographer_id: photo.id,
                cover_letter: coverLetter,
                proposed_price: proposedPrice
            });

            if (propError) {
                if (propError.code === '23505') return { success: false, message: 'You have already applied for this assignment.' };
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
            return { success: true, message: 'Proposal dispatched successfully!' };

        } catch (e: unknown) {
            console.error("Application error:", e);
            return { success: false, message: (e as Error).message || 'Failed to submit application.' };
        }
    };

    const getJobApplications = (jobId: string) => (applications || []).filter(a => a.jobId === jobId);
    const getMyApplications = () => (applications || []).filter(a => a.creativeId === user?.id);
    const getConnects = (userId: string) => {
        if (!userId) return INITIAL_CONNECTS;
        const val = connectsBalance[userId];
        return typeof val === 'number' && !isNaN(val) ? val : INITIAL_CONNECTS;
    };
    const hasApplied = (jobId: string) => (applications || []).some(a => a.jobId === jobId && a.creativeId === user?.id);

    const closeJob = async (jobId: string) => {
        if (!isConfigured) {
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'closed' } : j));
            return;
        }
        await supabase.from('jobs').update({ status: 'closed' }).eq('id', jobId);
        await refreshData();
    };

    const acceptApplication = async (applicationId: string): Promise<{ success: boolean; creativeId: string; creativeName: string }> => {
        const app = (applications || []).find(a => a.id === applicationId);
        if (!app) return { success: false, creativeId: '', creativeName: '' };
        if (isConfigured) {
            await supabase.from('proposals').update({ status: 'accepted' }).eq('id', applicationId);
            await supabase.from('proposals')
                .update({ status: 'rejected' })
                .eq('job_id', app.jobId)
                .neq('id', applicationId);
            await refreshData();
        } else {
            setApplications(prev => prev.map(a => {
                if (a.id === applicationId) return { ...a, status: 'accepted' };
                if (a.jobId === app.jobId) return { ...a, status: 'rejected' };
                return a;
            }));
            const stored = JSON.parse(localStorage.getItem(MOCK_APPS_KEY) || '[]');
            const updated = stored.map((a: JobApplication) => {
                if (a.id === applicationId) return { ...a, status: 'accepted' };
                if (a.jobId === app.jobId) return { ...a, status: 'rejected' };
                return a;
            });
            localStorage.setItem(MOCK_APPS_KEY, JSON.stringify(updated));
        }
        return { success: true, creativeId: app.creativeId, creativeName: app.creativeName };
    };

    return (
        <MarketplaceContext.Provider value={{
            jobs, applications, isLoading,
            postJob, applyToJob, acceptApplication, addConnects,
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
