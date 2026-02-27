export const CATEGORIES = [
    "Wedding",
    "Street",
    "Portrait",
    "Landscape",
    "Fashion",
    "Architecture",
    "Food",
    "Documentary",
    "Event",
    "Commercial",
];

export const JOB_CATEGORIES = [
    "Wedding",
    "Event",
    "Fashion",
    "Product",
    "Portrait",
    "Landscape",
    "Commercial",
    "Documentary",
    "Architecture",
    "Other",
];

export interface Job {
    id: string;
    title: string;
    description: string;
    budget: number;
    currency: string;
    location?: string;
    isRemote: boolean;
    category: string;
    deadline: string; // ISO date string
    connectsRequired: number;
    clientId: string;
    clientName: string;
    status: 'open' | 'closed';
    createdAt: string;
    applicantCount: number;
    verifiedOnly?: boolean;
}

export interface JobApplication {
    id: string;
    jobId: string;
    photographerId: string;
    photographerName: string;
    photographerAvatar: string;
    coverLetter: string;
    proposedPrice: number;
    currency: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

export const MOCK_JOBS: Job[] = [
    {
        id: "job-1",
        title: "Wedding Photographer Needed in Tunis",
        description: "We are looking for an experienced wedding photographer for our traditional ceremony in Tunis. The event will take place over two days and we need full coverage from preparation to reception. We value authentic, candid moments and beautiful lighting.",
        budget: 800,
        currency: "USD",
        location: "Tunis, Tunisia",
        isRemote: false,
        category: "Wedding",
        deadline: "2026-04-15",
        connectsRequired: 4,
        clientId: "client-1",
        clientName: "Ahmed Mansour",
        status: "open",
        createdAt: "2026-02-20T10:00:00Z",
        applicantCount: 3
    },
    {
        id: "job-2",
        title: "Fashion Campaign — Spring Collection",
        description: "An emerging Tunisian fashion brand is seeking a creative photographer for our spring lookbook campaign. The shoot will take place over two days in Sidi Bou Said. Models and styling are provided. We need someone with a strong aesthetic for editorial fashion.",
        budget: 1200,
        currency: "USD",
        location: "Sidi Bou Said, Tunisia",
        isRemote: false,
        category: "Fashion",
        deadline: "2026-03-20",
        connectsRequired: 6,
        clientId: "client-2",
        clientName: "Boutique Nour",
        status: "open",
        createdAt: "2026-02-21T14:30:00Z",
        applicantCount: 7
    },
    {
        id: "job-3",
        title: "Product Photography for E-Commerce Store",
        description: "Online store selling Tunisian handmade crafts needs clean, professional product photography on white backgrounds. Approximately 50 products. High volume and consistent lighting required. Remote coordination is fine for the brief; shooting happens in our Sousse studio.",
        budget: 350,
        currency: "USD",
        location: "Sousse, Tunisia",
        isRemote: false,
        category: "Product",
        deadline: "2026-03-10",
        connectsRequired: 2,
        clientId: "client-3",
        clientName: "Artisanat TN",
        status: "open",
        createdAt: "2026-02-22T09:15:00Z",
        applicantCount: 5
    },
    {
        id: "job-4",
        title: "Corporate Event Coverage — Annual Conference",
        description: "We need a professional photographer for our annual tech conference in Tunis. Full day coverage including keynote speeches, panel discussions, networking sessions, and team portraits. Edited photos required within 48 hours.",
        budget: 600,
        currency: "USD",
        location: "Tunis, Tunisia",
        isRemote: false,
        category: "Event",
        deadline: "2026-05-01",
        connectsRequired: 4,
        clientId: "client-4",
        clientName: "TechConf Tunisia",
        status: "open",
        createdAt: "2026-02-23T11:00:00Z",
        applicantCount: 2
    },
    {
        id: "job-5",
        title: "Landscape Serie — Sahara Desert (Tozeur)",
        description: "Travel magazine looking for stunning landscape images from the Tozeur region, including the salt flats, palm trees, and dunes. We need a minimum of 40 final edited images delivered in high resolution. Remote coordination possible.",
        budget: 500,
        currency: "USD",
        location: "Tozeur, Tunisia",
        isRemote: false,
        category: "Landscape",
        deadline: "2026-04-30",
        connectsRequired: 3,
        clientId: "client-5",
        clientName: "Voyage Magazine",
        status: "open",
        createdAt: "2026-02-23T16:45:00Z",
        applicantCount: 9
    }
];

export const CITIES = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Djerba",
    "Bizerte",
    "Nabeul",
    "Monastir",
    "Hammamet",
    "Gabes",
    "Tozeur",
    "Paris",
    "Dubai",
    "London",
    "New York",
    "Berlin",
    "Casablanca",
    "Cairo",
    "Barcelona",
];

export const COUNTRIES = [
    "Tunisia",
    "France",
    "UAE",
    "United Kingdom",
    "United States",
    "Germany",
    "Morocco",
    "Egypt",
    "Spain",
    "Italy",
    "Turkey",
    "Lebanon",
];

export interface ServicePackage {
    name: string;
    price: number;
    currency: string;
    description: string;
    deliveryDays: number;
    includes: string[];
}

export interface Artist {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    location: string; // city
    country: string;
    categories: string[];
    isVerified: boolean;
    languages: string[];
    startingPrice: number;
    currency: string;
    deliveryDays: number;
    packages: ServicePackage[];
    contact: {
        email: string;
        instagram: string;
        phone: string;
    };
}

export const PROJECTS = [
    {
        id: "1",
        title: "Medina Shadows",
        image: "https://picsum.photos/seed/tunis-medina/800/600",
        category: "Street",
        likes: 124,
        artist: {
            id: "a1",
            name: "Amine Benali",
            avatar: "https://i.pravatar.cc/150?u=amine",
            isVerified: true
        }
    },
    {
        id: "2",
        title: "Sidi Bou Said Blue",
        image: "https://picsum.photos/seed/sidi-bou-said/800/600",
        category: "Architecture",
        likes: 89,
        artist: {
            id: "a2",
            name: "Sarra Jaziri",
            avatar: "https://i.pravatar.cc/150?u=sarra",
            isVerified: false
        }
    },
    {
        id: "3",
        title: "Sahara Sunset",
        image: "https://picsum.photos/seed/tunisia-sahara/800/600",
        category: "Landscape",
        likes: 256,
        artist: {
            id: "a3",
            name: "Karim Tounsi",
            avatar: "https://i.pravatar.cc/150?u=karim",
            isVerified: true
        }
    },
    {
        id: "4",
        title: "Traditional Wedding",
        image: "https://picsum.photos/seed/tunisia-culture/800/600",
        category: "Wedding",
        likes: 312,
        artist: {
            id: "a2",
            name: "Sarra Jaziri",
            avatar: "https://i.pravatar.cc/150?u=sarra",
            isVerified: false
        }
    },
    {
        id: "5",
        title: "Tunis Central Market",
        image: "https://picsum.photos/seed/tunis-market/800/600",
        category: "Street",
        likes: 98,
        artist: {
            id: "a1",
            name: "Amine Benali",
            avatar: "https://i.pravatar.cc/150?u=amine",
            isVerified: true
        }
    },
    {
        id: "6",
        title: "El Jem Amphitheater",
        image: "https://picsum.photos/seed/el-jem/800/600",
        category: "Architecture",
        likes: 175,
        artist: {
            id: "a3",
            name: "Karim Tounsi",
            avatar: "https://i.pravatar.cc/150?u=karim",
            isVerified: true
        }
    },
    {
        id: "7",
        title: "Paris Fashion Week",
        image: "https://picsum.photos/seed/paris-fashion/800/600",
        category: "Fashion",
        likes: 421,
        artist: {
            id: "a4",
            name: "Léa Moreau",
            avatar: "https://i.pravatar.cc/150?u=lea",
            isVerified: true
        }
    },
    {
        id: "8",
        title: "Dubai Skyline at Dusk",
        image: "https://picsum.photos/seed/dubai-skyline/800/600",
        category: "Architecture",
        likes: 538,
        artist: {
            id: "a5",
            name: "Omar Al-Rashid",
            avatar: "https://i.pravatar.cc/150?u=omar",
            isVerified: true
        }
    },
    {
        id: "9",
        title: "Borough Market",
        image: "https://picsum.photos/seed/london-market/800/600",
        category: "Food",
        likes: 203,
        artist: {
            id: "a6",
            name: "Emily Clarke",
            avatar: "https://i.pravatar.cc/150?u=emily",
            isVerified: false
        }
    }
];

export const ARTISTS: Artist[] = [
    {
        id: "a1",
        name: "Amine Benali",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        bio: "Street photographer capturing the soul of Tunis. Lover of light and shadow, documenting the city's hidden corners and its vibrant people.",
        location: "Tunis",
        country: "Tunisia",
        categories: ["Street", "Documentary"],
        isVerified: true,
        languages: ["Arabic", "French", "English"],
        startingPrice: 120,
        currency: "USD",
        deliveryDays: 5,
        packages: [
            {
                name: "Basic",
                price: 120,
                currency: "USD",
                description: "Half-day street photography session",
                deliveryDays: 5,
                includes: ["2-hour session", "20 edited photos", "Digital delivery"]
            },
            {
                name: "Standard",
                price: 250,
                currency: "USD",
                description: "Full-day documentary shoot",
                deliveryDays: 7,
                includes: ["6-hour session", "60 edited photos", "Digital delivery", "Location scouting"]
            },
            {
                name: "Premium",
                price: 450,
                currency: "USD",
                description: "Multi-day visual story",
                deliveryDays: 14,
                includes: ["2-day session", "100+ edited photos", "Print-ready files", "Online gallery", "Commercial license"]
            }
        ],
        contact: {
            email: "amine.b@example.com",
            instagram: "@aminelens",
            phone: "+216 00 000 000"
        }
    },
    {
        id: "a2",
        name: "Sarra Jaziri",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Capturing love stories and architectural marvels. Available for weddings worldwide. Based in Sousse, I blend traditional ceremony with contemporary artistic vision.",
        location: "Sousse",
        country: "Tunisia",
        categories: ["Wedding", "Architecture"],
        isVerified: false,
        languages: ["Arabic", "French"],
        startingPrice: 400,
        currency: "USD",
        deliveryDays: 14,
        packages: [
            {
                name: "Basic",
                price: 400,
                currency: "USD",
                description: "Wedding ceremony coverage",
                deliveryDays: 14,
                includes: ["4-hour coverage", "100 edited photos", "Online gallery"]
            },
            {
                name: "Standard",
                price: 800,
                currency: "USD",
                description: "Full wedding day",
                deliveryDays: 21,
                includes: ["8-hour coverage", "200 edited photos", "Online gallery", "Printed album (20 pages)"]
            },
            {
                name: "Premium",
                price: 1400,
                currency: "USD",
                description: "Complete wedding package",
                deliveryDays: 30,
                includes: ["2-day coverage", "350+ edited photos", "Drone footage", "Luxury album", "USB drive"]
            }
        ],
        contact: {
            email: "sarra.j@example.com",
            instagram: "@sarraphoto",
            phone: "+216 11 111 111"
        }
    },
    {
        id: "a3",
        name: "Karim Tounsi",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg",
        bio: "Landscape photographer exploring the diverse beauty of Tunisia, from the Mediterranean coast to the Sahara Desert. My work has been featured in National Geographic Traveller.",
        location: "Tozeur",
        country: "Tunisia",
        categories: ["Landscape", "Documentary"],
        isVerified: true,
        languages: ["Arabic", "French", "English"],
        startingPrice: 200,
        currency: "USD",
        deliveryDays: 10,
        packages: [
            {
                name: "Basic",
                price: 200,
                currency: "USD",
                description: "Single location landscape session",
                deliveryDays: 7,
                includes: ["Sunrise or sunset shoot", "15 edited photos", "Digital delivery"]
            },
            {
                name: "Standard",
                price: 500,
                currency: "USD",
                description: "Multi-location day tour",
                deliveryDays: 10,
                includes: ["Full-day shoot", "40 edited photos", "Drone aerial shots", "Digital delivery"]
            },
            {
                name: "Premium",
                price: 900,
                currency: "USD",
                description: "Desert expedition series",
                deliveryDays: 21,
                includes: ["3-day expedition", "80+ edited photos", "Drone footage", "Commercial license", "Print-ready files"]
            }
        ],
        contact: {
            email: "karim.t@example.com",
            instagram: "@karimscapes",
            phone: "+216 22 222 222"
        }
    },
    {
        id: "a4",
        name: "Léa Moreau",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        bio: "Parisian fashion and portrait photographer with 8 years of editorial experience. I've worked with Vogue, Elle, and leading luxury brands across Europe and the Middle East.",
        location: "Paris",
        country: "France",
        categories: ["Fashion", "Portrait"],
        isVerified: true,
        languages: ["French", "English", "Italian"],
        startingPrice: 350,
        currency: "USD",
        deliveryDays: 7,
        packages: [
            {
                name: "Basic",
                price: 350,
                currency: "USD",
                description: "Portrait or headshot session",
                deliveryDays: 5,
                includes: ["2-hour studio session", "15 retouched photos", "Digital delivery"]
            },
            {
                name: "Standard",
                price: 750,
                currency: "USD",
                description: "Editorial fashion shoot",
                deliveryDays: 7,
                includes: ["Half-day shoot", "30 retouched photos", "Styling consultation", "Digital delivery"]
            },
            {
                name: "Premium",
                price: 1800,
                currency: "USD",
                description: "Full editorial campaign",
                deliveryDays: 14,
                includes: ["Full-day shoot", "60+ retouched photos", "Creative direction", "Lookbook layout", "Commercial license"]
            }
        ],
        contact: {
            email: "lea.moreau@example.com",
            instagram: "@leamorphoto",
            phone: "+33 6 00 00 00 00"
        }
    },
    {
        id: "a5",
        name: "Omar Al-Rashid",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        bio: "Dubai-based architectural and commercial photographer. My work captures the intersection of tradition and modernity across the UAE and the wider Gulf region.",
        location: "Dubai",
        country: "UAE",
        categories: ["Architecture", "Commercial"],
        isVerified: true,
        languages: ["Arabic", "English"],
        startingPrice: 500,
        currency: "USD",
        deliveryDays: 7,
        packages: [
            {
                name: "Basic",
                price: 500,
                currency: "USD",
                description: "Interior or exterior shoot",
                deliveryDays: 5,
                includes: ["Half-day shoot", "20 edited photos", "Digital delivery"]
            },
            {
                name: "Standard",
                price: 1200,
                currency: "USD",
                description: "Full property or project shoot",
                deliveryDays: 7,
                includes: ["Full-day shoot", "50 edited photos", "Twilight shots", "Digital delivery"]
            },
            {
                name: "Premium",
                price: 2500,
                currency: "USD",
                description: "Complete commercial campaign",
                deliveryDays: 14,
                includes: ["2-day shoot", "100+ edited photos", "Drone aerials", "Virtual tour content", "Commercial license"]
            }
        ],
        contact: {
            email: "omar.rashid@example.com",
            instagram: "@omarscapes",
            phone: "+971 50 000 0000"
        }
    },
    {
        id: "a6",
        name: "Emily Clarke",
        avatar: "https://randomuser.me/api/portraits/women/62.jpg",
        bio: "London-based food and lifestyle photographer. I create beautiful, mouth-watering images for restaurants, cookbooks, and food brands that tell a story.",
        location: "London",
        country: "United Kingdom",
        categories: ["Food", "Commercial"],
        isVerified: false,
        languages: ["English"],
        startingPrice: 300,
        currency: "USD",
        deliveryDays: 5,
        packages: [
            {
                name: "Basic",
                price: 300,
                currency: "USD",
                description: "Menu or product shoot",
                deliveryDays: 5,
                includes: ["3-hour session", "15 edited photos", "Digital delivery"]
            },
            {
                name: "Standard",
                price: 650,
                currency: "USD",
                description: "Restaurant full shoot",
                deliveryDays: 7,
                includes: ["Full-day session", "35 edited photos", "Styling props", "Digital delivery"]
            },
            {
                name: "Premium",
                price: 1200,
                currency: "USD",
                description: "Cookbook or brand campaign",
                deliveryDays: 14,
                includes: ["2-day session", "70+ edited photos", "Creative direction", "Social media cuts", "Commercial license"]
            }
        ],
        contact: {
            email: "emily.clarke@example.com",
            instagram: "@emilyfoodlens",
            phone: "+44 7700 000000"
        }
    }
];
