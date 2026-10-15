import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../../data/models/artist.dart';
import '../../data/repositories/photo_repository.dart';
import '../../theme/app_theme.dart';
import '../widgets/badge_pill.dart';
import '../widgets/masonry_photo_card.dart';
import 'photo_detail_screen.dart';

class ArtistProfileScreen extends StatelessWidget {
  final Artist artist;

  const ArtistProfileScreen({
    super.key,
    required this.artist,
  });

  @override
  Widget build(BuildContext context) {
    final photoRepo = context.watch<PhotoRepository>();
    final artistPhotos = photoRepo.photos
        .where((p) => p.author.handle.toLowerCase() == artist.handle.toLowerCase())
        .toList();

    return Scaffold(
      backgroundColor: AppColors.canvas,
      body: CustomScrollView(
        slivers: [
          // Cover Header
          SliverAppBar(
            expandedHeight: 200,
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
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: artist.coverUrl,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          AppColors.canvas.withOpacity(0.95),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Profile Overview
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Avatar & Badge Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.canvas, width: 4),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.5),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: CachedNetworkImage(
                            imageUrl: artist.avatarUrl,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const Spacer(),
                      BadgePill(level: artist.badgeLevel),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Name & Handle
                  Text(
                    artist.name,
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          fontSize: 22,
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${artist.handle} · ${artist.location}',
                    style: const TextStyle(
                      color: AppColors.mist,
                      fontSize: 12,
                      fontFamily: 'monospace',
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Bio
                  Text(
                    artist.bio,
                    style: const TextStyle(
                      color: AppColors.alabaster,
                      fontSize: 13.5,
                      fontWeight: FontWeight.w300,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Stats Strip
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.edge),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStat('Series', '${artist.completedProjects}'),
                        _buildDivider(),
                        _buildStat('Rating', '${artist.rating} ★'),
                        _buildDivider(),
                        _buildStat('Status', 'Available'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Primary Optics & Equipment Sheet
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.edge),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.camera_alt_outlined, size: 16, color: AppColors.ochre),
                            const SizedBox(width: 8),
                            const Text(
                              'VERIFIED OPTICS & EQUIPMENT',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                                color: AppColors.ochre,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        ...artist.equipment.map((item) => Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('• ', style: TextStyle(color: AppColors.ochre)),
                                  Expanded(
                                    child: Text(
                                      item,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: AppColors.mist,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Series Section Title
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'ARCHIVED WORKS',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.5,
                          color: AppColors.ochre,
                        ),
                      ),
                      Text(
                        '${artistPhotos.length} recorded',
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.mistMuted,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                ],
              ),
            ),
          ),

          // Artist's Masonry Works
          if (artistPhotos.isEmpty)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Center(
                  child: Text(
                    'No public series uploaded under this handle yet.',
                    style: TextStyle(color: AppColors.mist),
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
              sliver: SliverMasonryGrid.count(
                crossAxisCount: 2,
                mainAxisSpacing: 14,
                crossAxisSpacing: 14,
                itemBuilder: (context, index) {
                  final photo = artistPhotos[index];
                  return MasonryPhotoCard(
                    photo: photo,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PhotoDetailScreen(photo: photo),
                        ),
                      );
                    },
                  );
                },
                childCount: artistPhotos.length,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: AppColors.alabaster,
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label.toUpperCase(),
          style: const TextStyle(
            color: AppColors.mistMuted,
            fontSize: 9.5,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.8,
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      width: 1,
      height: 24,
      color: AppColors.edge,
    );
  }
}
