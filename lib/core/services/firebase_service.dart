// lib/core/services/firebase_service.dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class FirebaseService {
  static FirebaseAnalytics? _analytics;
  static FirebaseCrashlytics? _crashlytics;
  static bool _isInitialized = false;

  // ✅ INITIALIZE FIREBASE
  static Future<void> initialize() async {
    try {
      if (kDebugMode) {
        print('🔥 Initializing Firebase...');
      }

      // Initialize Firebase
      await Firebase.initializeApp();

      // Initialize Analytics
      _analytics = FirebaseAnalytics.instance;
      await _analytics!.setAnalyticsCollectionEnabled(true);

      // Initialize Crashlytics
      _crashlytics = FirebaseCrashlytics.instance;

      // ✅ CRASHLYTICS CONFIGURATION
      await _configureCrashlytics();

      // ✅ SET USER PROPERTIES
      await _setDefaultUserProperties();

      _isInitialized = true;
      if (kDebugMode) {
        print('✅ Firebase initialized successfully');
      }

      // ✅ LOG INITIALIZATION EVENT
      await logEvent('app_initialized', {
        'platform': defaultTargetPlatform.name,
        'timestamp': DateTime.now().toIso8601String(),
      });
    } catch (e) {
      print('❌ Firebase initialization error: $e');
      // Don't throw - app should continue without Firebase
    }
  }

  // ✅ CONFIGURE CRASHLYTICS
  static Future<void> _configureCrashlytics() async {
    if (_crashlytics == null) return;

    try {
      // ✅ ENABLE CRASHLYTICS COLLECTION
      await _crashlytics!.setCrashlyticsCollectionEnabled(true);

      // ✅ SET CRASHLYTICS IN DEBUG MODE
      if (kDebugMode) {
        // Force crash reporting in debug mode for testing
        await _crashlytics!.setCrashlyticsCollectionEnabled(true);
      }

      // ✅ HANDLE FLUTTER ERRORS
      FlutterError.onError = (FlutterErrorDetails details) {
        print('🔥 Flutter Error: ${details.exception}');
        _crashlytics!.recordFlutterFatalError(details);
      };

      // ✅ HANDLE PLATFORM ERRORS
      PlatformDispatcher.instance.onError = (error, stack) {
        print('🔥 Platform Error: $error');
        _crashlytics!.recordError(error, stack, fatal: true);
        return true;
      };

      print('✅ Crashlytics configured successfully');
    } catch (e) {
      print('❌ Crashlytics configuration error: $e');
    }
  }

  // ✅ SET DEFAULT USER PROPERTIES
  static Future<void> _setDefaultUserProperties() async {
    if (_analytics == null) return;

    try {
      await _analytics!.setUserProperty(name: 'app_version', value: '1.0.0');

      await _analytics!.setUserProperty(
        name: 'platform',
        value: defaultTargetPlatform.name,
      );

      print('✅ Default user properties set');
    } catch (e) {
      print('❌ Error setting user properties: $e');
    }
  }

  // ✅ LOG EVENT
  static Future<void> logEvent(
    String name,
    Map<String, dynamic>? parameters,
  ) async {
    if (!_isInitialized || _analytics == null) return;

    try {
      await _analytics!.logEvent(name: name, parameters: parameters);
      print('📊 Analytics event logged: $name');
    } catch (e) {
      print('❌ Error logging event: $e');
    }
  }

  // ✅ LOG SCREEN VIEW
  static Future<void> logScreenView(
    String screenName,
    String? screenClass,
  ) async {
    if (!_isInitialized || _analytics == null) return;

    try {
      await _analytics!.logScreenView(
        screenName: screenName,
        screenClass: screenClass,
      );
      print('📱 Screen view logged: $screenName');
    } catch (e) {
      print('❌ Error logging screen view: $e');
    }
  }

  // ✅ SET USER ID
  static Future<void> setUserId(String userId) async {
    if (!_isInitialized) return;

    try {
      await _analytics?.setUserId(id: userId);
      await _crashlytics?.setUserIdentifier(userId);
      print('👤 User ID set: $userId');
    } catch (e) {
      print('❌ Error setting user ID: $e');
    }
  }

  // ✅ SET USER PROPERTIES
  static Future<void> setUserProperty(String name, String value) async {
    if (!_isInitialized || _analytics == null) return;

    try {
      await _analytics!.setUserProperty(name: name, value: value);
      print('👤 User property set: $name = $value');
    } catch (e) {
      print('❌ Error setting user property: $e');
    }
  }

  // ✅ LOG ERROR TO CRASHLYTICS
  static Future<void> logError(
    dynamic exception,
    StackTrace? stackTrace, {
    String? reason,
    Map<String, dynamic>? data,
    bool fatal = false,
  }) async {
    if (!_isInitialized || _crashlytics == null) return;

    try {
      // ✅ SET CUSTOM KEYS
      if (data != null) {
        for (final entry in data.entries) {
          await _crashlytics!.setCustomKey(entry.key, entry.value);
        }
      }

      // ✅ LOG ERROR
      await _crashlytics!.recordError(
        exception,
        stackTrace,
        reason: reason,
        fatal: fatal,
      );

      print('🔥 Error logged to Crashlytics: $exception');
    } catch (e) {
      print('❌ Error logging to Crashlytics: $e');
    }
  }

  // ✅ LOG CUSTOM MESSAGE
  static Future<void> logMessage(String message) async {
    if (!_isInitialized || _crashlytics == null) return;

    try {
      await _crashlytics!.log(message);
      print('📝 Message logged: $message');
    } catch (e) {
      print('❌ Error logging message: $e');
    }
  }

  // ✅ FORCE CRASH (FOR TESTING)
  static void forceCrash() {
    if (!_isInitialized || _crashlytics == null) return;

    if (kDebugMode) {
      print('🔥 Force crash triggered');
      _crashlytics!.crash();
    }
  }

  // ✅ ANALYTICS HELPER METHODS
  static Future<void> logLogin(String method) async {
    await logEvent('login', {'login_method': method});
  }

  static Future<void> logSignUp(String method) async {
    await logEvent('sign_up', {'sign_up_method': method});
  }

  static Future<void> logMovieView(String movieId, String movieTitle) async {
    await logEvent('movie_view', {
      'movie_id': movieId,
      'movie_title': movieTitle,
    });
  }

  static Future<void> logMovieFavorite(String movieId, bool isFavorite) async {
    await logEvent('movie_favorite', {
      'movie_id': movieId,
      'action': isFavorite ? 'add' : 'remove',
    });
  }

  static Future<void> logProfilePhotoUpload() async {
    await logEvent('profile_photo_upload', {
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  static Future<void> logPremiumOfferView() async {
    await logEvent('premium_offer_view', {
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  static Future<void> logPremiumPurchase(String packageId, String price) async {
    await logEvent('premium_purchase', {
      'package_id': packageId,
      'price': price,
      'currency': 'TRY',
    });
  }

  static Future<void> logLanguageChange(
    String fromLanguage,
    String toLanguage,
  ) async {
    await logEvent('language_change', {
      'from_language': fromLanguage,
      'to_language': toLanguage,
    });
  }

  // ✅ GET ANALYTICS INSTANCE
  static FirebaseAnalytics? get analytics => _analytics;

  // ✅ GET CRASHLYTICS INSTANCE
  static FirebaseCrashlytics? get crashlytics => _crashlytics;

  // ✅ CHECK IF INITIALIZED
  static bool get isInitialized => _isInitialized;
}

// ✅ ANALYTICS OBSERVER FOR NAVIGATION
class FirebaseAnalyticsObserver extends RouteObserver<PageRoute<dynamic>> {
  FirebaseAnalyticsObserver({FirebaseAnalytics? analytics})
    : _analytics = analytics ?? FirebaseService.analytics;

  final FirebaseAnalytics? _analytics;

  void _sendScreenView(PageRoute<dynamic> route) {
    final screenName = route.settings.name ?? 'Unknown';
    final screenClass = route.runtimeType.toString();

    FirebaseService.logScreenView(screenName, screenClass);
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPush(route, previousRoute);
    if (route is PageRoute) {
      _sendScreenView(route);
    }
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    if (newRoute is PageRoute) {
      _sendScreenView(newRoute);
    }
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPop(route, previousRoute);
    if (previousRoute is PageRoute) {
      _sendScreenView(previousRoute);
    }
  }
}

// ✅ ERROR HANDLER MIXIN
mixin FirebaseErrorHandler {
  void handleError(
    dynamic error, {
    StackTrace? stackTrace,
    String? context,
    Map<String, dynamic>? additionalData,
    bool fatal = false,
  }) {
    print('❌ Error in $context: $error');

    FirebaseService.logError(
      error,
      stackTrace ?? StackTrace.current,
      reason: context,
      data: additionalData,
      fatal: fatal,
    );
  }

  void logInfo(String message) {
    print('ℹ️ $message');
    FirebaseService.logMessage(message);
  }
}
