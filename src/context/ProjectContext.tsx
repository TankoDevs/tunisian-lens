import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Types
export interface Artist {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    location?: string;
    categories?: string[];
    contact?: {
        email: string;
        instagram: string;
        phone: string;
    };
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
        location?: string;
    };
    description?: string;
    tags?: string[];
    date?: string;
    isPrivate?: boolean;
    accessCode?: string;
}

interface ProjectContextType {
    projects: Project[]; // Contains public AND private projects? Or just public? -> Let's keep all, but provide helpers
    publicProjects: Project[];
    addProject: (project: Omit<Project, 'id' | 'likes' | 'artist'>) => void;
    getProject: (id: string) => Project | undefined;
    getProjectByCode: (code: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);

    // Initialize from localStorage
    useEffect(() => {
        const storedProjects = localStorage.getItem('tunisian_lens_projects_v2');
        if (storedProjects) {
            try {
                setProjects(JSON.parse(storedProjects));
            } catch (e) {
                console.error("Failed to parse projects from local storage", e);
                setProjects([]);
            }
        } else {
            setProjects([]);
        }
    }, []);

    const addProject = (newProjectData: Omit<Project, 'id' | 'likes' | 'artist'>) => {
        const currentUserArtist = {
            id: "current_user",
            name: "You",
            avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
            location: "Tunis"
        };

        const newProject: Project = {
            id: Date.now().toString(),
            likes: 0,
            artist: currentUserArtist,
            date: new Date().toISOString(),
            ...newProjectData
        };

        const updatedProjects = [newProject, ...projects];
        setProjects(updatedProjects);
        localStorage.setItem('tunisian_lens_projects_v2', JSON.stringify(updatedProjects));
    };

    const getProject = (id: string) => {
        return projects.find(p => p.id === id);
    };

    const getProjectByCode = (code: string) => {
        // Case insensitive match for better UX
        return projects.find(p => p.isPrivate && p.accessCode && p.accessCode.toLowerCase() === code.toLowerCase());
    };

    // Filter out private projects for general consumption
    const publicProjects = projects.filter(p => !p.isPrivate);

    return (
        <ProjectContext.Provider value={{ projects, publicProjects, addProject, getProject, getProjectByCode }}>
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
