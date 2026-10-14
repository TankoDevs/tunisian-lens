import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { PROJECTS as INITIAL_PROJECTS } from '../data/mockData';

export interface Artist {
    id: string;
    name: string;
    avatar: string;
    location: string;
    bio?: string;
    tags?: string[];
    followers?: number;
    following?: number;
    projectCount?: number;
}

export interface Project {
    id: string;
    title: string;
    image: string;
    category: string;
    likes: number;
    artist: {
        id: string;
        name: string;
        avatar: string;
    };
    description?: string;
    tags?: string[];
    date?: string;
    isPrivate?: boolean;
    isDownloadable?: boolean;
    accessCode?: string;
    mediaType?: 'image' | 'video';
    videoUrl?: string;
    thumbnailUrl?: string;
}

interface ProjectContextType {
    projects: Project[];
    publicProjects: Project[];
    isLoading: boolean;
    addProject: (newProjectData: Omit<Project, 'id' | 'likes' | 'artist'>) => Promise<void>;
    getProject: (id: string) => Project | undefined;
    getProjectByCode: (code: string) => Project | undefined;
    deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const DEFAULT_PROJECTS: Project[] = [
    ...INITIAL_PROJECTS.map(p => ({
        ...p,
        description: `Stunning ${p.category.toLowerCase()} visual series from Tunisia captured with natural light and distinct atmosphere.`,
        tags: [p.category, "Tunisia", "Visuals"],
        date: "2026-02-14T10:00:00.000Z",
        isPrivate: false,
        isDownloadable: true,
    })),
    {
        id: "demo-private-1",
        title: "Exclusive Sidi Bou Said Bridal Preview",
        image: "https://picsum.photos/seed/exclusive-bridal/800/600",
        category: "Wedding",
        likes: 45,
        artist: { id: "a1", name: "Amine Benali", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        description: "Private client gallery session. Full high-resolution album for client download.",
        tags: ["Wedding", "Private", "Client"],
        date: "2026-03-01T12:00:00.000Z",
        isPrivate: true,
        isDownloadable: true,
        accessCode: "X7K-9P2"
    }
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Derived state for public projects
    const publicProjects = projects.filter(p => !p.isPrivate);

    // Fetch projects — from Supabase if configured, otherwise from localStorage with DEFAULT_PROJECTS fallback
    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            if (isConfigured) {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.warn('Supabase fetch error, using localStorage fallback', error);
                    const stored = localStorage.getItem('tunisian_lens_projects_v2');
                    const parsed: Project[] = stored ? JSON.parse(stored) : [];
                    if (parsed.length > 0) {
                        setProjects(parsed.map((p) => ({
                            ...p,
                            image: p.image || ((p as unknown as Record<string, string>)['image_url']) || ''
                        })));
                    } else {
                        setProjects(DEFAULT_PROJECTS);
                    }
                } else if (data && data.length > 0) {
                    type SupabaseRow = Record<string, unknown>;
                    setProjects((data as SupabaseRow[]).map((p) => ({
                        id: p['id'] as string,
                        title: p['title'] as string,
                        image: (p['image'] || p['image_url']) as string,
                        category: p['category'] as string,
                        likes: p['likes'] as number,
                        artist: p['artist'] as Project['artist'],
                        description: p['description'] as string | undefined,
                        tags: p['tags'] as string[] | undefined,
                        date: p['date'] as string | undefined,
                        isPrivate: p['is_private'] as boolean | undefined,
                        isDownloadable: p['is_downloadable'] as boolean | undefined,
                        accessCode: p['access_code'] as string | undefined,
                    })));
                } else {
                    setProjects(DEFAULT_PROJECTS);
                }
            } else {
                const stored = localStorage.getItem('tunisian_lens_projects_v2');
                const parsed: Project[] = stored ? JSON.parse(stored) : [];
                if (parsed.length > 0) {
                    setProjects(parsed.map((p) => ({
                        ...p,
                        image: p.image || ((p as unknown as Record<string, string>)['image_url']) || ''
                    })));
                } else {
                    setProjects(DEFAULT_PROJECTS);
                    localStorage.setItem('tunisian_lens_projects_v2', JSON.stringify(DEFAULT_PROJECTS));
                }
            }
        } catch (e) {
            console.warn('Project fetch failed:', e);
            setProjects(DEFAULT_PROJECTS);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const addProject = async (newProjectData: Omit<Project, 'id' | 'likes' | 'artist'>) => {
        if (!user) return;

        const newProject = {
            title: newProjectData.title,
            category: newProjectData.category,
            image: newProjectData.image,
            description: newProjectData.description,
            tags: newProjectData.tags,
            is_private: newProjectData.isPrivate,
            is_downloadable: newProjectData.isDownloadable,
            access_code: newProjectData.accessCode,
            likes: 0,
            artist: {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }
        };

        const { data, error } = await supabase
            .from('projects')
            .insert([newProject])
            .select();

        if (error) {
            console.error("Error adding project to Supabase:", error);
            // Fallback for demo
            const localProject: Project = {
                id: Date.now().toString(),
                ...newProject,
                artist: newProject.artist,
                date: new Date().toISOString()
            } as Project;
            const updated = [localProject, ...projects];
            setProjects(updated);
            localStorage.setItem('tunisian_lens_projects_v2', JSON.stringify(updated));
            return;
        }

        if (data) {
            setProjects([data[0], ...projects]);
        }
    };

    const getProject = (id: string) => {
        return projects.find(p => p.id === id);
    };

    const getProjectByCode = (code: string) => {
        return projects.find(p => p.accessCode === code);
    };

    const deleteProject = async (id: string) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting project from Supabase:", error);
            // Fallback for local
            const updatedProjects = projects.filter(p => p.id !== id);
            setProjects(updatedProjects);
            localStorage.setItem('tunisian_lens_projects_v2', JSON.stringify(updatedProjects));
            return;
        }

        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <ProjectContext.Provider value={{ projects, publicProjects, isLoading, addProject, getProject, getProjectByCode, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProjects() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}
