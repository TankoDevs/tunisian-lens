import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:provider/provider.dart';
import '../../data/models/photo_item.dart';
import '../../data/repositories/photo_repository.dart';
import '../../theme/app_theme.dart';
import '../widgets/masonry_photo_card.dart';
import '../widgets/region_filter_chips.dart';
import 'photo_detail_screen.dart';

class HomeFeedScreen extends StatefulWidget {
  const HomeFeedScreen({super.key});

  @override
  State<HomeFeedScreen> createState() => _HomeFeedScreenState();
}

class _HomeFeedScreenState extends State<HomeFeedScreen> {
  TunisianRegion _selectedRegion = TunisianRegion.all;

  @override
  Widget build(BuildContext context) {
    final photoRepo = context.watch<PhotoRepository>();
    final photos = photoRepo.getByRegion(_selectedRegion);

    return Scaffold(
      backgroundColor: AppColors.canvas,
      body: CustomScrollView(
        slivers: [
          // Museum Editorial Header
          SliverAppBar(
            floating: true,
            pinned: false,
            snap: true,
            expandedHeight: 140,
            backgroundColor: AppColors.canvas.withOpacity(0.92),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                padding: const EdgeInsets.fromLTRB(16, 50, 16, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: AppColors.ochre,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Text(
                                  'CULTURAL ARCHIVE',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: 1.5,
                                    color: AppColors.ochre,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Tunisian Lens',
                              style: Theme.of(context).textTheme.displayLarge?.copyWith(
                                    fontSize: 28,
                                    fontWeight: FontWeight.normal,
                                    color: AppColors.alabaster,
                                  ),
                            ),
                          ],
                        ),
                        // Chromatic Indicator Dots
                        Row(
                          children: [
                            _buildColorDot(AppColors.sidiAzure, 'Mediterranean Blue'),
                            const SizedBox(width: 5),
                            _buildColorDot(AppColors.ochre, 'Desert Ochre'),
                            const SizedBox(width: 5),
                            _buildColorDot(AppColors.alabaster, 'Limestone White'),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Horizontal Regional Filter Chips
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 16),
              child: RegionFilterChips(
                selectedRegion: _selectedRegion,
                onRegionSelected: (region) {
                  setState(() => _selectedRegion = region);
                },
              ),
            ),
          ),

          // Staggered Masonry Grid of Photographs
          if (photos.isEmpty)
            const SliverFillRemaining(
              child: Center(
                child: Text(
                  'No photographs recorded in this region yet.',
                  style: TextStyle(color: AppColors.mist),
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
                  final photo = photos[index];
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
                childCount: photos.length,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildColorDot(Color color, String tooltip) {
    return Tooltip(
      message: tooltip,
      child: Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.edge, width: 0.8),
        ),
      ),
    );
  }
}
