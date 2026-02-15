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
        image: "https://images.unsplash.com/photo-1544212903-a44b83446c67?q=80&w=800&auto=format&fit=crop",
        category: "Street",
        likes: 124,
        artist: {
            id: "a1",
            name: "Amine Benali",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        }
    },
    {
        id: "2",
        title: "Sidi Bou Said Blue",
        image: "https://images.unsplash.com/photo-1588616183633-e71c990b7972?q=80&w=800&auto=format&fit=crop",
        category: "Architecture",
        likes: 89,
        artist: {
            id: "a2",
            name: "Sarra Jaziri",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        }
    },
    {
        id: "3",
        title: "Sahara Sunset",
        image: "https://images.unsplash.com/photo-1549309019-38374d6c6e7f?q=80&w=800&auto=format&fit=crop",
        category: "Landscape",
        likes: 256,
        artist: {
            id: "a3",
            name: "Karim Tounsi",
            avatar: "https://randomuser.me/api/portraits/men/85.jpg"
        }
    },
    {
        id: "4",
        title: "Traditional Wedding",
        image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
        category: "Wedding",
        likes: 312,
        artist: {
            id: "a2",
            name: "Sarra Jaziri",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        }
    },
    {
        id: "5",
        title: "Tunis Central Market",
        image: "https://images.unsplash.com/photo-1577038896013-0599c2776c5f?q=80&w=800&auto=format&fit=crop",
        category: "Street",
        likes: 98,
        artist: {
            id: "a1",
            name: "Amine Benali",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        }
    },
    {
        id: "6",
        title: "El Jem Amphitheater",
        image: "https://images.unsplash.com/photo-1605713936660-f4633d6b05d1?q=80&w=800&auto=format&fit=crop",
        category: "Architecture",
        likes: 175,
        artist: {
            id: "a3",
            name: "Karim Tounsi",
            avatar: "https://randomuser.me/api/portraits/men/85.jpg"
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
        contact: {
            email: "karim.t@example.com",
            instagram: "@karimscapes",
            phone: "+216 22 222 222"
        }
    }
];
