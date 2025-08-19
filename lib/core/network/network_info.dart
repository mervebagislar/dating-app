// lib/core/network/network_info.dart
import 'package:connectivity_plus/connectivity_plus.dart';
import '../utils/logger.dart';

abstract class NetworkInfo {
  Future<bool> get isConnected;
  Stream<ConnectivityResult> get connectivityStream;
}

class NetworkInfoImpl implements NetworkInfo {
  final Connectivity connectivity;
  
  NetworkInfoImpl(this.connectivity);
  
  @override
  Future<bool> get isConnected => _checkConnectivity();
  
  @override
  Stream<ConnectivityResult> get connectivityStream => 
      connectivity.onConnectivityChanged;
  
  Future<bool> _checkConnectivity() async {
    try {
      final result = await connectivity.checkConnectivity();
      final connected = result != ConnectivityResult.none;
      
      AppLogger.d('Network connectivity: ${connected ? 'Connected' : 'Disconnected'} ($result)');
      
      return connected;
    } catch (e) {
      AppLogger.e('Error checking connectivity', error: e);
      return false;
    }
  }
}

// ✅ Helper class for network status
class NetworkHelper {
  static final Connectivity _connectivity = Connectivity();
  static late NetworkInfo _networkInfo;
  
  static void initialize() {
    _networkInfo = NetworkInfoImpl(_connectivity);
    AppLogger.i('NetworkHelper initialized');
  }
  
  static NetworkInfo get instance => _networkInfo;
  
  // ✅ Quick connectivity check
  static Future<bool> hasConnection() async {
    return await _networkInfo.isConnected;
  }
  
  // ✅ Listen to connectivity changes
  static Stream<bool> get connectionStream {
    return _networkInfo.connectivityStream.map((result) {
      final connected = result != ConnectivityResult.none;
      AppLogger.d('Network status changed: ${connected ? 'Connected' : 'Disconnected'}');
      return connected;
    });
  }
  
  // ✅ Get connection type
  static Future<ConnectivityResult> getConnectionType() async {
    try {
      return await _connectivity.checkConnectivity();
    } catch (e) {
      AppLogger.e('Error getting connection type', error: e);
      return ConnectivityResult.none;
    }
  }
  
  // ✅ Get connection type name
  static Future<String> getConnectionTypeName() async {
    final result = await getConnectionType();
    switch (result) {
      case ConnectivityResult.wifi:
        return 'WiFi';
      case ConnectivityResult.mobile:
        return 'Mobil Veri';
      case ConnectivityResult.ethernet:
        return 'Ethernet';
      case ConnectivityResult.vpn:
        return 'VPN';
      case ConnectivityResult.bluetooth:
        return 'Bluetooth';
      case ConnectivityResult.other:
        return 'Diğer';
      case ConnectivityResult.none:
      default:
        return 'Bağlantı Yok';
    }
  }
  
  // ✅ Check if specific connection type is available
  static Future<bool> isWifiConnected() async {
    final result = await getConnectionType();
    return result == ConnectivityResult.wifi;
  }
  
  static Future<bool> isMobileConnected() async {
    final result = await getConnectionType();
    return result == ConnectivityResult.mobile;
  }
}