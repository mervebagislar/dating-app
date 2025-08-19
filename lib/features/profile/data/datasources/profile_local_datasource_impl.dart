// lib/features/profile/data/datasources/profile_local_datasource_impl.dart (UPDATED)
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../../core/errors/exceptions.dart';
import '../models/profile_model.dart';
import 'profile_local_datasource.dart';

class ProfileLocalDataSourceImpl implements ProfileLocalDataSource {
  final FlutterSecureStorage secureStorage;
  static const String _profileKey = 'cached_profile';
  static const String _profileVersionKey = 'cached_profile_version';
  static const int _currentCacheVersion = 1; // For cache invalidation

  ProfileLocalDataSourceImpl({required this.secureStorage});

  @override
  Future<ProfileModel?> getCachedProfile() async {
    try {
      print('📱 ProfileLocalDataSource: Attempting to load cached profile...');
      
      // Check cache version first
      final versionString = await secureStorage.read(key: _profileVersionKey);
      final cacheVersion = int.tryParse(versionString ?? '0') ?? 0;
      
      if (cacheVersion < _currentCacheVersion) {
        print('📱 ProfileLocalDataSource: Cache version outdated, clearing cache');
        await clearCache();
        return null;
      }

      final jsonString = await secureStorage.read(key: _profileKey);
      
      if (jsonString != null && jsonString.isNotEmpty) {
        try {
          final json = jsonDecode(jsonString) as Map<String, dynamic>;
          
          // Validate JSON structure
          if (!_isValidProfileJson(json)) {
            print('⚠️ ProfileLocalDataSource: Invalid cached profile structure, clearing cache');
            await clearCache();
            return null;
          }
          
          final profile = ProfileModel.fromJson(json);
          print('✅ ProfileLocalDataSource: Cached profile loaded successfully - ${profile.name}');
          return profile;
        } on FormatException catch (e) {
          print('❌ ProfileLocalDataSource: JSON decode error: $e');
          // Clear corrupted cache
          await clearCache();
          throw CacheException(
            message: 'Corrupted cache data detected and cleared: ${e.message}',
          );
        }
      }
      
      print('📱 ProfileLocalDataSource: No cached profile found');
      return null;
    } on CacheException {
      // Re-throw cache exceptions
      rethrow;
    } catch (e) {
      print('❌ ProfileLocalDataSource: Unexpected error loading cached profile: $e');
      
      // Handle specific error types
      if (e.toString().contains('permission') || e.toString().contains('access')) {
        throw CacheException(
          message: 'Storage access denied: $e',
          statusCode: 403,
        );
      } else if (e.toString().contains('space') || e.toString().contains('storage')) {
        throw CacheException(
          message: 'Insufficient storage space: $e',
          statusCode: 507,
        );
      } else {
        throw CacheException(
          message: 'Failed to load cached profile: $e',
        );
      }
    }
  }

  @override
  Future<void> cacheProfile(ProfileModel profile) async {
    try {
      print('📱 ProfileLocalDataSource: Caching profile for ${profile.name}...');
      
      // Validate profile before caching
      if (profile.id.isEmpty || profile.name.isEmpty) {
        throw CacheException(
          message: 'Invalid profile data: ID and name are required',
          statusCode: 400,
        );
      }

      final jsonMap = profile.toJson();
      
      // Add metadata to cache
      jsonMap['_cached_at'] = DateTime.now().toIso8601String();
      jsonMap['_cache_version'] = _currentCacheVersion;
      
      final jsonString = jsonEncode(jsonMap);
      
      // Check if data is too large (SecureStorage has limits)
      if (jsonString.length > 1024 * 1024) { // 1MB limit
        print('⚠️ ProfileLocalDataSource: Profile data too large, caching essential data only');
        
        // Cache only essential data
        final essentialData = {
          'id': profile.id,
          'name': profile.name,
          'email': profile.email,
          'photoUrl': profile.photoUrl,
          '_cached_at': DateTime.now().toIso8601String(),
          '_cache_version': _currentCacheVersion,
        };
        
        await secureStorage.write(key: _profileKey, value: jsonEncode(essentialData));
      } else {
        await secureStorage.write(key: _profileKey, value: jsonString);
      }
      
      // Store cache version separately
      await secureStorage.write(key: _profileVersionKey, value: _currentCacheVersion.toString());
      
      print('✅ ProfileLocalDataSource: Profile cached successfully');
    } catch (e) {
      print('❌ ProfileLocalDataSource: Error caching profile: $e');
      
      // Handle specific error types
      if (e.toString().contains('permission') || e.toString().contains('access')) {
        throw CacheException(
          message: 'Storage access denied: $e',
          statusCode: 403,
        );
      } else if (e.toString().contains('space') || e.toString().contains('storage') || e.toString().contains('quota')) {
        throw CacheException(
          message: 'Insufficient storage space: $e',
          statusCode: 507,
        );
      } else if (e.toString().contains('size') || e.toString().contains('large')) {
        throw CacheException(
          message: 'Profile data too large to cache: $e',
          statusCode: 413,
        );
      } else {
        throw CacheException(
          message: 'Failed to cache profile: $e',
        );
      }
    }
  }

  @override
  Future<void> clearCache() async {
    try {
      print('📱 ProfileLocalDataSource: Clearing profile cache...');
      
      // Clear both profile and version keys
      await Future.wait([
        secureStorage.delete(key: _profileKey),
        secureStorage.delete(key: _profileVersionKey),
      ]);
      
      print('✅ ProfileLocalDataSource: Profile cache cleared successfully');
    } catch (e) {
      print('❌ ProfileLocalDataSource: Error clearing cache: $e');
      
      // Handle specific error types
      if (e.toString().contains('permission') || e.toString().contains('access')) {
        throw CacheException(
          message: 'Storage access denied while clearing cache: $e',
          statusCode: 403,
        );
      } else {
        throw CacheException(
          message: 'Failed to clear profile cache: $e',
        );
      }
    }
  }

  // ✅ ADDITIONAL HELPER METHODS

  /// Check if cached profile exists
  Future<bool> hasCachedProfile() async {
    try {
      final jsonString = await secureStorage.read(key: _profileKey);
      return jsonString != null && jsonString.isNotEmpty;
    } catch (e) {
      print('❌ ProfileLocalDataSource: Error checking cache existence: $e');
      return false;
    }
  }

  /// Get cache timestamp
  Future<DateTime?> getCacheTimestamp() async {
    try {
      final jsonString = await secureStorage.read(key: _profileKey);
      if (jsonString != null) {
        final json = jsonDecode(jsonString) as Map<String, dynamic>;
        final timestampString = json['_cached_at'] as String?;
        if (timestampString != null) {
          return DateTime.tryParse(timestampString);
        }
      }
      return null;
    } catch (e) {
      print('❌ ProfileLocalDataSource: Error getting cache timestamp: $e');
      return null;
    }
  }

  /// Check if cache is expired
  Future<bool> isCacheExpired({Duration maxAge = const Duration(hours: 24)}) async {
    try {
      final timestamp = await getCacheTimestamp();
      if (timestamp == null) return true;
      
      final age = DateTime.now().difference(timestamp);
      final isExpired = age > maxAge;
      
      if (isExpired) {
        print('⏰ ProfileLocalDataSource: Cache expired (age: ${age.inHours}h)');
      }
      
      return isExpired;
    } catch (e) {
      print('❌ ProfileLocalDataSource: Error checking cache expiry: $e');
      return true; // Assume expired on error
    }
  }

  /// Get cache size info
  Future<Map<String, dynamic>> getCacheInfo() async {
    try {
      final jsonString = await secureStorage.read(key: _profileKey);
      final versionString = await secureStorage.read(key: _profileVersionKey);
      final timestamp = await getCacheTimestamp();
      
      return {
        'exists': jsonString != null,
        'size_bytes': jsonString?.length ?? 0,
        'size_kb': ((jsonString?.length ?? 0) / 1024).toStringAsFixed(2),
        'version': int.tryParse(versionString ?? '0') ?? 0,
        'cached_at': timestamp?.toIso8601String(),
        'age_hours': timestamp != null 
            ? DateTime.now().difference(timestamp).inHours 
            : null,
        'is_expired': await isCacheExpired(),
      };
    } catch (e) {
      print('❌ ProfileLocalDataSource: Error getting cache info: $e');
      return {'error': e.toString()};
    }
  }

  /// Validate JSON structure
  bool _isValidProfileJson(Map<String, dynamic> json) {
    // Check for required fields
    final requiredFields = ['id', 'name'];
    
    for (final field in requiredFields) {
      if (!json.containsKey(field) || json[field] == null) {
        print('⚠️ ProfileLocalDataSource: Missing required field: $field');
        return false;
      }
    }
    
    // Check data types
    if (json['id'] is! String || (json['id'] as String).isEmpty) {
      print('⚠️ ProfileLocalDataSource: Invalid ID field');
      return false;
    }
    
    if (json['name'] is! String || (json['name'] as String).isEmpty) {
      print('⚠️ ProfileLocalDataSource: Invalid name field');
      return false;
    }
    
    return true;
  }

  /// Clear expired cache automatically
  Future<void> clearExpiredCache() async {
    try {
      if (await isCacheExpired()) {
        print('🗑️ ProfileLocalDataSource: Clearing expired cache');
        await clearCache();
      }
    } catch (e) {
      print('❌ ProfileLocalDataSource: Error clearing expired cache: $e');
    }
  }
}