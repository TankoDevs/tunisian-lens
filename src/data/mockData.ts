export type CreativeType = 'photographer' | 'videographer' | 'both';

export const PHOTO_CATEGORIES = [
    "Wedding",
    "Portrait",
    "Landscape",
    "Fashion",
    "Product",
    "Real Estate",
    "Event",
    "Documentary",
    "Street",
    "Architecture",
    "Food",
    "Commercial",
];

export const VIDEO_CATEGORIES = [
    "Wedding Film",
    "Commercial Video",
    "Music Video",
    "Event Coverage",
    "Social Media Content",
    "Documentary Film",
];

export const CATEGORIES = [...PHOTO_CATEGORIES, ...VIDEO_CATEGORIES];

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
    "Wedding Film",
    "Commercial Video",
    "Music Video",
    "Event Coverage",
    "Social Media Content",
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
    deadline: string;
    connectsRequired: number;
    clientId: string;
    clientName: string;
    status: 'open' | 'closed';
    createdAt: string;
    applicantCount: number;
    verifiedOnly?: boolean;
    creativeTypeRequired: CreativeType;
    isUrgent?: boolean;
    isFeatured?: boolean;
}

export interface JobApplication {
    id: string;
    jobId: string;
    creativeId: string;
    creativeName: string;
    creativeAvatar: string;
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
        applicantCount: 3,
        creativeTypeRequired: "photographer",
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
        applicantCount: 7,
        creativeTypeRequired: "photographer",
    },
    {
        id: "job-3",
        title: "Product Photography for E-Commerce Store",
        description: "Online store selling Tunisian handmade crafts needs clean, professional product photography on white backgrounds. Approximately 50 products. High volume and consistent lighting required.",
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
        applicantCount: 5,
        creativeTypeRequired: "photographer",
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
        applicantCount: 2,
        creativeTypeRequired: "photographer",
    },
    {
        id: "job-5",
        title: "Landscape Serie — Sahara Desert (Tozeur)",
        description: "Travel magazine looking for stunning landscape images from the Tozeur region, including the salt flats, palm trees, and dunes. We need a minimum of 40 final edited images delivered in high resolution.",
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
        applicantCount: 9,
        creativeTypeRequired: "photographer",
    },
    {
        id: "job-6",
        title: "Wedding Film — Cinematic Highlight Reel",
        description: "Looking for a talented videographer to capture our wedding day as a cinematic highlight film. 5-8 minute final edit with drone footage, audio from the ceremony, and a modern editing style. Two-day coverage required.",
        budget: 1500,
        currency: "USD",
        location: "Hammamet, Tunisia",
        isRemote: false,
        category: "Wedding Film",
        deadline: "2026-05-20",
        connectsRequired: 6,
        clientId: "client-1",
        clientName: "Ahmed Mansour",
        status: "open",
        createdAt: "2026-02-24T08:00:00Z",
        applicantCount: 2,
        creativeTypeRequired: "videographer",
    },
    {
        id: "job-7",
        title: "Commercial Video for Restaurant Launch",
        description: "New restaurant opening in La Marsa needs a 60-second promotional video for social media. Must include food close-ups, ambiance shots, and chef interview clip. Quick turnaround needed.",
        budget: 900,
        currency: "USD",
        location: "La Marsa, Tunisia",
        isRemote: false,
        category: "Commercial Video",
        deadline: "2026-04-10",
        connectsRequired: 4,
        clientId: "client-6",
        clientName: "La Marsa Kitchen",
        status: "open",
        createdAt: "2026-02-25T12:00:00Z",
        applicantCount: 4,
        creativeTypeRequired: "videographer",
    },
];

export const CITIES = [
    "Tunis", "Sfax", "Sousse", "Djerba", "Bizerte", "Nabeul",
    "Monastir", "Hammamet", "Gabes", "Tozeur",
    "Paris", "Dubai", "London", "New York", "Berlin",
    "Casablanca", "Cairo", "Barcelona",
];

export const COUNTRIES = [
    "Tunisia", "France", "UAE", "United Kingdom", "United States",
    "Germany", "Morocco", "Egypt", "Spain", "Italy", "Turkey", "Lebanon",
];

export interface ServicePackage {
    name: string;
    price: number;
    currency: string;
    description: string;
    deliveryDays: number;
    includes: string[];
}

export type BadgeLevel = 'verified' | 'pro' | 'elite';

export interface CreativeStats {
    jobsCompleted: number;
    repeatRate: number;     // 0–100
    successRate: number;    // 0–100
    avgResponseHours: number;
}

export interface BeforeAfterPair {
    id: string;
    label: string;
    before: string;  // image URL
    after: string;   // image URL
}

export interface PortfolioCollection {
    id: string;
    title: string;       // "Wedding Collection", "Urban Stories", etc.
    images: string[];
    beforeAfter?: BeforeAfterPair[];
}

export interface Artist {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    location: string;
    country: string;
    categories: string[];
    creativeType: CreativeType;
    isVerified: boolean;
    badgeLevel?: BadgeLevel;
    languages: string[];
    startingPrice: number;
    currency: string;
    deliveryDays: number;
    portfolioImages: string[];
    packages: ServicePackage[];
    contact: {
        email: string;
        instagram: string;
        phone: string;
    };
    stats?: CreativeStats;
    internationalAvailable?: boolean;
    styleTags?: string[];
    collections?: PortfolioCollection[];
    coordinates?: { lat: number; lng: number };
    equipment?: string[];
    availability?: "available" | "busy";
}

export const PROJECTS = [
    {
        id: "1",
        title: "Medina Shadows",
        image: "https://picsum.photos/seed/tunis-medina/800/600",
        category: "Street",
        likes: 124,
        artist: { id: "a1", name: "Amine Benali", avatar: "https://i.pravatar.cc/150?u=amine", isVerified: true }
    },
    {
        id: "2",
        title: "Sidi Bou Said Blue",
        image: "https://picsum.photos/seed/sidi-bou-said/800/600",
        category: "Architecture",
        likes: 89,
        artist: { id: "a2", name: "Sarra Jaziri", avatar: "https://i.pravatar.cc/150?u=sarra", isVerified: false }
    },
    {
        id: "3",
        title: "Sahara Sunset",
        image: "https://picsum.photos/seed/tunisia-sahara/800/600",
        category: "Landscape",
        likes: 256,
        artist: { id: "a3", name: "Karim Tounsi", avatar: "https://i.pravatar.cc/150?u=karim", isVerified: true }
    },
    {
        id: "4",
        title: "Traditional Wedding",
        image: "https://picsum.photos/seed/tunisia-culture/800/600",
        category: "Wedding",
        likes: 312,
        artist: { id: "a2", name: "Sarra Jaziri", avatar: "https://i.pravatar.cc/150?u=sarra", isVerified: false }
    },
    {
        id: "5",
        title: "Tunis Central Market",
        image: "https://picsum.photos/seed/tunis-market/800/600",
        category: "Street",
        likes: 98,
        artist: { id: "a1", name: "Amine Benali", avatar: "https://i.pravatar.cc/150?u=amine", isVerified: true }
    },
    {
        id: "6",
        title: "El Jem Amphitheater",
        image: "https://picsum.photos/seed/el-jem/800/600",
        category: "Architecture",
        likes: 175,
        artist: { id: "a3", name: "Karim Tounsi", avatar: "https://i.pravatar.cc/150?u=karim", isVerified: true }
    },
    {
        id: "7",
        title: "Paris Fashion Week",
        image: "https://picsum.photos/seed/paris-fashion/800/600",
        category: "Fashion",
        likes: 421,
        artist: { id: "a4", name: "Léa Moreau", avatar: "https://i.pravatar.cc/150?u=lea", isVerified: true }
    },
    {
        id: "8",
        title: "Dubai Skyline at Dusk",
        image: "https://picsum.photos/seed/dubai-skyline/800/600",
        category: "Architecture",
        likes: 538,
        artist: { id: "a5", name: "Omar Al-Rashid", avatar: "https://i.pravatar.cc/150?u=omar", isVerified: true }
    },
    {
        id: "9",
        title: "Borough Market",
        image: "https://picsum.photos/seed/london-market/800/600",
        category: "Food",
        likes: 203,
        artist: { id: "a6", name: "Emily Clarke", avatar: "https://i.pravatar.cc/150?u=emily", isVerified: false }
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
        creativeType: "photographer",
        isVerified: true,
        languages: ["Arabic", "French", "English"],
        startingPrice: 120,
        currency: "USD",
        deliveryDays: 5,
        portfolioImages: [
            "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=70",
            "https://images.unsplash.com/photo-1518982054-56f90e37e4e6?w=400&q=70",
            "https://images.unsplash.com/photo-1490077476659-095159692ab5?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 120, currency: "USD", description: "Half-day street photography session", deliveryDays: 5, includes: ["2-hour session", "20 edited photos", "Digital delivery"] },
            { name: "Standard", price: 250, currency: "USD", description: "Full-day documentary shoot", deliveryDays: 7, includes: ["6-hour session", "60 edited photos", "Digital delivery", "Location scouting"] },
            { name: "Premium", price: 450, currency: "USD", description: "Multi-day visual story", deliveryDays: 14, includes: ["2-day session", "100+ edited photos", "Print-ready files", "Online gallery", "Commercial license"] }
        ],
        contact: { email: "amine.b@example.com", instagram: "@aminelens", phone: "+216 00 000 000" },
        stats: { jobsCompleted: 24, repeatRate: 58, successRate: 92, avgResponseHours: 2 },
        equipment: ["Sony A7 IV", "35mm f/1.4 GM", "85mm f/1.8", "Godox V1 Flash"],
        availability: "available",
        badgeLevel: 'elite',
        internationalAvailable: true,
        styleTags: ["Street", "Documentary", "Black & White", "Cinematic"],
        coordinates: { lat: 36.8065, lng: 10.1815 },
        collections: [
            {
                id: "a1-col1",
                title: "Medina Streets",
                images: [
                    "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80",
                    "https://images.unsplash.com/photo-1518982054-56f90e37e4e6?w=800&q=80",
                    "https://images.unsplash.com/photo-1490077476659-095159692ab5?w=800&q=80",
                ],
                beforeAfter: [
                    {
                        id: "ba1",
                        label: "Street Scene – Before/After Edit",
                        before: "https://images.unsplash.com/photo-1518982054-56f90e37e4e6?w=800&q=40",
                        after: "https://images.unsplash.com/photo-1518982054-56f90e37e4e6?w=800&q=80",
                    }
                ]
            },
            {
                id: "a1-col2",
                title: "Urban Portraits",
                images: [
                    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80",
                    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
                ]
            }
        ],
    },
    {
        id: "a2",
        name: "Sarra Jaziri",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Capturing love stories and architectural marvels. Available for weddings worldwide. Based in Sousse, I blend traditional ceremony with contemporary artistic vision.",
        location: "Sousse",
        country: "Tunisia",
        categories: ["Wedding", "Architecture"],
        creativeType: "photographer",
        isVerified: false,
        languages: ["Arabic", "French"],
        startingPrice: 400,
        currency: "USD",
        deliveryDays: 14,
        portfolioImages: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=70",
            "https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 400, currency: "USD", description: "Wedding ceremony coverage", deliveryDays: 14, includes: ["4-hour coverage", "100 edited photos", "Online gallery"] },
            { name: "Standard", price: 800, currency: "USD", description: "Full wedding day", deliveryDays: 21, includes: ["8-hour coverage", "200 edited photos", "Online gallery", "Printed album (20 pages)"] },
            { name: "Premium", price: 1400, currency: "USD", description: "Complete wedding package", deliveryDays: 30, includes: ["2-day coverage", "350+ edited photos", "Drone footage", "Luxury album", "USB drive"] }
        ],
        contact: { email: "sarra.j@example.com", instagram: "@sarraphoto", phone: "+216 11 111 111" },
        stats: { jobsCompleted: 12, repeatRate: 41, successRate: 88, avgResponseHours: 6 },
        equipment: ["Canon R5", "24-70mm f/2.8L", "50mm f/1.2L", "DJI Mavic 3 Pro"],
        availability: "busy",
        badgeLevel: 'pro',
        internationalAvailable: true,
        styleTags: ["Wedding", "Romantic", "Architecture", "Fine Art"],
        coordinates: { lat: 35.8256, lng: 10.6369 },
        collections: [
            {
                id: "a2-col1",
                title: "Wedding Stories",
                images: [
                    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
                    "https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=800&q=80",
                ]
            },
        ],
    },
    {
        id: "a3",
        name: "Karim Tounsi",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg",
        bio: "Landscape photographer exploring the diverse beauty of Tunisia, from the Mediterranean coast to the Sahara Desert. My work has been featured in National Geographic Traveller.",
        location: "Tozeur",
        country: "Tunisia",
        categories: ["Landscape", "Documentary"],
        creativeType: "photographer",
        isVerified: true,
        languages: ["Arabic", "French", "English"],
        startingPrice: 200,
        currency: "USD",
        deliveryDays: 10,
        portfolioImages: [
            "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=70",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=70",
            "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 200, currency: "USD", description: "Single location landscape session", deliveryDays: 7, includes: ["Sunrise or sunset shoot", "15 edited photos", "Digital delivery"] },
            { name: "Standard", price: 500, currency: "USD", description: "Multi-location day tour", deliveryDays: 10, includes: ["Full-day shoot", "40 edited photos", "Drone aerial shots", "Digital delivery"] },
            { name: "Premium", price: 900, currency: "USD", description: "Desert expedition series", deliveryDays: 21, includes: ["3-day expedition", "80+ edited photos", "Drone footage", "Commercial license", "Print-ready files"] }
        ],
        contact: { email: "karim.t@example.com", instagram: "@karimscapes", phone: "+216 22 222 222" },
        stats: { jobsCompleted: 31, repeatRate: 65, successRate: 96, avgResponseHours: 4 },
        equipment: ["Nikon Z9", "14-24mm f/2.8S", "70-200mm f/2.8S", "Gitzo Tripod"],
        availability: "available",
        badgeLevel: 'elite',
        internationalAvailable: false,
        styleTags: ["Landscape", "Aerial", "Sahara", "Golden Hour", "Documentary"],
        coordinates: { lat: 33.9197, lng: 8.1339 },
        collections: [
            {
                id: "a3-col1",
                title: "Sahara & South",
                images: [
                    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
                    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80",
                ],
                beforeAfter: [
                    {
                        id: "a3-ba1",
                        label: "Sahara Dunes – RAW vs Edited",
                        before: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=30",
                        after: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=85",
                    }
                ]
            },
        ],
    },
    {
        id: "a4",
        name: "Léa Moreau",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        bio: "Parisian fashion and portrait photographer with 8 years of editorial experience. I've worked with Vogue, Elle, and leading luxury brands across Europe and the Middle East.",
        location: "Paris",
        country: "France",
        categories: ["Fashion", "Portrait"],
        creativeType: "photographer",
        isVerified: true,
        languages: ["French", "English", "Italian"],
        startingPrice: 350,
        currency: "USD",
        deliveryDays: 7,
        portfolioImages: [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=70",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=70",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 350, currency: "USD", description: "Portrait or headshot session", deliveryDays: 5, includes: ["2-hour studio session", "15 retouched photos", "Digital delivery"] },
            { name: "Standard", price: 750, currency: "USD", description: "Editorial fashion shoot", deliveryDays: 7, includes: ["Half-day shoot", "30 retouched photos", "Styling consultation", "Digital delivery"] },
            { name: "Premium", price: 1800, currency: "USD", description: "Full editorial campaign", deliveryDays: 14, includes: ["Full-day shoot", "60+ retouched photos", "Creative direction", "Lookbook layout", "Commercial license"] }
        ],
        contact: { email: "lea.moreau@example.com", instagram: "@leamorphoto", phone: "+33 6 00 00 00 00" },
        stats: { jobsCompleted: 47, repeatRate: 72, successRate: 98, avgResponseHours: 6 },
        badgeLevel: 'elite',
        internationalAvailable: true,
        styleTags: ["Fashion", "Editorial", "Luxury", "Portrait", "Commercial"],
        coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    {
        id: "a5",
        name: "Omar Al-Rashid",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        bio: "Dubai-based architectural and commercial photographer. My work captures the intersection of tradition and modernity across the UAE and the wider Gulf region.",
        location: "Dubai",
        country: "UAE",
        categories: ["Architecture", "Commercial"],
        creativeType: "photographer",
        isVerified: true,
        languages: ["Arabic", "English"],
        startingPrice: 500,
        currency: "USD",
        deliveryDays: 7,
        portfolioImages: [
            "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70",
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=70",
            "https://images.unsplash.com/photo-1582648257702-0e19fb53e8b5?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 500, currency: "USD", description: "Interior or exterior shoot", deliveryDays: 5, includes: ["Half-day shoot", "20 edited photos", "Digital delivery"] },
            { name: "Standard", price: 1200, currency: "USD", description: "Full property or project shoot", deliveryDays: 7, includes: ["Full-day shoot", "50 edited photos", "Twilight shots", "Digital delivery"] },
            { name: "Premium", price: 2500, currency: "USD", description: "Complete commercial campaign", deliveryDays: 14, includes: ["2-day shoot", "100+ edited photos", "Drone aerials", "Virtual tour content", "Commercial license"] }
        ],
        contact: { email: "omar.rashid@example.com", instagram: "@omarscapes", phone: "+971 50 000 0000" },
        stats: { jobsCompleted: 38, repeatRate: 60, successRate: 94, avgResponseHours: 10 },
        badgeLevel: 'pro',
        internationalAvailable: true,
        styleTags: ["Architecture", "Commercial", "Cityscape", "Twilight"],
        coordinates: { lat: 25.2048, lng: 55.2708 },
    },
    {
        id: "a6",
        name: "Emily Clarke",
        avatar: "https://randomuser.me/api/portraits/women/62.jpg",
        bio: "London-based food and lifestyle photographer. I create beautiful, mouth-watering images for restaurants, cookbooks, and food brands that tell a story.",
        location: "London",
        country: "United Kingdom",
        categories: ["Food", "Commercial"],
        creativeType: "photographer",
        isVerified: false,
        languages: ["English"],
        startingPrice: 300,
        currency: "USD",
        deliveryDays: 5,
        portfolioImages: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=70",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70",
            "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 300, currency: "USD", description: "Menu or product shoot", deliveryDays: 5, includes: ["3-hour session", "15 edited photos", "Digital delivery"] },
            { name: "Standard", price: 650, currency: "USD", description: "Restaurant full shoot", deliveryDays: 7, includes: ["Full-day session", "35 edited photos", "Styling props", "Digital delivery"] },
            { name: "Premium", price: 1200, currency: "USD", description: "Cookbook or brand campaign", deliveryDays: 14, includes: ["2-day session", "70+ edited photos", "Creative direction", "Social media cuts", "Commercial license"] }
        ],
        contact: { email: "emily.c@example.com", instagram: "@emilyfoodphoto", phone: "+44 77 00 00 00 00" },
        stats: { jobsCompleted: 8, repeatRate: 25, successRate: 80, avgResponseHours: 18 },
        badgeLevel: 'verified',
        internationalAvailable: false,
        styleTags: ["Food", "Lifestyle", "Commercial", "Warm Tones"],
        coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    {
        id: "a7",
        name: "Youssef Khelifi",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        bio: "Cinematic wedding and event videographer based in Tunis. I create emotional, story-driven films that couples treasure forever. Equipped with 4K cameras, drones, and professional audio.",
        location: "Tunis",
        country: "Tunisia",
        categories: ["Wedding Film", "Event Coverage"],
        creativeType: "videographer",
        isVerified: true,
        languages: ["Arabic", "French", "English"],
        startingPrice: 500,
        currency: "USD",
        deliveryDays: 14,
        portfolioImages: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
            "https://images.unsplash.com/photo-1564419320408-38e75470aed8?w=400&q=70",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 500, currency: "USD", description: "Wedding highlight reel (3-5 min)", deliveryDays: 14, includes: ["Full-day coverage", "3-5 min highlight film", "Digital delivery"] },
            { name: "Standard", price: 1200, currency: "USD", description: "Full wedding film", deliveryDays: 21, includes: ["Full-day coverage", "8-12 min film", "Highlight reel", "Drone footage", "Raw footage"] },
            { name: "Premium", price: 2200, currency: "USD", description: "Cinematic wedding package", deliveryDays: 30, includes: ["2-day coverage", "15+ min film", "Highlight reel", "Drone", "Same-day edit", "USB delivery"] }
        ],
        contact: { email: "youssef.k@example.com", instagram: "@yousseffilms", phone: "+216 33 333 333" },
        stats: { jobsCompleted: 19, repeatRate: 52, successRate: 90, avgResponseHours: 3 },
        equipment: ["Blackmagic 6K Pro", "Sigma Art Lenses", "DJI Ronin RS3", "Sennheiser Audio"],
        availability: "available",
        badgeLevel: 'pro' as const,
        internationalAvailable: true,
        styleTags: ["Wedding Film", "Cinematic", "Drone", "Emotional"],
        coordinates: { lat: 36.8065, lng: 10.1815 },
    },
    {
        id: "a8",
        name: "Nadia Bouazizi",
        avatar: "https://randomuser.me/api/portraits/women/35.jpg",
        bio: "Commercial and social media videographer specializing in brand storytelling. I help businesses in Tunisia and beyond create compelling video content that drives engagement and conversions.",
        location: "Sfax",
        country: "Tunisia",
        categories: ["Commercial Video", "Social Media Content", "Music Video"],
        creativeType: "videographer",
        isVerified: true,
        languages: ["Arabic", "French"],
        startingPrice: 350,
        currency: "USD",
        deliveryDays: 7,
        portfolioImages: [
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=70",
            "https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=400&q=70",
            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=70"
        ],
        packages: [
            { name: "Basic", price: 350, currency: "USD", description: "Social media video (30-60s)", deliveryDays: 5, includes: ["Half-day shoot", "1 edited video", "Vertical + horizontal cuts", "Digital delivery"] },
            { name: "Standard", price: 800, currency: "USD", description: "Brand promo video (1-2 min)", deliveryDays: 7, includes: ["Full-day shoot", "1-2 min edited video", "Social cuts", "Color grading", "Background music"] },
            { name: "Premium", price: 1800, currency: "USD", description: "Full video campaign", deliveryDays: 14, includes: ["2-day shoot", "3 edited videos", "Drone footage", "Motion graphics", "Commercial license"] }
        ],
        contact: { email: "nadia.b@example.com", instagram: "@nadiafilms", phone: "+216 44 444 444" },
        stats: { jobsCompleted: 15, repeatRate: 46, successRate: 87, avgResponseHours: 7 },
        badgeLevel: 'verified' as const,
        internationalAvailable: false,
        styleTags: ["Brand Video", "Social Media", "Commercial", "Music Video"],
        coordinates: { lat: 34.7473, lng: 10.7596 },
    },
];

// ─── Gear Market ────────────────────────────────────────────────────────────

export type GearCondition = 'New' | 'Like New' | 'Used';

export type GearCategory = 'Camera' | 'Lens' | 'Drone' | 'Lighting' | 'Tripod' | 'Audio' | 'Accessories';

export const GEAR_CATEGORIES: GearCategory[] = [
    'Camera', 'Lens', 'Drone', 'Lighting', 'Tripod', 'Audio', 'Accessories'
];

export const GEAR_BRANDS = [
    'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Leica', 'Panasonic', 'Olympus',
    'DJI', 'GoPro', 'Blackmagic', 'Zhiyun', 'Godox', 'Profoto',
    'Rode', 'Sennheiser', 'Zoom', 'Manfrotto', 'Peak Design', 'Other'
];

export interface GearListing {
    id: string;
    title: string;
    images: string[];
    price: number;
    currency: string;
    condition: GearCondition;
    location: string;
    description: string;
    category: GearCategory;
    brand: string;
    sellerId: string;
    sellerName: string;
    sellerAvatar: string;
    isVerifiedSeller: boolean;
    createdAt: string;
    isAvailable: boolean;
}

export const MOCK_GEAR_LISTINGS: GearListing[] = [
    {
        id: 'gear-1',
        title: 'Sony A7 IV Mirrorless Camera Body',
        images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
        ],
        price: 2200,
        currency: 'USD',
        condition: 'Like New',
        location: 'Tunis, Tunisia',
        description: 'Sony A7 IV in excellent condition, purchased 6 months ago. Shutter count under 5,000. Comes with original box, charger, and one battery. No scratches on body or sensor. Perfect for photographers upgrading to full frame.',
        category: 'Camera',
        brand: 'Sony',
        sellerId: 'a1',
        sellerName: 'Amine Benali',
        sellerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-01T10:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-2',
        title: 'Canon RF 50mm f/1.2L USM Lens',
        images: [
            'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?w=800&q=80',
            'https://images.unsplash.com/photo-1542038374416-a76d756c2e0e?w=800&q=80',
        ],
        price: 1800,
        currency: 'USD',
        condition: 'Used',
        location: 'Sousse, Tunisia',
        description: 'Canon RF 50mm f/1.2L. Incredible portrait lens with razor-sharp optics. Minor wear on exterior but glass is pristine — no dust, fungus, or scratches. Includes hood, caps, and original pouch.',
        category: 'Lens',
        brand: 'Canon',
        sellerId: 'a2',
        sellerName: 'Sarra Jaziri',
        sellerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isVerifiedSeller: false,
        createdAt: '2026-03-02T14:30:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-3',
        title: 'DJI Mavic 3 Pro Drone — Complete Kit',
        images: [
            'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
            'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
        ],
        price: 1600,
        currency: 'USD',
        condition: 'Like New',
        location: 'Sfax, Tunisia',
        description: 'DJI Mavic 3 Pro with the Fly More Combo. Includes 3 batteries, ND filter set, carrying case, and charging hub. Only used for 4 flights — essentially new. Hasselblad camera system, 4/3 CMOS sensor.',
        category: 'Drone',
        brand: 'DJI',
        sellerId: 'a7',
        sellerName: 'Youssef Khelifi',
        sellerAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-02T16:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-4',
        title: 'Godox AD600Pro Strobe Light',
        images: [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
            'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80',
        ],
        price: 480,
        currency: 'USD',
        condition: 'Used',
        location: 'Tunis, Tunisia',
        description: 'Godox AD600Pro outdoor flash unit. 600Ws output, TTL compatible, built-in 2.4G wireless. Works perfectly. Selling because I upgraded to Profoto. Comes with battery, charger, and round head adapter.',
        category: 'Lighting',
        brand: 'Godox',
        sellerId: 'a3',
        sellerName: 'Karim Tounsi',
        sellerAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-03T09:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-5',
        title: 'Rode VideoMic Pro+ Shotgun Microphone',
        images: [
            'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
        ],
        price: 220,
        currency: 'USD',
        condition: 'Like New',
        location: 'Hammamet, Tunisia',
        description: 'Rode VideoMic Pro+ with Rycote Lyre shock mount. Barely used — purchased for one project. Includes deadcat windshield, camera mount, and original box. Excellent audio quality for video work.',
        category: 'Audio',
        brand: 'Rode',
        sellerId: 'a8',
        sellerName: 'Nadia Bouazizi',
        sellerAvatar: 'https://randomuser.me/api/portraits/women/35.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-03T12:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-6',
        title: 'Manfrotto 055 Carbon Fibre Tripod',
        images: [
            'https://images.unsplash.com/photo-1490217083006-62e18c553e05?w=800&q=80',
            'https://images.unsplash.com/photo-1452780212461-a1c7def8e3a5?w=800&q=80',
        ],
        price: 320,
        currency: 'USD',
        condition: 'Used',
        location: 'Nabeul, Tunisia',
        description: 'Manfrotto 055 4-section carbon fibre tripod with 496RC2 ball head. Very sturdy and lightweight. Some scratches on legs from field use but all locks and mechanisms work perfectly. Great for landscape and studio.',
        category: 'Tripod',
        brand: 'Manfrotto',
        sellerId: 'a1',
        sellerName: 'Amine Benali',
        sellerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-04T08:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-7',
        title: 'Fujifilm X100VI Compact Camera',
        images: [
            'https://images.unsplash.com/photo-1519183071298-a2962cd48b7d?w=800&q=80',
            'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80',
        ],
        price: 1350,
        currency: 'USD',
        condition: 'New',
        location: 'Tunis, Tunisia',
        description: 'Brand new, sealed in box. Received as a gift but already own one. 40MP APS-C sensor, 6-stop in-body stabilisation, 7 frames per second burst. The most coveted compact camera available.',
        category: 'Camera',
        brand: 'Fujifilm',
        sellerId: 'a4',
        sellerName: 'Léa Moreau',
        sellerAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-04T10:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-8',
        title: 'Sony FE 85mm f/1.4 GM Portrait Lens',
        images: [
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
            'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&q=80',
        ],
        price: 1400,
        currency: 'USD',
        condition: 'Like New',
        location: 'Bizerte, Tunisia',
        description: 'Sony FE 85mm G Master. The gold standard for portrait lenses. Buttery bokeh, edge-to-edge sharpness, XD linear motors for silent AF. Shutter count under 10k images. Includes all caps, hood, and original box.',
        category: 'Lens',
        brand: 'Sony',
        sellerId: 'a5',
        sellerName: 'Omar Al-Rashid',
        sellerAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-04T14:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-9',
        title: 'Peak Design Camera Backpack 30L',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
        ],
        price: 180,
        currency: 'USD',
        condition: 'Used',
        location: 'Monastir, Tunisia',
        description: 'Peak Design Everyday Backpack 30L in Ash colour. Used for about a year, still in great condition. All dividers and FlexFold included, laptop sleeve, weatherproof zip. The best camera bag I have ever owned.',
        category: 'Accessories',
        brand: 'Peak Design',
        sellerId: 'a6',
        sellerName: 'Emily Clarke',
        sellerAvatar: 'https://randomuser.me/api/portraits/women/62.jpg',
        isVerifiedSeller: false,
        createdAt: '2026-03-05T09:00:00Z',
        isAvailable: true,
    },
    {
        id: 'gear-10',
        title: 'Zhiyun Crane 4 3-Axis Gimbal',
        images: [
            'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
            'https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=800&q=80',
        ],
        price: 340,
        currency: 'USD',
        condition: 'Like New',
        location: 'Sfax, Tunisia',
        description: 'Zhiyun Crane 4 with OLED touchscreen and built-in fill light. Used on 3 video shoots total. Payload up to 4.5kg, 12-hour battery life. Perfect for mirrorless and DSLR setups. Includes carrying case.',
        category: 'Accessories',
        brand: 'Zhiyun',
        sellerId: 'a8',
        sellerName: 'Nadia Bouazizi',
        sellerAvatar: 'https://randomuser.me/api/portraits/women/35.jpg',
        isVerifiedSeller: true,
        createdAt: '2026-03-05T14:00:00Z',
        isAvailable: true,
    },
];
