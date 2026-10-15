enum BadgeLevel {
  verified('Verified', 'Identity Confirmed'),
  pro('Pro', 'Top Production Quality'),
  elite('Elite', 'National Master Curator');

  final String label;
  final String description;
  const BadgeLevel(this.label, this.description);
}

class Artist {
  final String id;
  final String name;
  final String handle;
  final String role;
  final String location;
  final String bio;
  final String avatarUrl;
  final String coverUrl;
  final double rating;
  final int completedProjects;
  final List<String> categories;
  final bool verified;
  final BadgeLevel badgeLevel;
  final List<String> equipment;
  final List<String> samplePhotos;

  const Artist({
    required this.id,
    required this.name,
    required this.handle,
    required this.role,
    required this.location,
    required this.bio,
    required this.avatarUrl,
    required this.coverUrl,
    this.rating = 4.9,
    this.completedProjects = 42,
    required this.categories,
    this.verified = true,
    this.badgeLevel = BadgeLevel.pro,
    required this.equipment,
    required this.samplePhotos,
  });
}
