import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../data/repositories/artist_repository.dart';
import '../../theme/app_theme.dart';
import '../widgets/badge_pill.dart';
import 'artist_profile_screen.dart';

class CreativesListScreen extends StatelessWidget {
  const CreativesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final artistRepo = context.watch<ArtistRepository>();
    final artists = artistRepo.artists;

    return Scaffold(
      backgroundColor: AppColors.canvas,
      appBar: AppBar(
        title: const Text('Creative Guild'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(24),
          child: Container(
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.only(left: 16, bottom: 8),
            child: const Text(
              'VERIFIED DOCUMENTARY & ARCHITECTURAL VISUALISTS',
              style: TextStyle(
                fontSize: 9.5,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
                color: AppColors.ochre,
              ),
            ),
          ),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: artists.length,
        separatorBuilder: (_, __) => const SizedBox(height: 14),
        itemBuilder: (context, index) {
          final artist = artists[index];
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ArtistProfileScreen(artist: artist),
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.edge),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundImage: CachedNetworkImageProvider(artist.avatarUrl),
                    backgroundColor: AppColors.surfaceElevated,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              artist.name,
                              style: const TextStyle(
                                color: AppColors.alabaster,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 8),
                            BadgePill(level: artist.badgeLevel, isSmall: true),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          artist.role,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.mist,
                            fontSize: 11.5,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.location_on_outlined, size: 12, color: AppColors.sidiAzure),
                            const SizedBox(width: 3),
                            Text(
                              artist.location,
                              style: const TextStyle(
                                color: AppColors.mistMuted,
                                fontSize: 10.5,
                              ),
                            ),
                            const Spacer(),
                            Text(
                              '${artist.rating} ★',
                              style: const TextStyle(
                                color: AppColors.ochre,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
