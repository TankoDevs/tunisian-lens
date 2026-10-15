import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../data/models/photo_item.dart';
import '../../theme/app_theme.dart';

class ExifOpticsSheet extends StatelessWidget {
  final PhotoExif exif;
  final String locationName;

  const ExifOpticsSheet({
    super.key,
    required this.exif,
    required this.locationName,
  });

  static void show(BuildContext context, PhotoExif exif, String locationName) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        side: BorderSide(color: AppColors.edge, width: 1),
      ),
      builder: (_) => ExifOpticsSheet(exif: exif, locationName: locationName),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag Handle
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.edge,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Sheet Title
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(7),
                      decoration: BoxDecoration(
                        color: AppColors.ochre.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.camera_outlined,
                        size: 16,
                        color: AppColors.ochre,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'Camera & Optics Readout',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.emerald.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(100),
                    border: Border.all(
                      color: AppColors.emerald.withOpacity(0.3),
                      width: 0.8,
                    ),
                  ),
                  child: const Text(
                    'VERIFIED OPTICS',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: AppColors.emerald,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Technical Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 2.3,
              children: [
                _buildOpticCard('Camera Body', exif.camera ?? '—', Icons.camera_alt_outlined),
                _buildOpticCard('Lens / Optics', exif.lens ?? '—', Icons.lens_outlined),
                _buildOpticCard('Aperture', exif.aperture ?? '—', Icons.camera_rounded, isHighlight: true),
                _buildOpticCard('Shutter Speed', exif.shutterSpeed ?? '—', Icons.shutter_speed_rounded),
                _buildOpticCard('Focal Length', exif.focalLength ?? '—', Icons.zoom_in_rounded),
                _buildOpticCard('ISO Sensitivity', exif.iso != null ? 'ISO ${exif.iso}' : '—', Icons.iso_rounded),
              ],
            ),

            // GPS Coordinates if present
            if (exif.latitude != null && exif.longitude != null) ...[
              const SizedBox(height: 14),
              InkWell(
                onTap: () {
                  final coords = '${exif.latitude!.toStringAsFixed(4)}, ${exif.longitude!.toStringAsFixed(4)}';
                  Clipboard.setData(ClipboardData(text: coords));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      backgroundColor: AppColors.surfaceElevated,
                      content: Text('Coordinates copied: $coords'),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.canvas,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.edge, width: 1),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.explore_outlined, color: AppColors.sidiAzure, size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              locationName,
                              style: const TextStyle(
                                color: AppColors.alabaster,
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              '${exif.latitude!.toStringAsFixed(4)}° N, ${exif.longitude!.toStringAsFixed(4)}° E',
                              style: const TextStyle(
                                color: AppColors.mistMuted,
                                fontSize: 10.5,
                                fontFamily: 'monospace',
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.copy_rounded, color: AppColors.mist, size: 14),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildOpticCard(String label, String value, IconData icon, {bool isHighlight = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.canvas,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isHighlight ? AppColors.ochre.withOpacity(0.4) : AppColors.edge,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            size: 16,
            color: isHighlight ? AppColors.ochre : AppColors.mistMuted,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  label.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 8.5,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.6,
                    color: AppColors.mistMuted,
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'monospace',
                    color: isHighlight ? AppColors.ochre : AppColors.alabaster,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
