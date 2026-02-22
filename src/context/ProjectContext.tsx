import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

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

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Derived state for public projects
    const publicProjects = projects.filter(p => !p.isPrivate);

    // Fetch projects — from Supabase if configured, otherwise from localStorage only
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
                    const parsed: any[] = stored ? JSON.parse(stored) : [];
                    setProjects(parsed.map((p: any) => ({
                        ...p,
                        image: p.image || p.image_url || ''
                    })));
                } else if (data && data.length > 0) {
                    setProjects(data.map((p: any) => ({
                        ...p,
                        image: p.image || p.image_url,
                        isPrivate: p.isPrivate ?? p.is_private,
                        isDownloadable: p.isDownloadable ?? p.is_downloadable,
                        accessCode: p.accessCode ?? p.access_code
                    })));
                } else {
                    setProjects([]);
                }
            } else {
                // No Supabase — use localStorage submissions only (no mock data)
                const stored = localStorage.getItem('tunisian_lens_projects_v2');
                const parsed: any[] = stored ? JSON.parse(stored) : [];
                setProjects(parsed.map((p: any) => ({
                    ...p,
                    image: p.image || p.image_url || ''
                })));
            }
        } catch (e) {
            console.warn('Project fetch failed:', e);
            setProjects([]);
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
                artist: newProject.artist as any,
                date: new Date().toISOString()
            } as any;
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

export function useProjects() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}
