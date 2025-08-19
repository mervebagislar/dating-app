// lib/features/auth/data/repositories/auth_repository_impl.dart
import 'dart:io';
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/constants/api_constants.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/utils/logger.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/auth_models.dart';
import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, UserEntity>> login({
    required String email,
    required String password,
  }) async {
    try {
      final isConnected = await networkInfo.isConnected;
      if (!isConnected) {
        AppLogger.w('No network connection for login');
        return const Left(NetworkFailure(message: 'İnternet bağlantısı bulunamadı'));
      }

      AppLogger.i('[Auth] LOGIN_ATTEMPT for: $email');
      final request = LoginRequestModel(email: email, password: password);
      final response = await remoteDataSource.login(request);

      if (response.token != null && response.user != null) {
        await Future.wait([
          localDataSource.saveToken(response.token!),
          localDataSource.cacheUser(response.user!),
        ]);
        AppLogger.i('[Auth] LOGIN_SUCCESS for: $email');
        return Right(response.user!.toEntity());
      } else {
        AppLogger.e('[Auth] LOGIN_FAILED for: $email');
        return Left(ServerFailure(
          message: response.message ?? 'Giriş başarısız',
          statusCode: 400,
        ));
      }
    } on ServerException catch (e) {
      AppLogger.e('[Auth] Server exception during login: $e');
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on NetworkException catch (e) {
      AppLogger.e('[Auth] Network exception during login: $e');
      return Left(NetworkFailure(message: e.message));
    } on CacheException catch (e) {
      AppLogger.e('[Auth] Cache exception during login: $e');
      return Left(CacheFailure(message: e.message));
    } catch (e) {
      AppLogger.e('[Auth] Unexpected error during login: $e');
      return Left(ServerFailure(message: 'Bilinmeyen hata oluştu: $e', statusCode: 500));
    }
  }

  @override
  Future<Either<Failure, UserEntity>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final isConnected = await networkInfo.isConnected;
      if (!isConnected) {
        AppLogger.w('No network connection for register');
        return const Left(NetworkFailure(message: 'İnternet bağlantısı bulunamadı'));
      }

      AppLogger.i('[Auth] REGISTER_ATTEMPT for: $email');
      final request = RegisterRequestModel(name: name, email: email, password: password);
      final response = await remoteDataSource.register(request);

      if (response.token != null && response.user != null) {
        await Future.wait([
          localDataSource.saveToken(response.token!),
          localDataSource.cacheUser(response.user!),
        ]);
        AppLogger.i('[Auth] REGISTER_SUCCESS for: $email');
        return Right(response.user!.toEntity());
      } else {
        AppLogger.e('[Auth] REGISTER_FAILED for: $email');
        return Left(ServerFailure(
          message: response.message ?? 'Kayıt başarısız',
          statusCode: 400,
        ));
      }
    } on ServerException catch (e) {
      AppLogger.e('[Auth] Server exception during register: $e');
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on NetworkException catch (e) {
      AppLogger.e('[Auth] Network exception during register: $e');
      return Left(NetworkFailure(message: e.message));
    } on CacheException catch (e) {
      AppLogger.e('[Auth] Cache exception during register: $e');
      return Left(CacheFailure(message: e.message));
    } catch (e) {
      AppLogger.e('[Auth] Unexpected error during register: $e');
      return Left(ServerFailure(message: 'Bilinmeyen hata oluştu: $e', statusCode: 500));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      AppLogger.i('[Auth] LOGOUT_ATTEMPT');

      // Remote logout (try-catch to avoid crash if endpoint missing)
      try {
        await remoteDataSource.logout();
      } on ServerException catch (e) {
        AppLogger.w('Remote logout failed (ServerException): $e');
      } on NetworkException catch (e) {
        AppLogger.w('Remote logout failed (NetworkException): $e');
      } catch (e) {
        AppLogger.w('Remote logout failed: $e');
      }

      await localDataSource.clearAllAuthData();
      AppLogger.i('[Auth] LOGOUT_SUCCESS');
      return const Right(null);
    } catch (e) {
      AppLogger.e('[Auth] Error during logout: $e');
      return Left(CacheFailure(message: 'Çıkış yapılırken hata oluştu: $e'));
    }
  }

  @override
  Future<Either<Failure, UserEntity>> getCurrentUser() async {
    try {
      final cachedUser = await localDataSource.getCachedUser();
      if (cachedUser != null) {
        AppLogger.d('[Auth] Current user retrieved from cache: ${cachedUser.name}');
        return Right(cachedUser.toEntity());
      }

      final isConnected = await networkInfo.isConnected;
      if (!isConnected) {
        return const Left(NetworkFailure(message: 'Kullanıcı bilgisi bulunamadı'));
      }

      final remoteUser = await remoteDataSource.getCurrentUser();
      await localDataSource.cacheUser(remoteUser);
      AppLogger.d('[Auth] Current user fetched from API: ${remoteUser.name}');
      return Right(remoteUser.toEntity());
    } on ServerException catch (e) {
      AppLogger.e('[Auth] Server exception getting current user: $e');
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on NetworkException catch (e) {
      AppLogger.e('[Auth] Network exception getting current user: $e');
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      AppLogger.e('[Auth] Error getting current user: $e');
      return Left(CacheFailure(message: 'Kullanıcı bilgisi alınamadı: $e'));
    }
  }

  @override
  Future<Either<Failure, String>> uploadProfilePhoto(File photo) async {
    try {
      final isConnected = await networkInfo.isConnected;
      if (!isConnected) {
        return const Left(NetworkFailure(message: 'İnternet bağlantısı bulunamadı'));
      }

      AppLogger.i('[Auth] UPLOAD_PROFILE_PHOTO: ${photo.path}');

      final formData = FormData.fromMap({
        'photo': await MultipartFile.fromFile(
          photo.path,
          filename: photo.path.split('/').last,
        ),
      });

      final response = await DioClient.uploadFile(
        ApiConstants.uploadPhotoEndpoint,
        formData: formData,
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data['data'];
        final photoUrl = data['photoUrl'] as String?;
        if (photoUrl != null) {
          await localDataSource.updateCachedUserPhoto(photoUrl);
          AppLogger.i('[Auth] UPLOAD_PROFILE_PHOTO SUCCESS');
          return Right(photoUrl);
        }
      }

      AppLogger.e('[Auth] UPLOAD_PROFILE_PHOTO FAILED');
      return const Left(ServerFailure(message: 'Fotoğraf yüklenemedi'));
    } on ServerException catch (e) {
      AppLogger.e('[Auth] Server exception during photo upload: $e');
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      AppLogger.e('[Auth] Error uploading photo: $e');
      return Left(ServerFailure(message: 'Fotoğraf yüklenirken hata oluştu: $e'));
    }
  }

  @override
  Future<Either<Failure, bool>> isAuthenticated() async {
    try {
      final authenticated = await localDataSource.isAuthenticated();
      if (authenticated) {
        final validToken = await localDataSource.validateStoredToken();
        if (!validToken) return const Right(false);
      }
      return Right(authenticated);
    } catch (e) {
      AppLogger.e('[Auth] Error checking authentication: $e');
      return const Right(false);
    }
  }

  @override
  Future<Either<Failure, String?>> getAuthToken() async {
    try {
      final token = await localDataSource.getToken();
      return Right(token);
    } catch (e) {
      AppLogger.e('[Auth] Error getting auth token: $e');
      return Left(CacheFailure(message: 'Token alınamadı: $e'));
    }
  }

  @override
  Future<Either<Failure, void>> clearAuthData() async {
    try {
      await localDataSource.clearAllAuthData();
      return const Right(null);
    } catch (e) {
      AppLogger.e('[Auth] Error clearing auth data: $e');
      return Left(CacheFailure(message: 'Auth verileri temizlenemedi: $e'));
    }
  }

  @override
  Future<Either<Failure, bool>> validateToken() async {
    try {
      final isValid = await localDataSource.validateStoredToken();
      return Right(isValid);
    } catch (e) {
      AppLogger.e('[Auth] Error validating token: $e');
      return const Right(false);
    }
  }

  @override
  Future<Either<Failure, bool>> checkEmailExists(String email) async {
    try {
      // Placeholder: true/false based on API when available
      return const Right(false);
    } catch (e) {
      AppLogger.e('[Auth] Error checking email exists: $e');
      return Left(ServerFailure(message: 'E-posta kontrolü yapılamadı: $e'));
    }
  }

  @override
  Future<Either<Failure, UserEntity>> refreshUserProfile() async {
    try {
      final isConnected = await networkInfo.isConnected;
      if (!isConnected) {
        return const Left(NetworkFailure(message: 'İnternet bağlantısı bulunamadı'));
      }

      final remoteUser = await remoteDataSource.getCurrentUser();
      await localDataSource.cacheUser(remoteUser);
      AppLogger.d('[Auth] User profile refreshed: ${remoteUser.name}');
      return Right(remoteUser.toEntity());
    } catch (e) {
      AppLogger.e('[Auth] Error refreshing user profile: $e');
      return Left(ServerFailure(message: 'Profil yenilenemedi: $e'));
    }
  }
}
