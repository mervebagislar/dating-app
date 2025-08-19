// lib/core/constants/app_colors.dart
import 'package:flutter/material.dart';

class AppColors {
  // Primary Brand Colors (Figma'dan çıkarılan renk paleti)
  static const Color primary = Color(0xFFE50914); // Figma Brand Color
  static const Color primaryDark = Color(0xFFB8070F); // Daha koyu ton
  static const Color primaryLight = Color(0xFFFF6B6B); // Daha açık ton

  // Secondary Colors
  static const Color secondary = Color(0xFF2D3748);
  static const Color secondaryLight = Color(0xFF4A5568);
  static const Color secondaryDark = Color(0xFF1A202C);

  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color grey50 = Color(0xFFF7FAFC);
  static const Color grey100 = Color(0xFFEDF2F7);
  static const Color grey200 = Color(0xFFE2E8F0);
  static const Color grey300 = Color(0xFFCBD5E0);
  static const Color grey400 = Color(0xFFA0AEC0);
  static const Color grey500 = Color(0xFF718096);
  static const Color grey600 = Color(0xFF4A5568);
  static const Color grey700 = Color(0xFF2D3748);
  static const Color grey800 = Color(0xFF1A202C);
  static const Color grey900 = Color(0xFF171923);

  // Functional Colors
  static const Color success = Color(0xFF38A169);
  static const Color warning = Color(0xFFD69E2E);
  static const Color error = Color(0xFFE50914); // Primary ile aynı
  static const Color info = Color(0xFF3182CE);

  // Background Colors
  static const Color background = Color(0xFFFFFFFF);
  static const Color backgroundDark = Color(0xFF090909); // Figma'dan alınan arka plan
  static const Color surface = Color(0xFFF7FAFC);
  static const Color surfaceDark = Color(0xFF1A1A1A); // Daha açık surface için

  // Text Colors
  static const Color textPrimary = Color(0xFF1A202C);
  static const Color textSecondary = Color(0xFF4A5568);
  static const Color textTertiary = Color(0xFF718096);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnDark = Color(0xFFFFFFFF);

  // Border Colors
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderDark = Color(0xFF4A5568);

  // Shadow Colors
  static const Color shadow = Color(0x1A000000);
  static const Color shadowDark = Color(0x3D000000);

  // Gradient Colors
  static const List<Color> primaryGradient = [
    Color(0xFFE50914), // Updated primary color
    Color(0xFFD53F8C),
  ];

  static const List<Color> darkGradient = [
    Color(0xFF090909), // Updated background dark
    Color(0xFF1A1A1A), // Updated surface dark
  ];

  // Input Field Colors (Register page için)
  static const Color inputBackground = Color(0x1AFFFFFF); // %10 saydam beyaz
  static const Color inputBackgroundFocused = Color(0x26FFFFFF); // %15 saydam beyaz
  static const Color borderColor = Color(0x33FFFFFF); // %20 saydam beyaz
  static const Color borderColorFocused = Color(0x4DFFFFFF); // %30 saydam beyaz

  // Button Colors
  static const Color buttonPrimary = Color(0xFFE50914);
  static const Color buttonSecondary = Color(0xFF333333);
  static const Color buttonDisabled = Color(0x33FFFFFF);

  // Social Button Colors
  static const Color socialButtonBackground = Color(0x1AFFFFFF); // %10 saydam beyaz
  static const Color socialButtonBorder = Color(0x33FFFFFF); // %20 saydam beyaz

  // Utility Colors
  static const Color disabled = Color(0x33FFFFFF);
  static const Color divider = Color(0x1AFFFFFF);
  static const Color overlay = Color(0x80000000);

  // Premium/Gold Colors (for premium features)
  static const Color gold = Color(0xFFFFD700);
  static const Color goldAccent = Color(0xFFFFA500);
}