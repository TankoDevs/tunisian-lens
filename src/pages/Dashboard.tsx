import { Link } from "react-router-dom";
import { Zap, Briefcase, ChevronRight, CheckCircle2, XCircle, AlertCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";

function StatusBadge({ status }: { status: 'pending' | 'accepted' | 'rejected' }) {
    const config = {
        pending: { icon: AlertCircle, label: 'Pending', cls: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800' },
        accepted: { icon: CheckCircle2, label: 'Accepted', cls: 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800' },
        rejected: { icon: XCircle, label: 'Rejected', cls: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800' },
    }[status];
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${config.cls}`}>
            <Icon className="h-3 w-3" strokeWidth={2} />
            {config.label}
        </span>
    );
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const { jobs, getMyApplications, getJobApplications, getConnects } = useMarketplace();
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-muted-foreground">
                <p className="text-lg font-medium">Please log in to view your dashboard</p>
                <Link to="/login"><Button>Log In</Button></Link>
            </div>
        );
    }

    const connects = getConnects(user.id);
    const myApplications = getMyApplications();
    const myJobs = jobs.filter(j => j.clientId === user.id);

    const isPhotographer = user.role === 'photographer';
    const isClient = user.role === 'client';
    const isAdmin = user.role === 'admin';

    // Verification check (mock)
    interface MockUser { id: string; email: string; isVerified?: boolean; }
    const mockUsers: MockUser[] = JSON.parse(localStorage.getItem('tunisian_lens_mock_users') || '[]');
    const mockUser = mockUsers.find((u: MockUser) => u.id === user.id);
    const isVerified = mockUser?.isVerified === true;

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <h1 className="font-serif text-3xl font-bold mb-0.5">Dashboard</h1>
                            <p className="text-muted-foreground text-sm">
                                Welcome back, <span className="font-medium text-foreground">{user.name}</span> ·
                                <span className="ml-1 text-xs uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{user.role}</span>
                            </p>
                        </div>
                        {isPhotographer && (
                            <Link to="/jobs"><Button variant="outline" className="gap-2">
                                <Briefcase className="h-4 w-4" strokeWidth={2} /> Browse Jobs
                            </Button></Link>
                        )}
                        {(isClient || isAdmin) && (
                            <Link to="/jobs/post"><Button className="gap-2">
                                <PlusCircle className="h-4 w-4" strokeWidth={2} /> Post a Job
                            </Button></Link>
                        )}
                    </div>

                    {/* ── PHOTOGRAPHER DASHBOARD ── */}
                    {isPhotographer && (
                        <div className="space-y-6">
                            {/* Stats row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Connects card */}
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <Zap className="h-4 w-4 text-amber-500" strokeWidth={2} fill="currentColor" />
                                        Connects Balance
                                    </div>
                                    <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{connects}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Used to apply to jobs</p>
                                </div>

                                {/* Applications count */}
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <Briefcase className="h-4 w-4" strokeWidth={2} />
                                        Applications Sent
                                    </div>
                                    <div className="text-4xl font-bold">{myApplications.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {myApplications.filter(a => a.status === 'accepted').length} accepted
                                    </p>
                                </div>

                                {/* Verification */}
                                <div className={`border rounded-2xl p-5 bg-card ${isVerified ? 'border-green-300 dark:border-green-700' : 'border-amber-300 dark:border-amber-700'}`}>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <CheckCircle2 className={`h-4 w-4 ${isVerified ? 'text-green-600' : 'text-amber-500'}`} strokeWidth={2} />
                                        Verification
                                    </div>
                                    <div className={`text-lg font-bold ${isVerified ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                        {isVerified ? 'Verified ✓' : 'Pending'}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {isVerified ? 'You can apply to any job' : 'Admin review required to apply'}
                                    </p>
                                </div>
                            </div>

                            {/* My Applications */}
                            <div>
                                <h2 className="font-semibold text-lg mb-3">My Applications</h2>
                                {myApplications.length === 0 ? (
                                    <div className="border rounded-2xl p-8 text-center text-muted-foreground bg-card">
                                        <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                                        <p className="font-medium">No applications yet</p>
                                        <p className="text-sm mt-1">Browse jobs and start applying with your Connects.</p>
                                        <Link to="/jobs" className="mt-4 inline-block">
                                            <Button variant="outline" size="sm">Browse Jobs</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {myApplications.map(app => {
                                            const job = jobs.find(j => j.id === app.jobId);
                                            return (
                                                <motion.div
                                                    key={app.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="border rounded-xl p-4 bg-card flex items-start gap-4"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-medium text-sm truncate">{job?.title ?? 'Job removed'}</span>
                                                            <StatusBadge status={app.status} />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Proposed: <span className="font-semibold text-foreground">${app.proposedPrice}</span> ·
                                                            Applied {formatDate(app.createdAt)}
                                                        </p>
                                                        {app.coverLetter && (
                                                            <p className="text-xs text-muted-foreground mt-1.5 italic line-clamp-1">"{app.coverLetter}"</p>
                                                        )}
                                                    </div>
                                                    {job && (
                                                        <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                                                            <ChevronRight className="h-4 w-4" strokeWidth={2} />
                                                        </Link>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Connects Info */}
                            <div className="border rounded-2xl p-5 bg-card">
                                <h2 className="font-semibold mb-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-amber-500" strokeWidth={2} fill="currentColor" />
                                    About Connects
                                </h2>
                                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                                    <li>Each job lists how many Connects it costs to apply</li>
                                    <li>New photographers receive {20} free Connects</li>
                                    <li>Connects are deducted when you submit an application</li>
                                    <li>Paid Connects packages coming soon</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ── CLIENT / ADMIN DASHBOARD ── */}
                    {(isClient || isAdmin) && (
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <Briefcase className="h-4 w-4" strokeWidth={2} />
                                        Jobs Posted
                                    </div>
                                    <div className="text-4xl font-bold">{myJobs.length}</div>
                                </div>
                                <div className="border rounded-2xl p-5 bg-card">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" strokeWidth={2} />
                                        Total Applicants
                                    </div>
                                    <div className="text-4xl font-bold">{myJobs.reduce((s, j) => s + j.applicantCount, 0)}</div>
                                </div>
                            </div>

                            {/* My Jobs */}
                            <div>
                                <h2 className="font-semibold text-lg mb-3">My Posted Jobs</h2>
                                {myJobs.length === 0 ? (
                                    <div className="border rounded-2xl p-8 text-center text-muted-foreground bg-card">
                                        <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                                        <p className="font-medium">No jobs posted yet</p>
                                        <Link to="/jobs/post" className="mt-4 inline-block">
                                            <Button size="sm">Post Your First Job</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {myJobs.map(job => {
                                            const apps = getJobApplications(job.id);
                                            return (
                                                <motion.div
                                                    key={job.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="border rounded-xl p-4 bg-card flex items-start gap-4"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-medium text-sm truncate">{job.title}</span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border
                                                                ${job.status === 'open' ? 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800' : 'text-muted-foreground bg-muted border-border'}`}>
                                                                {job.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Budget: <span className="font-semibold text-foreground">${job.budget}</span> ·
                                                            <span className="ml-1">{apps.length} applicant{apps.length !== 1 ? 's' : ''}</span> ·
                                                            Deadline {formatDate(job.deadline)}
                                                        </p>
                                                    </div>
                                                    <Link to={`/jobs/${job.id}`} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                                                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
