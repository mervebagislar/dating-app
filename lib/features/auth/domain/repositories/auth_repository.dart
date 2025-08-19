// lib/features/auth/domain/repositories/auth_repository.dart
import 'dart:io';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/user_entity.dart';

abstract class AuthRepository {
  // ✅ Authentication methods
  Future<Either<Failure, UserEntity>> login({
    required String email,
    required String password,
  });
  
  Future<Either<Failure, UserEntity>> register({
    required String name,
    required String email,
    required String password,
  });
  
  Future<Either<Failure, void>> logout();
  
  // ✅ User profile methods
  Future<Either<Failure, UserEntity>> getCurrentUser();
  
  Future<Either<Failure, UserEntity>> refreshUserProfile();
  
  Future<Either<Failure, String>> uploadProfilePhoto(File photo);
  
  // ✅ Token management methods
  Future<Either<Failure, bool>> isAuthenticated();
  
  Future<Either<Failure, String?>> getAuthToken();
  
  Future<Either<Failure, void>> clearAuthData();
  
  // ✅ Validation methods
  Future<Either<Failure, bool>> validateToken();
  
  Future<Either<Failure, bool>> checkEmailExists(String email);
}