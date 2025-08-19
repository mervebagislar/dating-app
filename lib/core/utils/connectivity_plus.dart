
// ==================== CONNECTIVITY CHECK ====================

// lib/core/utils/connectivity_service.dart
import 'package:connectivity_plus/connectivity_plus.dart';

class ConnectivityService {
  static final Connectivity _connectivity = Connectivity();

  static Future<bool> hasConnection() async {
    final result = await _connectivity.checkConnectivity();
    return result != ConnectivityResult.none;
  }

  static Stream<ConnectivityResult> get connectivityStream =>
      _connectivity.onConnectivityChanged;
}