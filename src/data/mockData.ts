export const CATEGORIES = [
    "Wedding",
    "Street",
    "Portrait",
    "Landscape",
    "Fashion",
    "Architecture",
    "Food",
    "Documentary"
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
    "Tozeur"
];

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
    }
];

export const ARTISTS = [
    {
        id: "a1",
        name: "Amine Benali",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        bio: "Street photographer capturing the soul of Tunis. Lover of light and shadow.",
        location: "Tunis",
        categories: ["Street", "Documentary"],
        isVerified: true,
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
        bio: "Capturing love stories and architectural marvels. Available for weddings worldwide.",
        location: "Sousse",
        categories: ["Wedding", "Architecture"],
        isVerified: false,
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
        bio: "Landscape photographer exploring the diverse beauty of Tunisia, from the Mediterranean to the Sahara.",
        location: "Tozeur",
        categories: ["Landscape", "Travel"],
        isVerified: true,
        contact: {
            email: "karim.t@example.com",
            instagram: "@karimscapes",
            phone: "+216 22 222 222"
        }
    }
];
