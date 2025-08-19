// ==================== DEBUG HELPER ====================

// lib/core/utils/router_debug.dart (OPTIONAL)
import 'package:flutter/foundation.dart';

class RouterDebug {
  static void printCurrentRoute(String routeName) {
    if (kDebugMode) {
      print('📍 Current Route: $routeName');
    }
  }
  
  static void printAuthStatus(bool isAuth, String? token) {
    if (kDebugMode) {
      print('🔐 Auth Status: $isAuth');
    }
    if (kDebugMode) {
      print('🔑 Token: ${token != null ? "Exists" : "Missing"}');
    }
  }
  
  static void printNavigation(String from, String to) {
    if (kDebugMode) {
      print('🧭 Navigation: $from → $to');
    }
  }
}