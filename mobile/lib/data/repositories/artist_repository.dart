import 'package:flutter/foundation.dart';
import '../models/artist.dart';

class ArtistRepository extends ChangeNotifier {
  final List<Artist> _artists = [
    const Artist(
      id: 'artist-1',
      name: 'Amine Mansouri',
      handle: '@aminemansouri',
      role: 'Architectural & Cultural Photographer',
      location: 'Tunis, Tunisia',
      bio: 'Documenting the intersection of Mediterranean vernacular design and traditional Tunisian doors for over 12 years. Featured in National Geographic Traveler & ArchDaily.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=85',
      rating: 4.95,
      completedProjects: 84,
      categories: ['Architecture', 'Heritage', 'Street'],
      verified: true,
      badgeLevel: BadgeLevel.elite,
      equipment: [
        'Sony Alpha 7R V (61MP Full-Frame)',
        'Sony FE 35mm f/1.4 GM',
        'Sony FE 16-35mm f/2.8 GM II',
        'Leica M11 Rangefinder',
      ],
      samplePhotos: [
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=600&q=80',
      ],
    ),
    const Artist(
      id: 'artist-2',
      name: 'Leyla Bouazizi',
      handle: '@leylabouazizi',
      role: 'Archaeological & Documentary Visualist',
      location: 'Mahdia / Sousse, Tunisia',
      bio: 'Specializing in medium-format documentation of Roman mosaics, Ribat fortifications, and Sahel coastal traditions. Master of Fine Arts from ISBAT.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=85',
      rating: 4.92,
      completedProjects: 63,
      categories: ['Archaeology', 'Documentary', 'Drone'],
      verified: true,
      badgeLevel: BadgeLevel.pro,
      equipment: [
        'Fujifilm GFX 100 II (102MP Medium Format)',
        'GF 23mm f/4 R LM WR',
        'GF 110mm f/2 R LM WR',
        'DJI Inspire 3 (8K Full-Frame Cinema)',
      ],
      samplePhotos: [
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
      ],
    ),
    const Artist(
      id: 'artist-3',
      name: 'Karim Trabelsi',
      handle: '@karimtrabelsi',
      role: 'Saharan Landscape & Expedition Specialist',
      location: 'Tozeur / Douz, Tunisia',
      bio: 'Expedition leader and wilderness photographer chronicling the shifting sands of the Grand Erg Oriental and troglodyte Berber villages.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&q=85',
      rating: 4.88,
      completedProjects: 52,
      categories: ['Desert', 'Expedition', 'Astrophotography'],
      verified: true,
      badgeLevel: BadgeLevel.pro,
      equipment: [
        'Canon EOS R5 (45MP)',
        'Canon RF 24-70mm f/2.8L IS USM',
        'Canon RF 70-200mm f/2.8L IS USM',
        'Gitzo Systematic Carbon Tripod',
      ],
      samplePhotos: [
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
      ],
    ),
  ];

  List<Artist> get artists => List.unmodifiable(_artists);

  Artist? getById(String id) {
    try {
      return _artists.firstWhere((a) => a.id == id);
    } catch (_) {
      return null;
    }
  }

  Artist? getByHandle(String handle) {
    try {
      return _artists.firstWhere((a) => a.handle.toLowerCase() == handle.toLowerCase());
    } catch (_) {
      return null;
    }
  }
}
