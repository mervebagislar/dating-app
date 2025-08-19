// lib/core/constants/api_constants.dart
class ApiConstants {
  // ✅ GERÇEK API ENDPOINT (belgenden alındı)
  static const String baseUrl = 'https://caseapi.servicelabs.tech';
  
  // ✅ Timeout ayarları
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // ✅ Endpoints
  static const String loginEndpoint = '/user/login';
  static const String registerEndpoint = '/user/register';
  static const String profileEndpoint = '/user/profile';
  static const String uploadPhotoEndpoint = '/user/upload_photo';
  static const String movieListEndpoint = '/movie/list';
  static const String favoritesEndpoint = '/movie/favorites';
  static const String toggleFavoriteEndpoint = '/movie/favorite';
  static const String healthEndpoint = '/health';
  
  // ✅ HTTP Status Codes
  static const int statusOk = 200;
  static const int statusCreated = 201;
  static const int statusBadRequest = 400;
  static const int statusUnauthorized = 401;
  static const int statusForbidden = 403;
  static const int statusNotFound = 404;
  static const int statusInternalServerError = 500;
  
  // ✅ Error Messages
  static const String networkError = 'İnternet bağlantısı bulunamadı';
  static const String timeoutError = 'İstek zaman aşımına uğradı';
  static const String serverError = 'Sunucu hatası oluştu';
  static const String unauthorizedError = 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın';
  static const String notFoundError = 'İstenen kaynak bulunamadı';
  static const String unknownError = 'Bilinmeyen bir hata oluştu';
  
  // ✅ Headers
  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // ✅ Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userDataKey = 'user_data';
  static const String refreshTokenKey = 'refresh_token';
}