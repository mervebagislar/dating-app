// lib/core/localization/app_localizations.dart
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = [
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  static const List<Locale> supportedLocales = [
    Locale('tr', 'TR'), // Turkish
    Locale('en', 'US'), // English
  ];

  // ✅ AUTHENTICATION STRINGS
  String get welcome => _localizedValues[locale.languageCode]!['welcome']!;
  String get login => _localizedValues[locale.languageCode]!['login']!;
  String get register => _localizedValues[locale.languageCode]!['register']!;
  String get email => _localizedValues[locale.languageCode]!['email']!;
  String get password => _localizedValues[locale.languageCode]!['password']!;
  String get confirmPassword => _localizedValues[locale.languageCode]!['confirmPassword']!;
  String get fullName => _localizedValues[locale.languageCode]!['fullName']!;
  String get forgotPassword => _localizedValues[locale.languageCode]!['forgotPassword']!;
  String get alreadyHaveAccount => _localizedValues[locale.languageCode]!['alreadyHaveAccount']!;
  String get dontHaveAccount => _localizedValues[locale.languageCode]!['dontHaveAccount']!;
  String get loginSuccess => _localizedValues[locale.languageCode]!['loginSuccess']!;
  String get registerSuccess => _localizedValues[locale.languageCode]!['registerSuccess']!;

  // ✅ HOME PAGE STRINGS
  String get discover => _localizedValues[locale.languageCode]!['discover']!;
  String get movies => _localizedValues[locale.languageCode]!['movies']!;
  String get loading => _localizedValues[locale.languageCode]!['loading']!;
  String get pullToRefresh => _localizedValues[locale.languageCode]!['pullToRefresh']!;
  String get noMoviesFound => _localizedValues[locale.languageCode]!['noMoviesFound']!;
  String get addedToFavorites => _localizedValues[locale.languageCode]!['addedToFavorites']!;
  String get removedFromFavorites => _localizedValues[locale.languageCode]!['removedFromFavorites']!;

  // ✅ PROFILE PAGE STRINGS
  String get profile => _localizedValues[locale.languageCode]!['profile']!;
  String get profileDetails => _localizedValues[locale.languageCode]!['profileDetails']!;
  String get favoriteMovies => _localizedValues[locale.languageCode]!['favoriteMovies']!;
  String get addPhoto => _localizedValues[locale.languageCode]!['addPhoto']!;
  String get noFavoriteMovies => _localizedValues[locale.languageCode]!['noFavoriteMovies']!;
  String get startLikingMovies => _localizedValues[locale.languageCode]!['startLikingMovies']!;
  String get exploreMovies => _localizedValues[locale.languageCode]!['exploreMovies']!;
  String get profilePhotoUpdated => _localizedValues[locale.languageCode]!['profilePhotoUpdated']!;
  String get profileLoadError => _localizedValues[locale.languageCode]!['profileLoadError']!;
  String get retry => _localizedValues[locale.languageCode]!['retry']!;

  // ✅ PREMIUM MODAL STRINGS
  String get limitedOffer => _localizedValues[locale.languageCode]!['limitedOffer']!;
  String get bonusDescription => _localizedValues[locale.languageCode]!['bonusDescription']!;
  String get yourBonuses => _localizedValues[locale.languageCode]!['yourBonuses']!;
  String get premiumAccount => _localizedValues[locale.languageCode]!['premiumAccount']!;
  String get moreMatches => _localizedValues[locale.languageCode]!['moreMatches']!;
  String get boost => _localizedValues[locale.languageCode]!['boost']!;
  String get moreLikes => _localizedValues[locale.languageCode]!['moreLikes']!;
  String get selectTokenPackage => _localizedValues[locale.languageCode]!['selectTokenPackage']!;
  String get token => _localizedValues[locale.languageCode]!['token']!;
  String get weekly => _localizedValues[locale.languageCode]!['weekly']!;
  String get viewAllTokens => _localizedValues[locale.languageCode]!['viewAllTokens']!;
  String get packagePurchased => _localizedValues[locale.languageCode]!['packagePurchased']!;

  // ✅ COMMON STRINGS
  String get save => _localizedValues[locale.languageCode]!['save']!;
  String get cancel => _localizedValues[locale.languageCode]!['cancel']!;
  String get ok => _localizedValues[locale.languageCode]!['ok']!;
  String get error => _localizedValues[locale.languageCode]!['error']!;
  String get success => _localizedValues[locale.languageCode]!['success']!;
  String get warning => _localizedValues[locale.languageCode]!['warning']!;
  String get logout => _localizedValues[locale.languageCode]!['logout']!;
  String get settings => _localizedValues[locale.languageCode]!['settings']!;
  String get language => _localizedValues[locale.languageCode]!['language']!;
  String get turkish => _localizedValues[locale.languageCode]!['turkish']!;
  String get english => _localizedValues[locale.languageCode]!['english']!;

  // ✅ VALIDATION STRINGS
  String get emailRequired => _localizedValues[locale.languageCode]!['emailRequired']!;
  String get emailInvalid => _localizedValues[locale.languageCode]!['emailInvalid']!;
  String get passwordRequired => _localizedValues[locale.languageCode]!['passwordRequired']!;
  String get passwordTooShort => _localizedValues[locale.languageCode]!['passwordTooShort']!;
  String get passwordsNotMatch => _localizedValues[locale.languageCode]!['passwordsNotMatch']!;
  String get nameRequired => _localizedValues[locale.languageCode]!['nameRequired']!;

  // ✅ LOCALIZED VALUES MAP
  static const Map<String, Map<String, String>> _localizedValues = {
    'tr': {
      // Authentication
      'welcome': 'Hoş Geldiniz',
      'login': 'Giriş Yap',
      'register': 'Kayıt Ol',
      'email': 'E-posta',
      'password': 'Şifre',
      'confirmPassword': 'Şifre Tekrar',
      'fullName': 'Ad Soyad',
      'forgotPassword': 'Şifremi Unuttum',
      'alreadyHaveAccount': 'Zaten hesabınız var mı?',
      'dontHaveAccount': 'Hesabınız yok mu?',
      'loginSuccess': 'Başarıyla giriş yapıldı',
      'registerSuccess': 'Başarıyla kayıt olundu',

      // Home Page
      'discover': 'Keşfet',
      'movies': 'Filmler',
      'loading': 'Yükleniyor...',
      'pullToRefresh': 'Yenilemek için çekin',
      'noMoviesFound': 'Film bulunamadı',
      'addedToFavorites': 'Favorilere eklendi',
      'removedFromFavorites': 'Favorilerden çıkarıldı',

      // Profile Page
      'profile': 'Profil',
      'profileDetails': 'Profil Detayı',
      'favoriteMovies': 'Beğendiğim Filmler',
      'addPhoto': 'Fotoğraf Ekle',
      'noFavoriteMovies': 'Henüz beğendiğiniz film yok',
      'startLikingMovies': 'Ana sayfadan filmleri beğenmeye başlayın',
      'exploreMovies': 'Filmleri Keşfet',
      'profilePhotoUpdated': 'Profil fotoğrafı güncellendi!',
      'profileLoadError': 'Profil bilgileri yüklenemedi. Lütfen tekrar deneyin.',
      'retry': 'Tekrar Dene',

      // Premium Modal
      'limitedOffer': 'Sınırlı Teklif',
      'bonusDescription': 'Jeton paketi\'ni seçerek bonus kazanın ve yeni bölümlerin kilidini açın!',
      'yourBonuses': 'Alacağınız Bonuslar',
      'premiumAccount': 'Premium\nHesap',
      'moreMatches': 'Daha Fazla\nEşleşme',
      'boost': 'Öne\nÇıkarma',
      'moreLikes': 'Daha Fazla\nBeğeni',
      'selectTokenPackage': 'Kilidi açmak için bir jeton paketi seçin',
      'token': 'Jeton',
      'weekly': 'Başına haftalık',
      'viewAllTokens': 'Tüm Jetonları Gör',
      'packagePurchased': 'jeton paketi satın alındı!',

      // Common
      'save': 'Kaydet',
      'cancel': 'İptal',
      'ok': 'Tamam',
      'error': 'Hata',
      'success': 'Başarılı',
      'warning': 'Uyarı',
      'logout': 'Çıkış Yap',
      'settings': 'Ayarlar',
      'language': 'Dil',
      'turkish': 'Türkçe',
      'english': 'İngilizce',

      // Validation
      'emailRequired': 'E-posta gerekli',
      'emailInvalid': 'Geçerli bir e-posta adresi girin',
      'passwordRequired': 'Şifre gerekli',
      'passwordTooShort': 'Şifre en az 6 karakter olmalı',
      'passwordsNotMatch': 'Şifreler eşleşmiyor',
      'nameRequired': 'Ad soyad gerekli',
    },
    'en': {
      // Authentication
      'welcome': 'Welcome',
      'login': 'Login',
      'register': 'Register',
      'email': 'Email',
      'password': 'Password',
      'confirmPassword': 'Confirm Password',
      'fullName': 'Full Name',
      'forgotPassword': 'Forgot Password',
      'alreadyHaveAccount': 'Already have an account?',
      'dontHaveAccount': 'Don\'t have an account?',
      'loginSuccess': 'Login successful',
      'registerSuccess': 'Registration successful',

      // Home Page
      'discover': 'Discover',
      'movies': 'Movies',
      'loading': 'Loading...',
      'pullToRefresh': 'Pull to refresh',
      'noMoviesFound': 'No movies found',
      'addedToFavorites': 'Added to favorites',
      'removedFromFavorites': 'Removed from favorites',

      // Profile Page
      'profile': 'Profile',
      'profileDetails': 'Profile Details',
      'favoriteMovies': 'Favorite Movies',
      'addPhoto': 'Add Photo',
      'noFavoriteMovies': 'No favorite movies yet',
      'startLikingMovies': 'Start liking movies from the home page',
      'exploreMovies': 'Explore Movies',
      'profilePhotoUpdated': 'Profile photo updated!',
      'profileLoadError': 'Failed to load profile. Please try again.',
      'retry': 'Retry',

      // Premium Modal
      'limitedOffer': 'Limited Offer',
      'bonusDescription': 'Select a token package to earn bonuses and unlock new episodes!',
      'yourBonuses': 'Your Bonuses',
      'premiumAccount': 'Premium\nAccount',
      'moreMatches': 'More\nMatches',
      'boost': 'Boost',
      'moreLikes': 'More\nLikes',
      'selectTokenPackage': 'Select a token package to unlock',
      'token': 'Token',
      'weekly': 'Weekly',
      'viewAllTokens': 'View All Tokens',
      'packagePurchased': 'token package purchased!',

      // Common
      'save': 'Save',
      'cancel': 'Cancel',
      'ok': 'OK',
      'error': 'Error',
      'success': 'Success',
      'warning': 'Warning',
      'logout': 'Logout',
      'settings': 'Settings',
      'language': 'Language',
      'turkish': 'Turkish',
      'english': 'English',

      // Validation
      'emailRequired': 'Email is required',
      'emailInvalid': 'Please enter a valid email address',
      'passwordRequired': 'Password is required',
      'passwordTooShort': 'Password must be at least 6 characters',
      'passwordsNotMatch': 'Passwords do not match',
      'nameRequired': 'Full name is required',
    },
  };
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['tr', 'en'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

// ✅ EXTENSION FOR EASY ACCESS
extension AppLocalizationsX on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this)!;
}