// lib/features/auth/presentation/bloc/auth_state.dart
import 'package:equatable/equatable.dart';
import '../../domain/entities/user_entity.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

// ✅ Initial State
class AuthInitial extends AuthState {
  const AuthInitial();
}

// ✅ Loading States
class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthLoginLoading extends AuthState {
  const AuthLoginLoading();
}

class AuthRegisterLoading extends AuthState {
  const AuthRegisterLoading();
}

class AuthLogoutLoading extends AuthState {
  const AuthLogoutLoading();
}

class AuthPhotoUploadLoading extends AuthState {
  final double? progress;

  const AuthPhotoUploadLoading({this.progress});

  @override
  List<Object?> get props => [progress];
}

// ✅ Success States
class AuthAuthenticated extends AuthState {
  final UserEntity user;

  const AuthAuthenticated({
    required this.user,
  });

  @override
  List<Object> get props => [user];
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class AuthLoginSuccess extends AuthState {
  final UserEntity user;

  const AuthLoginSuccess({
    required this.user,
  });

  @override
  List<Object> get props => [user];
}

class AuthRegisterSuccess extends AuthState {
  final UserEntity user;

  const AuthRegisterSuccess({
    required this.user,
  });

  @override
  List<Object> get props => [user];
}

class AuthLogoutSuccess extends AuthState {
  const AuthLogoutSuccess();
}

class AuthUserProfileLoaded extends AuthState {
  final UserEntity user;

  const AuthUserProfileLoaded({
    required this.user,
  });

  @override
  List<Object> get props => [user];
}

class AuthUserProfileRefreshed extends AuthState {
  final UserEntity user;

  const AuthUserProfileRefreshed({
    required this.user,
  });

  @override
  List<Object> get props => [user];
}

class AuthPhotoUploadSuccess extends AuthState {
  final String photoUrl;
  final UserEntity? updatedUser;

  const AuthPhotoUploadSuccess({
    required this.photoUrl,
    this.updatedUser,
  });

  @override
  List<Object?> get props => [photoUrl, updatedUser];
}

class AuthTokenValid extends AuthState {
  const AuthTokenValid();
}

class AuthTokenInvalid extends AuthState {
  const AuthTokenInvalid();
}

// ✅ Error States
class AuthError extends AuthState {
  final String message;
  final int? statusCode;

  const AuthError({
    required this.message,
    this.statusCode,
  });

  @override
  List<Object?> get props => [message, statusCode];
}

class AuthLoginError extends AuthState {
  final String message;
  final int? statusCode;

  const AuthLoginError({
    required this.message,
    this.statusCode,
  });

  @override
  List<Object?> get props => [message, statusCode];
}

class AuthRegisterError extends AuthState {
  final String message;
  final int? statusCode;
  final Map<String, List<String>>? validationErrors;

  const AuthRegisterError({
    required this.message,
    this.statusCode,
    this.validationErrors,
  });

  @override
  List<Object?> get props => [message, statusCode, validationErrors];
}

class AuthLogoutError extends AuthState {
  final String message;

  const AuthLogoutError({
    required this.message,
  });

  @override
  List<Object> get props => [message];
}

class AuthPhotoUploadError extends AuthState {
  final String message;

  const AuthPhotoUploadError({
    required this.message,
  });

  @override
  List<Object> get props => [message];
}

class AuthNetworkError extends AuthState {
  final String message;

  const AuthNetworkError({
    required this.message,
  });

  @override
  List<Object> get props => [message];
}

// ✅ Helper extensions for state checking
extension AuthStateExtensions on AuthState {
  bool get isLoading => this is AuthLoading || 
                       this is AuthLoginLoading || 
                       this is AuthRegisterLoading || 
                       this is AuthLogoutLoading ||
                       this is AuthPhotoUploadLoading;

  bool get isAuthenticated => this is AuthAuthenticated || 
                             this is AuthLoginSuccess || 
                             this is AuthRegisterSuccess ||
                             this is AuthUserProfileLoaded ||
                             this is AuthUserProfileRefreshed;

  bool get isUnauthenticated => this is AuthUnauthenticated || 
                               this is AuthLogoutSuccess;

  bool get hasError => this is AuthError || 
                      this is AuthLoginError || 
                      this is AuthRegisterError || 
                      this is AuthLogoutError ||
                      this is AuthPhotoUploadError ||
                      this is AuthNetworkError;

  UserEntity? get user {
    if (this is AuthAuthenticated) {
      return (this as AuthAuthenticated).user;
    } else if (this is AuthLoginSuccess) {
      return (this as AuthLoginSuccess).user;
    } else if (this is AuthRegisterSuccess) {
      return (this as AuthRegisterSuccess).user;
    } else if (this is AuthUserProfileLoaded) {
      return (this as AuthUserProfileLoaded).user;
    } else if (this is AuthUserProfileRefreshed) {
      return (this as AuthUserProfileRefreshed).user;
    }
    return null;
  }

  String? get errorMessage {
    if (this is AuthError) {
      return (this as AuthError).message;
    } else if (this is AuthLoginError) {
      return (this as AuthLoginError).message;
    } else if (this is AuthRegisterError) {
      return (this as AuthRegisterError).message;
    } else if (this is AuthLogoutError) {
      return (this as AuthLogoutError).message;
    } else if (this is AuthPhotoUploadError) {
      return (this as AuthPhotoUploadError).message;
    } else if (this is AuthNetworkError) {
      return (this as AuthNetworkError).message;
    }
    return null;
  }
}