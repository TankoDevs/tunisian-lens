import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../data/models/photo_item.dart';
import '../../theme/app_theme.dart';

class MasonryPhotoCard extends StatelessWidget {
  final PhotoItem photo;
  final VoidCallback onTap;

  const MasonryPhotoCard({
    super.key,
    required this.photo,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.edge, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.35),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            // Image with Explicit Aspect Ratio to eliminate layout jumps
            AspectRatio(
              aspectRatio: photo.aspectRatioValue,
              child: Hero(
                tag: 'photo-${photo.id}',
                child: CachedNetworkImage(
                  imageUrl: photo.thumbnailUrl,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    color: AppColors.surfaceElevated,
                    child: const Center(
                      child: SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppColors.ochre,
                        ),
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    color: AppColors.surfaceElevated,
                    child: const Icon(
                      Icons.broken_image_outlined,
                      color: AppColors.mist,
                      size: 32,
                    ),
                  ),
                ),
              ),
            ),

            // Top Region Badge
            Positioned(
              top: 10,
              left: 10,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.canvas.withOpacity(0.85),
                  borderRadius: BorderRadius.circular(100),
                  border: Border.all(
                    color: AppColors.ochre.withOpacity(0.4),
                    width: 0.8,
                  ),
                ),
                child: Text(
                  photo.region.label.toUpperCase(),
                  style: const TextStyle(
                    color: AppColors.ochre,
                    fontSize: 8.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                  ),
                ),
              ),
            ),

            // Bottom Gradient Vignette & Metadata
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.fromLTRB(12, 28, 12, 12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      AppColors.canvas.withOpacity(0.95),
                      AppColors.canvas.withOpacity(0.7),
                      Colors.transparent,
                    ],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      photo.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.alabaster,
                            height: 1.25,
                          ),
                    ),
                    const SizedBox(height: 5),
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_outlined,
                          size: 12,
                          color: AppColors.sidiAzure,
                        ),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(
                            photo.locationName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: AppColors.mist,
                              fontSize: 11,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
