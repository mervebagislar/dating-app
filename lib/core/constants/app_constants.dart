// lib/core/constants/app_constants.dart
class AppConstants {
  // ==================== APP INFO ====================
  static const String appName = 'Dating App';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'Flutter Case Study - Dating App';
  static const String companyName = 'NodeLabs';

  // ==================== API CONSTANTS ====================
  static const String baseUrl =
      'https://caseapi.servicelabs.tech'; // ✅ GÜNCELLEME
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;

  // ==================== STORAGE KEYS ====================
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String languageKey = 'app_language';
  static const String themeKey = 'app_theme';
  static const String onboardingKey = 'onboarding_completed';

  // ==================== PAGINATION ====================
  static const int itemsPerPage = 5;
  static const int maxRetryAttempts = 3;
  static const int preloadThreshold = 2; // Load more when 2 items left

  // ==================== ANIMATION DURATIONS ====================
  static const int splashDuration = 3000; // milliseconds
  static const int animationDuration = 300;
  static const int pageTransitionDuration = 250;
  static const int modalTransitionDuration = 400;

  // ==================== UI CONSTANTS ====================
  static const double borderRadius = 12.0;
  static const double cardElevation = 4.0;
  static const double buttonHeight = 56.0;
  static const double appBarHeight = 56.0;

  // ==================== SPACING ====================
  static const double paddingXS = 4.0;
  static const double paddingS = 8.0;
  static const double paddingM = 16.0;
  static const double paddingL = 24.0;
  static const double paddingXL = 32.0;

  // ==================== FONT SIZES ====================
  static const double fontSizeXS = 12.0;
  static const double fontSizeS = 14.0;
  static const double fontSizeM = 16.0;
  static const double fontSizeL = 18.0;
  static const double fontSizeXL = 24.0;
  static const double fontSizeXXL = 32.0;

  // ==================== VALIDATION ====================
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 50;
  static const int minNameLength = 2;
  static const int maxNameLength = 50;
  static const int maxEmailLength = 100;

  // ==================== IMAGE CONSTANTS ====================
  static const int maxImageSizeMB = 10;
  static const int maxImageSizeBytes = maxImageSizeMB * 1024 * 1024;
  static const int imageQuality = 80;
  static const int maxImageWidth = 1024;
  static const int maxImageHeight = 1024;

  static const List<String> supportedImageFormats = [
    'jpg',
    'jpeg',
    'png',
    'webp',
  ];

  // ==================== ERROR MESSAGES ====================
  static const String genericError = 'Bir hata oluştu. Lütfen tekrar deneyin.';
  static const String networkError = 'İnternet bağlantısı bulunamadı.';
  static const String timeoutError = 'İstek zaman aşımına uğradı.';
  static const String validationError =
      'Lütfen tüm alanları doğru şekilde doldurun.';

  // ==================== SUCCESS MESSAGES ====================
  static const String loginSuccess = 'Giriş başarılı!';
  static const String registerSuccess = 'Kayıt başarılı!';
  static const String profileUpdateSuccess = 'Profil güncellendi!';
  static const String photoUploadSuccess = 'Fotoğraf yüklendi!';
  static const String favoriteAddSuccess = 'Favorilere eklendi!';
  static const String favoriteRemoveSuccess = 'Favorilerden çıkarıldı!';

  // ==================== PLACEHOLDER TEXTS ====================
  static const String emailPlaceholder = 'E-posta adresinizi girin';
  static const String passwordPlaceholder = 'Şifrenizi girin';
  static const String namePlaceholder = 'Adınızı ve soyadınızı girin';
  static const String noMoviesMessage = 'Henüz film eklenmemiş';
  static const String noFavoritesMessage = 'Henüz favori film eklenmemiş';

  // ==================== REGEX PATTERNS ====================
  static const String emailPattern = r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$';

  // ==================== DEVELOPMENT ====================
  static const bool enableDebugMode = true;
  static const bool showPerformanceOverlay = false;

  // ==================== HELPER METHODS ====================

  /// Check if email is valid
  static bool isValidEmail(String email) {
    return RegExp(emailPattern).hasMatch(email);
  }

  /// Check if password is valid
  static bool isValidPassword(String password) {
    return password.length >= minPasswordLength &&
        password.length <= maxPasswordLength;
  }

  /// Check if name is valid
  static bool isValidName(String name) {
    return name.trim().length >= minNameLength &&
        name.trim().length <= maxNameLength;
  }

  /// Format file size
  static String formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  /// Get file extension
  static String getFileExtension(String fileName) {
    return fileName.split('.').last.toLowerCase();
  }

  /// Check if file is image
  static bool isImageFile(String fileName) {
    final extension = getFileExtension(fileName);
    return supportedImageFormats.contains(extension);
  }
}
