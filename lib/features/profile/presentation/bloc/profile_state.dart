import 'package:equatable/equatable.dart';
import '../../domain/entities/profile_entity.dart';

abstract class ProfileState extends Equatable {
  const ProfileState();

  @override
  List<Object?> get props => [];
}

class ProfileInitial extends ProfileState {
  const ProfileInitial();
}

class ProfileLoading extends ProfileState {
  const ProfileLoading();
}

class ProfileLoaded extends ProfileState {
  final ProfileEntity profile;

  const ProfileLoaded({required this.profile});

  @override
  List<Object> get props => [profile];
}

class ProfileRefreshing extends ProfileState {
  final ProfileEntity profile; // Keep current profile while refreshing

  const ProfileRefreshing({required this.profile});

  @override
  List<Object> get props => [profile];
}

class ProfileUpdating extends ProfileState {
  final ProfileEntity profile; // Keep current profile while updating

  const ProfileUpdating({required this.profile});

  @override
  List<Object> get props => [profile];
}

class ProfilePhotoUploading extends ProfileState {
  final ProfileEntity profile; // Keep current profile while uploading
  final double? progress; // Upload progress (0.0 - 1.0)

  const ProfilePhotoUploading({
    required this.profile,
    this.progress,
  });

  @override
  List<Object?> get props => [profile, progress];
}

class ProfilePhotoUploaded extends ProfileState {
  final ProfileEntity profile; // Profile with new photo
  final String message;

  const ProfilePhotoUploaded({
    required this.profile,
    this.message = 'Photo uploaded successfully',
  });

  @override
  List<Object> get props => [profile, message];
}

// ✅ ENHANCED ERROR STATES
class ProfileError extends ProfileState {
  final String message;
  final ProfileEntity? profile; // Keep current profile if available
  final ProfileErrorType errorType;
  final Map<String, List<String>>? validationErrors; // For validation failures
  final bool canRetry;

  const ProfileError({
    required this.message,
    this.profile,
    this.errorType = ProfileErrorType.general,
    this.validationErrors,
    this.canRetry = true,
  });

  @override
  List<Object?> get props => [message, profile, errorType, validationErrors, canRetry];
}

// ✅ AUTHENTICATION ERROR STATE
class ProfileAuthError extends ProfileState {
  final String message;
  final ProfileEntity? profile;

  const ProfileAuthError({
    required this.message,
    this.profile,
  });

  @override
  List<Object?> get props => [message, profile];
}

// ✅ FILE ERROR STATE
class ProfileFileError extends ProfileState {
  final String message;
  final ProfileEntity profile;
  final FileErrorType fileErrorType;

  const ProfileFileError({
    required this.message,
    required this.profile,
    this.fileErrorType = FileErrorType.general,
  });

  @override
  List<Object> get props => [message, profile, fileErrorType];
}

class ProfileLoggedOut extends ProfileState {
  const ProfileLoggedOut();
}

// ✅ ERROR TYPE ENUMS
enum ProfileErrorType {
  general,
  network,
  server,
  cache,
  validation,
  authentication,
  file,
}

enum FileErrorType {
  general,
  tooLarge,
  invalidFormat,
  notFound,
  permissionDenied,
}
