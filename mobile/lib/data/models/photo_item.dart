enum TunisianRegion {
  all('All Regions', 'Complete Archive'),
  north('North', 'Bizerte, Tabarka, Cap Bon'),
  tunisAndSuburbs('Tunis & Suburbs', 'Carthage, Sidi Bou Said, Medina'),
  sahel('Sahel', 'Sousse, Monastir, Mahdia, El Jem'),
  southAndSahara('South & Sahara', 'Tozeur, Tataouine, Matmata, Douz');

  final String label;
  final String sublabel;
  const TunisianRegion(this.label, this.sublabel);

  static TunisianRegion fromString(String val) {
    switch (val) {
      case 'North':
        return TunisianRegion.north;
      case 'Tunis & Suburbs':
        return TunisianRegion.tunisAndSuburbs;
      case 'Sahel':
        return TunisianRegion.sahel;
      case 'South & Sahara':
        return TunisianRegion.southAndSahara;
      default:
        return TunisianRegion.all;
    }
  }
}

class PhotoExif {
  final String? camera;
  final String? lens;
  final String? focalLength;
  final String? aperture;
  final String? shutterSpeed;
  final int? iso;
  final double? latitude;
  final double? longitude;

  const PhotoExif({
    this.camera,
    this.lens,
    this.focalLength,
    this.aperture,
    this.shutterSpeed,
    this.iso,
    this.latitude,
    this.longitude,
  });

  bool get hasOptics =>
      camera != null || lens != null || aperture != null || shutterSpeed != null;
}

class PhotoAuthor {
  final String name;
  final String handle;
  final String? avatarUrl;
  final String? location;

  const PhotoAuthor({
    required this.name,
    required this.handle,
    this.avatarUrl,
    this.location,
  });
}

class PhotoItem {
  final String id;
  final String title;
  final String slug;
  final TunisianRegion region;
  final String locationName;
  final PhotoAuthor author;
  final String thumbnailUrl;
  final String fullImageUrl;
  final double aspectRatioValue; // e.g., 0.8 for 4:5, 1.33 for 4:3, 1.77 for 16:9
  final String story;
  final List<String> tags;
  final PhotoExif? exif;
  final String? capturedAt;

  const PhotoItem({
    required this.id,
    required this.title,
    required this.slug,
    required this.region,
    required this.locationName,
    required this.author,
    required this.thumbnailUrl,
    required this.fullImageUrl,
    this.aspectRatioValue = 0.8,
    required this.story,
    required this.tags,
    this.exif,
    this.capturedAt,
  });
}
