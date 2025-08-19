// lib/features/profile/data/datasources/profile_remote_datasource_impl.dart (FIXED)
import 'dart:io';
import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/errors/exceptions.dart';
import '../models/profile_model.dart';
import '../models/photo_upload_model.dart';
import 'profile_remote_datasource.dart';

class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final Dio dio;

  ProfileRemoteDataSourceImpl({required this.dio});

  @override
  Future<ProfileModel> getProfile() async {
    try {
      print('🌐 ProfileRemoteDataSource: Getting profile...');
      
      final response = await dio.get(ApiConstants.profileEndpoint);
      
      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data as Map<String, dynamic>;
        
        // Handle API response format: {response: {...}, data: {user data}}
        Map<String, dynamic> userData;
        
        if (responseData.containsKey('data') && responseData['data'] != null) {
          userData = responseData['data'] as Map<String, dynamic>;
        } else {
          userData = responseData;
        }
        
        final profileModel = ProfileModel.fromJson(userData);
        print('✅ ProfileRemoteDataSource: Profile loaded successfully');
        
        return profileModel;
      } else {
        throw ServerException(
          message: 'Invalid response: ${response.statusCode}',
          statusCode: response.statusCode,
        );
      }
    } on DioException catch (e) {
      print('❌ ProfileRemoteDataSource: DioException: ${e.response?.data}');
      
      // Handle different types of errors
      if (e.response?.statusCode == 401) {
        throw AuthException(
          message: 'Authentication failed - please login again',
          statusCode: e.response?.statusCode,
        );
      } else if (e.response?.statusCode == 403) {
        throw AuthException(
          message: 'Access forbidden - insufficient permissions',
          statusCode: e.response?.statusCode,
        );
      } else if (e.response?.statusCode == 404) {
        throw ServerException(
          message: 'Profile not found',
          statusCode: e.response?.statusCode,
        );
      } else {
        throw ServerException(
          message: 'Failed to get profile: ${e.message}',
          statusCode: e.response?.statusCode,
        );
      }
    } catch (e) {
      print('❌ ProfileRemoteDataSource: General exception: $e');
      throw ServerException(message: 'Failed to get profile: $e');
    }
  }

  @override
  Future<ProfileModel> updateProfile(ProfileModel profile) async {
    try {
      print('🌐 ProfileRemoteDataSource: Updating profile...');
      
      final response = await dio.put(
        ApiConstants.profileEndpoint,
        data: profile.toJson(),
      );
      
      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data as Map<String, dynamic>;
        
        Map<String, dynamic> userData;
        if (responseData.containsKey('data')) {
          userData = responseData['data'] as Map<String, dynamic>;
        } else {
          userData = responseData;
        }
        
        final updatedProfile = ProfileModel.fromJson(userData);
        print('✅ ProfileRemoteDataSource: Profile updated successfully');
        
        return updatedProfile;
      } else {
        throw ServerException(
          message: 'Failed to update profile: ${response.statusCode}',
          statusCode: response.statusCode,
        );
      }
    } on DioException catch (e) {
      print('❌ ProfileRemoteDataSource: Update DioException: ${e.response?.data}');
      
      // Handle validation errors from server
      if (e.response?.statusCode == 400) {
        final responseData = e.response?.data;
        if (responseData is Map<String, dynamic> && responseData.containsKey('errors')) {
          throw ValidationException(
            message: 'Profile validation failed',
            statusCode: e.response?.statusCode,
            errors: Map<String, List<String>>.from(responseData['errors']),
          );
        } else {
          throw ValidationException(
            message: 'Invalid profile data: ${e.message}',
            statusCode: e.response?.statusCode,
          );
        }
      } else if (e.response?.statusCode == 401) {
        throw AuthException(
          message: 'Authentication failed - please login again',
          statusCode: e.response?.statusCode,
        );
      } else {
        throw ServerException(
          message: 'Failed to update profile: ${e.message}',
          statusCode: e.response?.statusCode,
        );
      }
    } catch (e) {
      print('❌ ProfileRemoteDataSource: Update general exception: $e');
      throw ServerException(message: 'Failed to update profile: $e');
    }
  }

  @override
  Future<PhotoUploadModel> uploadPhoto(File imageFile) async {
    try {
      print('📸 ProfileRemoteDataSource: Starting photo upload...');
      print('📸 File path: ${imageFile.path}');
      print('📸 File size: ${await imageFile.length()} bytes');

      // Create FormData
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          imageFile.path,
          filename: 'profile_photo.jpg',
        ),
      });

      final response = await dio.post(
        ApiConstants.uploadPhotoEndpoint,
        data: formData,
        options: Options(
          headers: {
            'accept': 'application/json',
          },
        ),
      );

      print('📸 ProfileRemoteDataSource: Response status: ${response.statusCode}');
      print('📸 ProfileRemoteDataSource: Response data: ${response.data}');

      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data as Map<String, dynamic>;
        
        String? photoUrl;
        
        // Handle different response formats
        if (responseData.containsKey('data') && responseData['data'] != null) {
          final data = responseData['data'] as Map<String, dynamic>;
          photoUrl = data['photoUrl'] ?? data['photo_url'];
        } else {
          photoUrl = responseData['photoUrl'] ?? responseData['photo_url'];
        }

        if (photoUrl != null && photoUrl.isNotEmpty) {
          final photoUploadModel = PhotoUploadModel.fromJson({
            'photoUrl': photoUrl,
          });
          
          print('✅ ProfileRemoteDataSource: Photo uploaded successfully');
          return photoUploadModel;
        } else {
          throw ServerException(
            message: 'Invalid response: missing photoUrl',
            statusCode: response.statusCode,
          );
        }
      } else {
        throw ServerException(
          message: 'Upload failed: ${response.statusCode}',
          statusCode: response.statusCode,
        );
      }
    } on DioException catch (e) {
      print('❌ ProfileRemoteDataSource: Photo upload DioException: ${e.message}');
      print('❌ Error response: ${e.response?.data}');
      
      // Enhanced error handling for photo upload
      if (e.response?.statusCode == 400) {
        final responseData = e.response?.data;
        if (responseData is Map<String, dynamic>) {
          final errorMessage = responseData['message'] ?? responseData['error'] ?? 'Invalid file format';
          throw FileException(
            message: errorMessage,
            statusCode: e.response?.statusCode,
          );
        } else {
          throw FileException(
            message: 'Invalid file format or file too large',
            statusCode: e.response?.statusCode,
          );
        }
      } else if (e.response?.statusCode == 401) {
        throw AuthException(
          message: 'Authentication failed - please login again',
          statusCode: e.response?.statusCode,
        );
      } else if (e.response?.statusCode == 413) {
        throw FileException(
          message: 'File too large - maximum size is 10MB',
          statusCode: e.response?.statusCode,
        );
      } else if (e.response?.statusCode == 415) {
        throw FileException(
          message: 'Unsupported file type - please use JPG, PNG, or WebP',
          statusCode: e.response?.statusCode,
        );
      } else {
        throw ServerException(
          message: 'Upload failed: ${e.message}',
          statusCode: e.response?.statusCode,
        );
      }
    } catch (e) {
      print('❌ ProfileRemoteDataSource: Photo upload general exception: $e');
      
      // Handle file system errors
      if (e.toString().contains('file') || e.toString().contains('path')) {
        throw FileException(message: 'File access error: $e');
      } else {
        throw ServerException(message: 'Upload failed: $e');
      }
    }
  }
}