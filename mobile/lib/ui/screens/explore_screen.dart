import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../../data/models/photo_item.dart';
import '../../data/repositories/photo_repository.dart';
import '../../theme/app_theme.dart';
import '../widgets/masonry_photo_card.dart';
import 'photo_detail_screen.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final photoRepo = context.watch<PhotoRepository>();
    final searchResults = photoRepo.search(_searchQuery);

    return Scaffold(
      backgroundColor: AppColors.canvas,
      body: CustomScrollView(
        slivers: [
          // Header & Search Bar
          SliverAppBar(
            floating: true,
            pinned: true,
            backgroundColor: AppColors.canvas.withOpacity(0.95),
            expandedHeight: 120,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                padding: const EdgeInsets.fromLTRB(16, 48, 16, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Curatorial Explore',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontSize: 22,
                            fontWeight: FontWeight.w500,
                          ),
                    ),
                    const SizedBox(height: 10),
                    // Search Field
                    Container(
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.edge),
                      ),
                      child: TextField(
                        controller: _searchController,
                        onChanged: (val) {
                          setState(() => _searchQuery = val);
                        },
                        style: const TextStyle(color: AppColors.alabaster, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Search by monument, city, camera, or tags…',
                          hintStyle: const TextStyle(color: AppColors.mistMuted, fontSize: 13),
                          prefixIcon: const Icon(Icons.search_rounded, size: 18, color: AppColors.mist),
                          suffixIcon: _searchQuery.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, size: 16, color: AppColors.mist),
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() => _searchQuery = '');
                                  },
                                )
                              : null,
                          contentPadding: const EdgeInsets.symmetric(vertical: 10),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Territory Cards if not searching
          if (_searchQuery.isEmpty) ...[
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(16, 12, 16, 12),
                child: Text(
                  'FOUR VISUAL GEOGRAPHIES',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: AppColors.ochre,
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: SizedBox(
                height: 120,
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  scrollDirection: Axis.horizontal,
                  children: [
                    _buildTerritoryCard(
                      'North & Tabarka',
                      'Forests & Cliffs',
                      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
                      () => setState(() => _searchQuery = 'Tabarka'),
                    ),
                    const SizedBox(width: 12),
                    _buildTerritoryCard(
                      'Tunis & Carthage',
                      'Andalusian & Antiquity',
                      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500&q=80',
                      () => setState(() => _searchQuery = 'Tunis'),
                    ),
                    const SizedBox(width: 12),
                    _buildTerritoryCard(
                      'Sahel Coast',
                      'Ribats & Colosseums',
                      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=80',
                      () => setState(() => _searchQuery = 'El Jem'),
                    ),
                    const SizedBox(width: 12),
                    _buildTerritoryCard(
                      'South & Sahara',
                      'Dunes & Salt Flats',
                      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&q=80',
                      () => setState(() => _searchQuery = 'Sahara'),
                    ),
                  ],
                ),
              ),
            ),
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(16, 24, 16, 12),
                child: Text(
                  'ALL ARCHIVAL SERIES',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: AppColors.ochre,
                  ),
                ),
              ),
            ),
          ],

          // Search Results or All Photos Grid
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
            sliver: SliverMasonryGrid.count(
              crossAxisCount: 2,
              mainAxisSpacing: 14,
              crossAxisSpacing: 14,
              itemBuilder: (context, index) {
                final photo = searchResults[index];
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
              childCount: searchResults.length,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTerritoryCard(String title, String subtitle, String imageUrl, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 170,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.edge),
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(imageUrl, fit: BoxFit.cover),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    AppColors.canvas.withOpacity(0.95),
                    AppColors.canvas.withOpacity(0.3),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: AppColors.alabaster,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: AppColors.ochre,
                      fontSize: 9.5,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
