import 'package:flutter/material.dart';
import '../../data/models/artist.dart';
import '../../theme/app_theme.dart';

class BadgePill extends StatelessWidget {
  final BadgeLevel level;
  final bool isSmall;

  const BadgePill({
    super.key,
    required this.level,
    this.isSmall = false,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color border;
    Color text;
    IconData icon;

    switch (level) {
      case BadgeLevel.verified:
        bg = AppColors.sidiAzure.withOpacity(0.12);
        border = AppColors.sidiAzure.withOpacity(0.3);
        text = AppColors.sidiAzure;
        icon = Icons.verified_rounded;
        break;
      case BadgeLevel.pro:
        bg = AppColors.ochre.withOpacity(0.12);
        border = AppColors.ochre.withOpacity(0.35);
        text = AppColors.ochre;
        icon = Icons.star_rounded;
        break;
      case BadgeLevel.elite:
        bg = const Color(0xFF8B5CF6).withOpacity(0.15);
        border = const Color(0xFF8B5CF6).withOpacity(0.4);
        text = const Color(0xFFA78BFA);
        icon = Icons.workspace_premium_rounded;
        break;
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isSmall ? 6 : 8,
        vertical: isSmall ? 2 : 3,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(100),
        border: Border.all(color: border, width: 0.8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: isSmall ? 10 : 12, color: text),
          const SizedBox(width: 4),
          Text(
            level.label.toUpperCase(),
            style: TextStyle(
              fontSize: isSmall ? 8.5 : 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.8,
              color: text,
            ),
          ),
        ],
      ),
    );
  }
}
