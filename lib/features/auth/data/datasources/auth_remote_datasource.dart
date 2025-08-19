// lib/features/auth/data/datasources/auth_remote_datasource.dart - IMPROVED ERROR HANDLING
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:dating_app/core/constants/api_constants.dart';
import 'package:dating_app/core/errors/exceptions.dart';
import 'package:dating_app/core/utils/logger.dart';
import 'package:dating_app/features/auth/data/models/user_model.dart';
import '../models/auth_models.dart';

abstract class AuthRemoteDataSource {
  Future<LoginResponseModel> login(LoginRequestModel request);
  Future<RegisterResponseModel> register(RegisterRequestModel request);
  Future<UserModel> getCurrentUser();
  Future<PhotoUploadResponseModel> uploadPhoto(File photo);
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio _dio;

  AuthRemoteDataSourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<LoginResponseModel> login(LoginRequestModel request) async {
    try {
      AppLogger.i('[Auth] Remote login attempt: ${request.email}');

      final response = await _dio.post(
        ApiConstants.loginEndpoint,
        data: {
          'email': request.email,
          'password': request.password,
        },
      );

      AppLogger.i('[Auth] Login response status: ${response.statusCode}');

      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data as Map<String, dynamic>;
        final userData = responseData.containsKey('data')
            ? responseData['data'] as Map<String, dynamic>
            : responseData;

        final token = userData['token'] as String?;

        if (token != null) {
          final userDataForModel = Map<String, dynamic>.from(userData);
          userDataForModel.remove('token');

          final user = UserModel.fromJson(userDataForModel);

          return LoginResponseModel(
            token: token,
            user: user,
            message: 'Giriş başarılı',
          );
        }
      }

      throw ServerException(message: 'Invalid login response format');
    } on DioException catch (e) {
      AppLogger.e('[Auth] Login Dio error: ${e.message}');
      final errorMessage = _extractErrorMessage(e, 'Giriş başarısız');
      throw ServerException(message: errorMessage, statusCode: e.response?.statusCode);
    } catch (e) {
      AppLogger.e('[Auth] Login error: $e');
      throw ServerException(message: 'Login failed: $e');
    }
  }

  @override
  Future<RegisterResponseModel> register(RegisterRequestModel request) async {
    try {
      AppLogger.i('[Auth] Remote register attempt: ${request.email}');

      final response = await _dio.post(
        ApiConstants.registerEndpoint,
        data: {
          'name': request.name,
          'email': request.email,
          'password': request.password,
        },
      );

      AppLogger.i('[Auth] Register response status: ${response.statusCode}');

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          response.data != null) {
        final responseData = response.data as Map<String, dynamic>;
        final userData = responseData.containsKey('data')
            ? responseData['data'] as Map<String, dynamic>
            : responseData;

        final token = userData['token'] as String?;

        if (token != null) {
          final userDataForModel = Map<String, dynamic>.from(userData);
          userDataForModel.remove('token');

          final user = UserModel.fromJson(userDataForModel);

          return RegisterResponseModel(
            token: token,
            user: user,
            message: 'Kayıt başarılı',
          );
        }
      }

      throw ServerException(message: 'Invalid register response format');
    } on DioException catch (e) {
      AppLogger.e('[Auth] Register Dio error: ${e.message}');
      final errorMessage = _extractErrorMessage(e, 'Kayıt başarısız');
      throw ServerException(message: errorMessage, statusCode: e.response?.statusCode);
    } catch (e) {
      AppLogger.e('[Auth] Register error: $e');
      throw ServerException(message: 'Registration failed: $e');
    }
  }

  @override
  Future<UserModel> getCurrentUser() async {
    try {
      AppLogger.i('[Auth] Fetching current user profile');

      final response = await _dio.get(ApiConstants.profileEndpoint);

      AppLogger.i('[Auth] Profile response status: ${response.statusCode}');

      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data as Map<String, dynamic>;
        final userData = responseData.containsKey('data') && responseData['data'] != null
            ? responseData['data'] as Map<String, dynamic>
            : responseData;

        final userModel = UserModel.fromJson(userData);
        AppLogger.i('[Auth] User profile loaded: ${userModel.name}');
        return userModel;
      } else {
        throw ServerException(
          message: 'Failed to get profile',
          statusCode: response.statusCode,
        );
      }
    } on DioException catch (e) {
      AppLogger.e('[Auth] Get profile Dio error: ${e.message}');
      final errorMessage = _extractErrorMessage(e, 'Profil yüklenemedi');
      throw ServerException(message: errorMessage, statusCode: e.response?.statusCode);
    } catch (e) {
      AppLogger.e('[Auth] Get profile error: $e');
      throw ServerException(message: 'Failed to get profile: $e');
    }
  }

  @override
  Future<PhotoUploadResponseModel> uploadPhoto(File photo) async {
    throw ServerException(message: 'Photo upload not implemented yet');
  }

  @override
  Future<void> logout() async {
    AppLogger.i('[Auth] Remote logout (no API call)');
    // Most APIs don't require remote logout
  }

  // ✅ IMPROVED: Extract detailed error message from API response
  String _extractErrorMessage(DioException error, String defaultMessage) {
    try {
      final statusCode = error.response?.statusCode;
      final responseData = error.response?.data;

      AppLogger.d('[Auth] Error response data: $responseData');

      // Common error messages based on status code
      switch (statusCode) {
        case 400:
          if (responseData is Map<String, dynamic>) {
            // Try different possible error message keys
            final errorMsg = responseData['message'] ?? 
                           responseData['error'] ?? 
                           responseData['details'] ?? 
                           responseData['msg'];
            
            if (errorMsg != null) {
              // ✅ Return user-friendly Turkish messages
              if (errorMsg.toString().toLowerCase().contains('already exists') || 
                  errorMsg.toString().toLowerCase().contains('duplicate') ||
                  errorMsg.toString().toLowerCase().contains('zaten')) {
                return 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapmayı deneyin.';
              }
              
              if (errorMsg.toString().toLowerCase().contains('invalid email')) {
                return 'Geçersiz e-posta adresi formatı.';
              }
              
              if (errorMsg.toString().toLowerCase().contains('password')) {
                return 'Şifre gereksinimleri karşılanmıyor.';
              }
              
              return errorMsg.toString();
            }
          }
          return 'Bu e-posta adresi zaten kayıtlı olabilir. Lütfen giriş yapmayı deneyin.';
          
        case 401:
          return 'E-posta veya şifre hatalı.';
          
        case 403:
          return 'Bu işlem için yetkiniz bulunmuyor.';
          
        case 404:
          return 'Kullanıcı bulunamadı.';
          
        case 422:
          return 'Girilen bilgiler geçersiz. Lütfen kontrol edin.';
          
        case 429:
          return 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.';
          
        case 500:
          return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          
        default:
          if (responseData is Map<String, dynamic>) {
            final errorMsg = responseData['message'] ?? responseData['error'];
            if (errorMsg != null) {
              return errorMsg.toString();
            }
          }
          return defaultMessage;
      }
    } catch (e) {
      AppLogger.w('[Auth] Error parsing error response: $e');
      return defaultMessage;
    }
  }
}