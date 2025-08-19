// lib/features/profile/data/repositories/profile_repository_impl_improved.dart
import 'dart:io';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/profile_entity.dart';
import '../../domain/repositories/profile_repository.dart';
import '../datasources/profile_remote_datasource.dart';
import '../datasources/profile_local_datasource.dart';
import '../models/profile_model.dart';

class ImprovedProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource remoteDataSource;
  final ProfileLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  ImprovedProfileRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, ProfileEntity>> getProfile() async {
    return _handleNetworkOperation(
      operation: () async {
        final remoteProfile = await remoteDataSource.getProfile();
        await localDataSource.cacheProfile(remoteProfile);
        return remoteProfile;
      },
      fallback: () async {
        final cachedProfile = await localDataSource.getCachedProfile();
        if (cachedProfile != null) return cachedProfile;
        throw CacheException(message: 'No cached profile available');
      },
      errorContext: 'Profile fetch',
    );
  }

  @override
  Future<Either<Failure, ProfileEntity>> updateProfile(ProfileEntity profile) async {
    if (!await networkInfo.isConnected) {
      return Left(NetworkFailure(message: 'No internet connection'));
    }

    return _handleOperation(
      operation: () async {
        final profileModel = _entityToModel(profile);
        final updatedProfile = await remoteDataSource.updateProfile(profileModel);
        await localDataSource.cacheProfile(updatedProfile);
        return updatedProfile;
      },
      errorContext: 'Profile update',
    );
  }

  @override
  Future<Either<Failure, PhotoUploadEntity>> uploadPhoto(File imageFile) async {
    if (!await networkInfo.isConnected) {
      return Left(NetworkFailure(message: 'No internet connection'));
    }

    return _handleOperation(
      operation: () async {
        _validateFile(imageFile);
        return await remoteDataSource.uploadPhoto(imageFile);
      },
      errorContext: 'Photo upload',
    );
  }

  @override
  Future<Either<Failure, Unit>> logout() async {
    return _handleOperation(
      operation: () async {
        await localDataSource.clearCache();
        return unit;
      },
      errorContext: 'Logout',
    );
  }

  // ✅ HELPER METHODS - DRY Principle

  /// Handles operations with network connectivity check and fallback
  Future<Either<Failure, T>> _handleNetworkOperation<T>({
    required Future<T> Function() operation,
    required Future<T> Function() fallback,
    required String errorContext,
  }) async {
    try {
      if (await networkInfo.isConnected) {
        try {
          final result = await operation();
          print('✅ $errorContext: Success from remote');
          return Right(result);
        } catch (e) {
          print('⚠️ $errorContext: Remote failed, trying fallback');
          try {
            final fallbackResult = await fallback();
            return Right(fallbackResult);
          } catch (fallbackError) {
            return Left(_mapExceptionToFailure(e, errorContext));
          }
        }
      } else {
        print('📱 $errorContext: No network, using fallback');
        final fallbackResult = await fallback();
        return Right(fallbackResult);
      }
    } catch (e) {
      return Left(_mapExceptionToFailure(e, errorContext));
    }
  }

  /// Handles simple operations with standardized error mapping
  Future<Either<Failure, T>> _handleOperation<T>({
    required Future<T> Function() operation,
    required String errorContext,
  }) async {
    try {
      final result = await operation();
      print('✅ $errorContext: Success');
      return Right(result);
    } catch (e) {
      print('❌ $errorContext: Error - $e');
      return Left(_mapExceptionToFailure(e, errorContext));
    }
  }

  /// Maps exceptions to appropriate failures
  Failure _mapExceptionToFailure(dynamic exception, String context) {
    if (exception is ServerException) {
      return ServerFailure(message: exception.message, statusCode: exception.statusCode);
    } else if (exception is AuthException) {
      return AuthFailure(message: exception.message, statusCode: exception.statusCode);
    } else if (exception is ValidationException) {
      return ValidationFailure(
        message: exception.message,
        statusCode: exception.statusCode,
        errors: exception.errors,
      );
    } else if (exception is FileException) {
      return FileFailure(message: exception.message, statusCode: exception.statusCode);
    } else if (exception is CacheException) {
      return CacheFailure(message: exception.message, statusCode: exception.statusCode);
    } else {
      return ServerFailure(message: 'Unexpected error in $context: $exception');
    }
  }

  /// Converts entity to model
  ProfileModel _entityToModel(ProfileEntity entity) {
    return ProfileModel(
      id: entity.id,
      name: entity.name,
      email: entity.email,
      photoUrl: entity.photoUrl,
      createdAt: entity.createdAt,
      favoriteMoviesCount: entity.favoriteMoviesCount,
    );
  }

  /// Validates file before upload
  void _validateFile(File imageFile) {
    if (!imageFile.existsSync()) {
      throw FileException(message: 'File does not exist');
    }

    final fileSize = imageFile.lengthSync();
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileSize > maxSize) {
      throw FileException(message: 'File size too large (max 10MB)');
    }

    final fileName = imageFile.path.toLowerCase();
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    final hasValidExtension = supportedExtensions.any((ext) => fileName.endsWith('.$ext'));
    
    if (!hasValidExtension) {
      throw FileException(
        message: 'Unsupported file format. Please use: ${supportedExtensions.join(', ')}',
      );
    }
  }
}