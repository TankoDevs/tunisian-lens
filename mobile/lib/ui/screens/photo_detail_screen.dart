import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import '../../data/models/photo_item.dart';
import '../../data/repositories/photo_repository.dart';
import '../../data/repositories/artist_repository.dart';
import '../../theme/app_theme.dart';
import '../widgets/exif_optics_sheet.dart';
import 'artist_profile_screen.dart';

class PhotoDetailScreen extends StatelessWidget {
  final PhotoItem photo;

  const PhotoDetailScreen({
    super.key,
    required this.photo,
  });

  @override
  Widget build(BuildContext context) {
    final photoRepo = context.watch<PhotoRepository>();
    final isFav = photoRepo.isFavorite(photo.id);
    final artistRepo = context.read<ArtistRepository>();
    final artist = artistRepo.getByHandle(photo.author.handle);

    return Scaffold(
      backgroundColor: AppColors.canvas,
      body: CustomScrollView(
        slivers: [
          // App Bar with Full-Bleed Image
          SliverAppBar(
            expandedHeight: MediaQuery.of(context).size.height * 0.58,
            pinned: true,
            backgroundColor: AppColors.canvas,
            leading: Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircleAvatar(
                backgroundColor: AppColors.canvas.withOpacity(0.75),
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 16, color: AppColors.alabaster),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: CircleAvatar(
                  backgroundColor: AppColors.canvas.withOpacity(0.75),
                  child: IconButton(
                    icon: Icon(
                      isFav ? Icons.favorite_rounded : Icons.favorite_outline_rounded,
                      size: 18,
                      color: isFav ? AppColors.rose : AppColors.alabaster,
                    ),
                    onPressed: () => photoRepo.toggleFavorite(photo.id),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(right: 12.0),
                child: CircleAvatar(
                  backgroundColor: AppColors.canvas.withOpacity(0.75),
                  child: IconButton(
                    icon: const Icon(Icons.share_outlined, size: 18, color: AppColors.alabaster),
                    onPressed: () {
                      Share.share(
                        'Explore "${photo.title}" from ${photo.locationName} on Tunisian Lens: https://tunisian-lens.pages.dev/photo/${photo.slug}',
                        subject: photo.title,
                      );
                    },
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: InteractiveViewer(
                minScale: 1.0,
                maxScale: 3.5,
                child: Hero(
                  tag: 'photo-${photo.id}',
                  child: CachedNetworkImage(
                    imageUrl: photo.fullImageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: AppColors.surface,
                      child: const Center(
                        child: CircularProgressIndicator(color: AppColors.ochre),
                      ),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: AppColors.surface,
                      child: const Icon(Icons.broken_image_outlined, color: AppColors.mist),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Story & Technical Metadata Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Region & Location Header
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(100),
                          border: Border.all(color: AppColors.edge, width: 1),
                        ),
                        child: Text(
                          photo.region.label.toUpperCase(),
                          style: const TextStyle(
                            color: AppColors.ochre,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.location_on_outlined, size: 14, color: AppColors.sidiAzure),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          photo.locationName,
                          style: const TextStyle(
                            color: AppColors.mist,
                            fontSize: 13,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Title
                  Text(
                    photo.title,
                    style: Theme.of(context).textTheme.displayMedium?.copyWith(
                          fontSize: 26,
                          fontWeight: FontWeight.w500,
                          color: AppColors.alabaster,
                          height: 1.2,
                        ),
                  ),
                  const SizedBox(height: 20),

                  // EXIF Quick Action Bar
                  if (photo.exif != null && photo.exif!.hasOptics) ...[
                    InkWell(
                      onTap: () {
                        ExifOpticsSheet.show(context, photo.exif!, photo.locationName);
                      },
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.edge, width: 1),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: AppColors.ochre.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.camera_outlined, size: 16, color: AppColors.ochre),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${photo.exif?.camera ?? "Camera"} · ${photo.exif?.lens ?? "Optics"}',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: AppColors.alabaster,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${photo.exif?.aperture ?? ""} · ${photo.exif?.shutterSpeed ?? ""} · ISO ${photo.exif?.iso ?? ""}',
                                    style: const TextStyle(
                                      color: AppColors.mistMuted,
                                      fontSize: 11,
                                      fontFamily: 'monospace',
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.mist),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Curatorial Narrative Story
                  const Text(
                    'CURATORIAL PROVENANCE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.5,
                      color: AppColors.ochre,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    photo.story,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontSize: 15,
                          height: 1.7,
                          color: AppColors.alabaster.withOpacity(0.9),
                          fontWeight: FontWeight.w300,
                        ),
                  ),
                  const SizedBox(height: 24),

                  // Cultural Tags
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: photo.tags.map((tag) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(100),
                          border: Border.all(color: AppColors.edge, width: 1),
                        ),
                        child: Text(
                          tag,
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.mist,
                            fontFamily: 'monospace',
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 32),

                  // Photographer Credit Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.edge, width: 1),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 22,
                          backgroundImage: photo.author.avatarUrl != null
                              ? CachedNetworkImageProvider(photo.author.avatarUrl!)
                              : null,
                          backgroundColor: AppColors.surfaceElevated,
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                photo.author.name,
                                style: const TextStyle(
                                  color: AppColors.alabaster,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                photo.author.handle,
                                style: const TextStyle(
                                  color: AppColors.mist,
                                  fontSize: 12,
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (artist != null)
                          OutlinedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ArtistProfileScreen(artist: artist),
                                ),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.ochre,
                              side: const BorderSide(color: AppColors.ochre, width: 1),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(100),
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                            ),
                            child: const Text('View Folio', style: TextStyle(fontSize: 11)),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
