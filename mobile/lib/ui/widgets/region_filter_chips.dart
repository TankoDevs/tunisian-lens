import 'package:flutter/material.dart';
import '../../data/models/photo_item.dart';
import '../../theme/app_theme.dart';

class RegionFilterChips extends StatelessWidget {
  final TunisianRegion selectedRegion;
  final ValueChanged<TunisianRegion> onRegionSelected;

  const RegionFilterChips({
    super.key,
    required this.selectedRegion,
    required this.onRegionSelected,
  });

  @override
  Widget build(BuildContext context) {
    final regions = TunisianRegion.values;

    return SizedBox(
      height: 42,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: regions.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final region = regions[index];
          final isSelected = region == selectedRegion;

          return GestureDetector(
            onTap: () => onRegionSelected(region),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.ochre : AppColors.surface,
                borderRadius: BorderRadius.circular(100),
                border: Border.all(
                  color: isSelected ? AppColors.ochre : AppColors.edge,
                  width: 1,
                ),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppColors.ochre.withOpacity(0.25),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ]
                    : null,
              ),
              child: Center(
                child: Text(
                  region.label,
                  style: TextStyle(
                    color: isSelected ? AppColors.canvas : AppColors.alabaster,
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                    letterSpacing: 0.2,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
