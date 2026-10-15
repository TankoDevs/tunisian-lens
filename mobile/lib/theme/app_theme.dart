import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Museum-Grade Visual Identity Colors
  static const Color canvas = Color(0xFF0B0C0E);
  static const Color surface = Color(0xFF15171C);
  static const Color surfaceElevated = Color(0xFF1E2127);
  static const Color edge = Color(0xFF262930);
  
  // Accents
  static const Color ochre = Color(0xFFD99B56);
  static const Color ochreLight = Color(0xFFE8B278);
  static const Color sidiAzure = Color(0xFF3884E6);
  static const Color emerald = Color(0xFF10B981);
  static const Color rose = Color(0xFFF43F5E);
  
  // Typography
  static const Color alabaster = Color(0xFFF1F2F5);
  static const Color mist = Color(0xFFA4AAB7);
  static const Color mistMuted = Color(0xFF6B7280);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.canvas,
      canvasColor: AppColors.canvas,
      cardColor: AppColors.surface,
      dividerColor: AppColors.edge,
      
      colorScheme: const ColorScheme.dark(
        primary: AppColors.ochre,
        onPrimary: AppColors.canvas,
        secondary: AppColors.sidiAzure,
        onSecondary: AppColors.alabaster,
        surface: AppColors.surface,
        onSurface: AppColors.alabaster,
        error: AppColors.rose,
        onError: Colors.white,
      ),

      textTheme: TextTheme(
        // Editorial Display Serifs (Playfair Display)
        displayLarge: GoogleFonts.playfairDisplay(
          color: AppColors.alabaster,
          fontSize: 32,
          fontWeight: FontWeight.normal,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.playfairDisplay(
          color: AppColors.alabaster,
          fontSize: 26,
          fontWeight: FontWeight.normal,
        ),
        displaySmall: GoogleFonts.playfairDisplay(
          color: AppColors.alabaster,
          fontSize: 22,
          fontWeight: FontWeight.normal,
        ),
        headlineMedium: GoogleFonts.playfairDisplay(
          color: AppColors.alabaster,
          fontSize: 20,
          fontWeight: FontWeight.w500,
        ),
        headlineSmall: GoogleFonts.playfairDisplay(
          color: AppColors.alabaster,
          fontSize: 18,
          fontWeight: FontWeight.w500,
        ),

        // Body & Labels (Plus Jakarta Sans)
        bodyLarge: GoogleFonts.plusJakartaSans(
          color: AppColors.alabaster,
          fontSize: 16,
          fontWeight: FontWeight.w400,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.plusJakartaSans(
          color: AppColors.mist,
          fontSize: 14,
          fontWeight: FontWeight.w400,
          height: 1.5,
        ),
        bodySmall: GoogleFonts.plusJakartaSans(
          color: AppColors.mist,
          fontSize: 12,
          fontWeight: FontWeight.w400,
        ),

        // EXIF & Technical Metadata (Mono)
        labelLarge: GoogleFonts.jetbrainsMono(
          color: AppColors.alabaster,
          fontSize: 12,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.5,
        ),
        labelMedium: GoogleFonts.jetbrainsMono(
          color: AppColors.mist,
          fontSize: 11,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.5,
        ),
        labelSmall: GoogleFonts.jetbrainsMono(
          color: AppColors.mistMuted,
          fontSize: 10,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.8,
        ),
      ),

      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.canvas.withOpacity(0.95),
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: AppColors.alabaster),
        titleTextStyle: GoogleFonts.playfairDisplay(
          color: AppColors.alabaster,
          fontSize: 20,
          fontWeight: FontWeight.w500,
        ),
      ),

      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.ochre,
        unselectedItemColor: AppColors.mistMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),

      cardTheme: CardTheme(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.edge, width: 1),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        hintStyle: GoogleFonts.plusJakartaSans(
          color: AppColors.mistMuted,
          fontSize: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.edge),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.edge),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.ochre, width: 1.5),
        ),
      ),
    );
  }
}
