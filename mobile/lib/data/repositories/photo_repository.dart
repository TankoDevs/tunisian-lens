import 'package:flutter/foundation.dart';
import '../models/photo_item.dart';

class PhotoRepository extends ChangeNotifier {
  final List<PhotoItem> _photos = [
    const PhotoItem(
      id: 'photo-1',
      title: 'Door of Sidi Bou Said',
      slug: 'door-of-sidi-bou-said',
      region: TunisianRegion.tunisAndSuburbs,
      locationName: 'Sidi Bou Said, Tunis',
      author: PhotoAuthor(
        name: 'Amine Mansouri',
        handle: '@aminemansouri',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        location: 'Tunis',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1800&q=90',
      aspectRatioValue: 0.8, // 4:5
      story: 'Traditional studded blue door architectural study in Sidi Bou Said, Tunis. Handcrafted brass studs trace traditional Andalusian crescent and star motifs, framed against pristine limestone whitewash.',
      tags: ['#architecture', '#blue', '#heritage', '#sidi_bou_said'],
      exif: PhotoExif(
        camera: 'Sony Alpha 7R V',
        lens: 'FE 35mm f/1.4 GM',
        focalLength: '35mm',
        aperture: 'f/2.8',
        shutterSpeed: '1/640s',
        iso: 100,
        latitude: 36.8712,
        longitude: 10.3414,
      ),
      capturedAt: '2026-08-14',
    ),
    const PhotoItem(
      id: 'photo-2',
      title: 'Colosseum of El Jem',
      slug: 'colosseum-of-el-jem',
      region: TunisianRegion.sahel,
      locationName: 'El Jem, Mahdia',
      author: PhotoAuthor(
        name: 'Leyla Bouazizi',
        handle: '@leylabouazizi',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
        location: 'Mahdia',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1800&q=90',
      aspectRatioValue: 1.33, // 4:3
      story: 'Third-century Roman amphitheatre rising majestically from the central plains of Tunisia. Golden hour sunlight rakes across tiered tier-arches, highlighting the preservation of this UNESCO World Heritage sanctuary.',
      tags: ['#history', '#roman', '#archaeology', '#el_jem'],
      exif: PhotoExif(
        camera: 'Fujifilm GFX 100 II',
        lens: 'GF 23mm f/4 R LM WR',
        focalLength: '23mm',
        aperture: 'f/8.0',
        shutterSpeed: '1/125s',
        iso: 160,
        latitude: 35.3000,
        longitude: 10.7083,
      ),
      capturedAt: '2026-09-02',
    ),
    const PhotoItem(
      id: 'photo-3',
      title: 'Dawn at Chott El Djerid',
      slug: 'dawn-chott-el-djerid',
      region: TunisianRegion.southAndSahara,
      locationName: 'Chott El Djerid, Tozeur',
      author: PhotoAuthor(
        name: 'Karim Trabelsi',
        handle: '@karimtrabelsi',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        location: 'Tozeur',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1800&q=90',
      aspectRatioValue: 1.77, // 16:9
      story: 'Endless salt flats reflecting morning violet hues at sunrise in the heart of the Sahara. The crystallized salt crust produces iridescent mirages as temperature shifts rapidly across the lake bed.',
      tags: ['#desert', '#saltflat', '#sunrise', '#sahara'],
      exif: PhotoExif(
        camera: 'Canon EOS R5',
        lens: 'RF 24-70mm f/2.8L IS USM',
        focalLength: '45mm',
        aperture: 'f/5.6',
        shutterSpeed: '1/250s',
        iso: 200,
        latitude: 33.7000,
        longitude: 8.4333,
      ),
      capturedAt: '2026-07-28',
    ),
    const PhotoItem(
      id: 'photo-4',
      title: 'Medina Brass Craftsman',
      slug: 'medina-brass-craftsman',
      region: TunisianRegion.tunisAndSuburbs,
      locationName: 'Medina of Tunis',
      author: PhotoAuthor(
        name: 'Yasmine Sassi',
        handle: '@yasminesassi',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80',
        location: 'Tunis',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=1800&q=90',
      aspectRatioValue: 0.8,
      story: 'Master artisan engraving intricate geometric arabesque patterns on a traditional brass tea service inside the covered souks of the Tunis Medina. A discipline preserved through centuries.',
      tags: ['#craft', '#medina', '#portrait', '#culture'],
      exif: PhotoExif(
        camera: 'Leica Q2',
        lens: 'Summilux 28mm f/1.7 ASPH',
        focalLength: '28mm',
        aperture: 'f/2.0',
        shutterSpeed: '1/160s',
        iso: 400,
        latitude: 36.7992,
        longitude: 10.1706,
      ),
      capturedAt: '2026-08-19',
    ),
    const PhotoItem(
      id: 'photo-5',
      title: 'Chebika Mountain Oasis',
      slug: 'chebika-mountain-oasis',
      region: TunisianRegion.southAndSahara,
      locationName: 'Chebika, Tozeur',
      author: PhotoAuthor(
        name: 'Karim Trabelsi',
        handle: '@karimtrabelsi',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        location: 'Tozeur',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=90',
      aspectRatioValue: 1.33,
      story: 'Fresh spring waters cascading through arid canyon crevices beneath lush date palm canopies, juxtaposing sharp desert rock with vital desert life.',
      tags: ['#oasis', '#mountains', '#nature', '#water'],
      exif: PhotoExif(
        camera: 'Sony Alpha 7R V',
        lens: 'FE 16-35mm f/2.8 GM II',
        focalLength: '18mm',
        aperture: 'f/7.1',
        shutterSpeed: '1/400s',
        iso: 100,
        latitude: 34.3167,
        longitude: 7.9333,
      ),
      capturedAt: '2026-09-11',
    ),
    const PhotoItem(
      id: 'photo-6',
      title: 'Djerbahood Street Art',
      slug: 'djerbahood-erriadh',
      region: TunisianRegion.sahel,
      locationName: 'Erriadh, Djerba',
      author: PhotoAuthor(
        name: 'Leyla Bouazizi',
        handle: '@leylabouazizi',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
        location: 'Djerba',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=90',
      aspectRatioValue: 1.0, // Square
      story: 'Open-air mural gallery nestled within the historic alleys of Erriadh, Djerba. International contemporary artists blend global street art with whitewashed Tunisian vernacular walls.',
      tags: ['#art', '#djerba', '#streetart', '#color'],
      exif: PhotoExif(
        camera: 'Nikon Z8',
        lens: 'NIKKOR Z 50mm f/1.2 S',
        focalLength: '50mm',
        aperture: 'f/2.2',
        shutterSpeed: '1/1000s',
        iso: 64,
        latitude: 33.8167,
        longitude: 10.8500,
      ),
      capturedAt: '2026-06-15',
    ),
    const PhotoItem(
      id: 'photo-7',
      title: 'Needles of Tabarka',
      slug: 'needles-of-tabarka',
      region: TunisianRegion.north,
      locationName: 'Tabarka, Jendouba',
      author: PhotoAuthor(
        name: 'Amine Mansouri',
        handle: '@aminemansouri',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        location: 'Tunis',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=90',
      aspectRatioValue: 1.77,
      story: 'Dramatic ochre sandstone pinnacles sculpted by Mediterranean waves along the rocky northern coastline of Tabarka, near the Algerian frontier.',
      tags: ['#coast', '#tabarka', '#ocean', '#north'],
      exif: PhotoExif(
        camera: 'Hasselblad X2D 100C',
        lens: 'XCD 38mm f/2.5 V',
        focalLength: '38mm',
        aperture: 'f/8.0',
        shutterSpeed: '1/80s',
        iso: 64,
        latitude: 36.9544,
        longitude: 8.7580,
      ),
      capturedAt: '2026-09-20',
    ),
    const PhotoItem(
      id: 'photo-8',
      title: 'Troglodyte Dwelling of Matmata',
      slug: 'troglodyte-matmata',
      region: TunisianRegion.southAndSahara,
      locationName: 'Matmata, Gabès',
      author: PhotoAuthor(
        name: 'Karim Trabelsi',
        handle: '@karimtrabelsi',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        location: 'Tozeur',
      ),
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      fullImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1800&q=90',
      aspectRatioValue: 0.8,
      story: 'Subterranean Berber courtyards excavated from sandstone bedrock, offering natural thermal protection from the extreme Saharan temperatures.',
      tags: ['#berber', '#matmata', '#architecture', '#underground'],
      exif: PhotoExif(
        camera: 'Sony Alpha 7R V',
        lens: 'FE 24mm f/1.4 GM',
        focalLength: '24mm',
        aperture: 'f/4.0',
        shutterSpeed: '1/320s',
        iso: 160,
        latitude: 33.5433,
        longitude: 9.9678,
      ),
      capturedAt: '2026-08-04',
    ),
  ];

  final Set<String> _favoriteIds = {};

  List<PhotoItem> get photos => List.unmodifiable(_photos);
  Set<String> get favoriteIds => Set.unmodifiable(_favoriteIds);

  List<PhotoItem> getByRegion(TunisianRegion region) {
    if (region == TunisianRegion.all) return _photos;
    return _photos.where((p) => p.region == region).toList();
  }

  PhotoItem? getBySlug(String slug) {
    try {
      return _photos.firstWhere((p) => p.slug == slug);
    } catch (_) {
      return null;
    }
  }

  PhotoItem? getById(String id) {
    try {
      return _photos.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }

  List<PhotoItem> search(String query) {
    final q = query.toLowerCase().trim();
    if (q.isEmpty) return _photos;
    return _photos.where((p) {
      return p.title.toLowerCase().contains(q) ||
          p.locationName.toLowerCase().contains(q) ||
          p.story.toLowerCase().contains(q) ||
          p.author.name.toLowerCase().contains(q) ||
          p.tags.any((t) => t.toLowerCase().contains(q));
    }).toList();
  }

  bool isFavorite(String id) => _favoriteIds.contains(id);

  void toggleFavorite(String id) {
    if (_favoriteIds.contains(id)) {
      _favoriteIds.remove(id);
    } else {
      _favoriteIds.add(id);
    }
    notifyListeners();
  }
}
