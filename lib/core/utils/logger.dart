// lib/core/utils/logger.dart
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class AppLogger {
  static bool _isInitialized = false;
  static bool _enableLogging = true;
  
  // ✅ Logger'ı başlat
  static void init({bool enableLogging = true}) {
    if (_isInitialized) return;
    
    _enableLogging = enableLogging && kDebugMode;
    _isInitialized = true;
    
    if (_enableLogging) {
      print('📱 [AppLogger] Logger başlatıldı - Debug Mode: $kDebugMode');
    }
  }
  
  // ✅ Info log
  static void i(String message, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('ℹ️ [$timestamp] $message');
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ Debug log
  static void d(String message, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('🐛 [$timestamp] $message');
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ Warning log
  static void w(String message, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('⚠️ [$timestamp] WARNING: $message');
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ Error log
  static void e(String message, {dynamic error, StackTrace? stackTrace}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('❌ [$timestamp] ERROR: $message');
    
    if (error != null) {
      print('   🔥 Error: $error');
    }
    
    if (stackTrace != null) {
      print('   📚 StackTrace: $stackTrace');
    }
  }
  
  // ✅ Success log
  static void s(String message, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('✅ [$timestamp] SUCCESS: $message');
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ API Request log
  static void apiRequest(String method, String endpoint, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('🌐 [$timestamp] API REQUEST: $method $endpoint');
    if (data != null) {
      print('   📤 Request Data: $data');
    }
  }
  
  // ✅ API Response log
  static void apiResponse(int statusCode, String endpoint, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    final statusEmoji = _getStatusEmoji(statusCode);
    print('🌐 [$timestamp] API RESPONSE: $statusEmoji $statusCode $endpoint');
    if (data != null) {
      print('   📥 Response Data: $data');
    }
  }
  
  // ✅ Navigation log
  static void navigation(String action, String route, {Map<String, dynamic>? args}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('🧭 [$timestamp] NAVIGATION: $action -> $route');
    if (args != null && args.isNotEmpty) {
      print('   📋 Arguments: $args');
    }
  }
  
  // ✅ Auth log
  static void auth(String action, {String? userId, dynamic data, bool? success}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    final emoji = success == true ? '✅' : success == false ? '❌' : '🔐';
    print('$emoji [$timestamp] AUTH: $action');
    if (userId != null) {
      print('   👤 User ID: $userId');
    }
    if (success != null) {
      print('   📊 Success: $success');
    }
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ Bloc event log
  static void blocEvent(String blocName, String eventName, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('🎯 [$timestamp] BLOC EVENT: $blocName -> $eventName');
    if (data != null) {
      print('   📄 Event Data: $data');
    }
  }
  
  // ✅ Bloc state log
  static void blocState(String blocName, String stateName, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('🔄 [$timestamp] BLOC STATE: $blocName -> $stateName');
    if (data != null) {
      print('   📄 State Data: $data');
    }
  }
  
  // ✅ Cache log
  static void cache(String action, String key, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('💾 [$timestamp] CACHE: $action - $key');
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ Network log
  static void network(String message, {bool isConnected = true}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    final emoji = isConnected ? '📶' : '📵';
    print('$emoji [$timestamp] NETWORK: $message');
  }
  
  // ✅ Database log
  static void database(String operation, String table, {dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('🗄️ [$timestamp] DATABASE: $operation on $table');
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ Performance log
  static void performance(String operation, Duration duration, {Map<String, dynamic>? metrics}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('⚡ [$timestamp] PERFORMANCE: $operation took ${duration.inMilliseconds}ms');
    if (metrics != null) {
      print('   📊 Metrics: $metrics');
    }
  }
  
  // ✅ User action log
  static void userAction(String action, {Map<String, dynamic>? properties}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('👆 [$timestamp] USER ACTION: $action');
    if (properties != null) {
      print('   📋 Properties: $properties');
    }
  }
  
  // ✅ Feature flag log
  static void featureFlag(String flag, bool isEnabled, {String? reason}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    final emoji = isEnabled ? '🟢' : '🔴';
    print('$emoji [$timestamp] FEATURE FLAG: $flag = $isEnabled');
    if (reason != null) {
      print('   💭 Reason: $reason');
    }
  }
  
  // ✅ Security log
  static void security(String event, {String? level, dynamic data}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('🛡️ [$timestamp] SECURITY: $event');
    if (level != null) {
      print('   🚨 Level: $level');
    }
    if (data != null) {
      print('   📄 Data: $data');
    }
  }
  
  // ✅ Analytics log
  static void analytics(String event, {Map<String, dynamic>? parameters}) {
    if (!_enableLogging) return;
    final timestamp = _getTimestamp();
    print('📈 [$timestamp] ANALYTICS: $event');
    if (parameters != null) {
      print('   📊 Parameters: $parameters');
    }
  }
  
  // ✅ Crash log
  static void crash(String message, {dynamic error, StackTrace? stackTrace}) {
    // Crash logları her zaman yazdırılır
    final timestamp = _getTimestamp();
    print('💥 [$timestamp] CRASH: $message');
    
    if (error != null) {
      print('   🔥 Error: $error');
    }
    
    if (stackTrace != null) {
      print('   📚 StackTrace: $stackTrace');
    }
    
    // Production'da crash reporting servisleri burada çağrılabilir
    // Örn: FirebaseCrashlytics, Sentry, etc.
  }
  
  // ✅ Separator - log'ları gruplamak için
  static void separator([String? title]) {
    if (!_enableLogging) return;
    const line = '═══════════════════════════════════════════════════════════';
    print(line);
    if (title != null) {
      print('    $title');
      print(line);
    }
  }
  
  // ✅ Helper: Timestamp oluştur
  static String _getTimestamp() {
    final now = DateTime.now();
    return '${now.hour.toString().padLeft(2, '0')}:'
           '${now.minute.toString().padLeft(2, '0')}:'
           '${now.second.toString().padLeft(2, '0')}.'
           '${now.millisecond.toString().padLeft(3, '0')}';
  }
  
  // ✅ Helper: HTTP status code için emoji
  static String _getStatusEmoji(int statusCode) {
    if (statusCode >= 200 && statusCode < 300) return '✅';
    if (statusCode >= 300 && statusCode < 400) return '↩️';
    if (statusCode >= 400 && statusCode < 500) return '❌';
    if (statusCode >= 500) return '💥';
    return '❓';
  }
  
  // ✅ Logger durumunu kontrol et
  static bool get isEnabled => _enableLogging;
  static bool get isInitialized => _isInitialized;
  
  // ✅ Logger'ı devre dışı bırak
  static void disable() {
    _enableLogging = false;
    print('🔇 [AppLogger] Logger devre dışı bırakıldı');
  }
  
  // ✅ Logger'ı etkinleştir
  static void enable() {
    _enableLogging = kDebugMode;
    if (_enableLogging) {
      print('🔊 [AppLogger] Logger etkinleştirildi');
    }
  }
}