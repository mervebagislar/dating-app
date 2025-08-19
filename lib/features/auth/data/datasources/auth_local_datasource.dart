// lib/features/auth/data/datasources/auth_local_datasource.dart
import 'dart:convert';
import 'package:dating_app/core/errors/exceptions.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/utils/logger.dart';
import '../models/user_model.dart';

abstract class AuthLocalDataSource {
  // ✅ STANDARDIZED: Method names to match injection container
  Future<String?> getToken();
  Future<void> saveToken(String token);
  Future<void> deleteToken();
  
  Future<UserModel?> getCachedUser();
  Future<void> cacheUser(UserModel user);
  Future<void> deleteCachedUser();
  
  Future<bool> isAuthenticated();
  Future<void> clearAllAuthData();
  
  // ✅ Additional methods (kept as extras)
  Future<bool> validateStoredToken();
  Future<void> updateCachedUserPhoto(String photoUrl);
  Future<DateTime?> getTokenCreationTime();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final FlutterSecureStorage storage; // ✅ FIXED: Constructor parameter

  // ✅ FIXED: Constructor with named parameter to match injection
  const AuthLocalDataSourceImpl({required this.storage});

  // ✅ STANDARDIZED: Method implementations
  @override
  Future<String?> getToken() async {
    try {
      final token = await storage.read(key: 'auth_token');
      
      if (token != null) {
        AppLogger.d('Auth token retrieved from storage');
      } else {
        AppLogger.d('No auth token found in storage');
      }
      
      return token;
    } catch (e) {
      AppLogger.e('Error retrieving auth token: $e');
      throw CacheException(message: 'Failed to get token: $e');
    }
  }

  @override
  Future<void> saveToken(String token) async {
    try {
      await storage.write(key: 'auth_token', value: token);
      AppLogger.i('[Auth] Token saved to storage');
    } catch (e) {
      AppLogger.e('[Auth] Error saving token: $e');
      throw CacheException(message: 'Failed to save token: $e');
    }
  }

  @override
  Future<void> deleteToken() async {
    try {
      await storage.delete(key: 'auth_token');
      AppLogger.i('[Auth] Token deleted from storage');
    } catch (e) {
      AppLogger.e('[Auth] Error deleting token: $e');
      throw CacheException(message: 'Failed to delete token: $e');
    }
  }

  @override
  Future<UserModel?> getCachedUser() async {
    try {
      final userJson = await storage.read(key: 'cached_user');
      
      if (userJson != null && userJson.isNotEmpty) {
        final userData = json.decode(userJson) as Map<String, dynamic>;
        final user = UserModel.fromJson(userData);
        AppLogger.i('[Auth] User loaded from cache: ${user.name}');
        return user;
      } else {
        AppLogger.d('No cached user found');
        return null;
      }
    } catch (e) {
      AppLogger.e('[Auth] Error loading cached user: $e');
      return null; // Return null instead of throwing for cached data
    }
  }

  @override
  Future<void> cacheUser(UserModel user) async {
    try {
      final userJson = json.encode(user.toJson());
      await storage.write(key: 'cached_user', value: userJson);
      AppLogger.i('[Auth] User cached: ${user.name}');
    } catch (e) {
      AppLogger.e('[Auth] Error caching user: $e');
      throw CacheException(message: 'Failed to cache user: $e');
    }
  }

  @override
  Future<void> deleteCachedUser() async {
    try {
      await storage.delete(key: 'cached_user');
      AppLogger.i('[Auth] Cached user deleted');
    } catch (e) {
      AppLogger.e('[Auth] Error deleting cached user: $e');
      throw CacheException(message: 'Failed to delete cached user: $e');
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    try {
      final token = await getToken();
      final user = await getCachedUser();
      
      final authenticated = token != null && 
                           token.isNotEmpty && 
                           user != null;
      
      AppLogger.d('Authentication check: $authenticated');
      return authenticated;
    } catch (e) {
      AppLogger.e('Error checking authentication: $e');
      return false;
    }
  }

  @override
  Future<void> clearAllAuthData() async {
    try {
      await Future.wait([
        deleteToken(),
        deleteCachedUser(),
      ]);
      AppLogger.i('[Auth] All auth data cleared');
    } catch (e) {
      AppLogger.e('[Auth] Error clearing all auth data: $e');
      throw CacheException(message: 'Failed to clear auth data: $e');
    }
  }

  // ✅ ADDITIONAL HELPER METHODS (KEPT FROM ORIGINAL)
  
  @override
  Future<bool> validateStoredToken() async {
    try {
      final token = await getToken();
      
      if (token == null || token.isEmpty) {
        return false;
      }

      // Basic JWT validation
      try {
        final parts = token.split('.');
        if (parts.length != 3) return false;

        final payload = parts[1];
        final normalized = base64Url.normalize(payload);
        final decoded = utf8.decode(base64Url.decode(normalized));
        final payloadMap = json.decode(decoded) as Map<String, dynamic>;

        if (payloadMap.containsKey('exp')) {
          final exp = payloadMap['exp'] as int;
          final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;

          if (now >= exp) {
            AppLogger.w('Token expired, clearing auth data');
            await clearAllAuthData();
            return false;
          }
        }

        return true;
      } catch (jwtError) {
        AppLogger.w('Could not validate JWT structure, assuming valid: $jwtError');
        return true; // Assume valid if we can't parse
      }
    } catch (e) {
      AppLogger.e('Error validating token: $e');
      return false;
    }
  }

  @override
  Future<void> updateCachedUserPhoto(String photoUrl) async {
    try {
      final user = await getCachedUser();
      if (user != null) {
        final updatedUser = user.copyWith(photoUrl: photoUrl);
        await cacheUser(updatedUser);
        AppLogger.d('User photo updated in cache');
      }
    } catch (e) {
      AppLogger.e('Error updating cached user photo: $e');
    }
  }

  @override
  Future<DateTime?> getTokenCreationTime() async {
    try {
      final token = await getToken();
      if (token == null) return null;

      final parts = token.split('.');
      if (parts.length != 3) return null;

      final payload = parts[1];
      final normalized = base64Url.normalize(payload);
      final decoded = utf8.decode(base64Url.decode(normalized));
      final payloadMap = json.decode(decoded) as Map<String, dynamic>;

      if (payloadMap.containsKey('iat')) {
        final iat = payloadMap['iat'] as int;
        return DateTime.fromMillisecondsSinceEpoch(iat * 1000);
      }

      return null;
    } catch (e) {
      AppLogger.e('Error getting token creation time: $e');
      return null;
    }
  }
}