import 'dart:async';
import 'package:dating_app/core/usecases/usecases.dart';
import '../../domain/usecases/logout_usecase.dart';
import 'package:dating_app/features/profile/domain/entities/profile_entity.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/errors/failures.dart';

import '../../domain/usecases/get_profile_usecase.dart';
import '../../domain/usecases/update_profile_usecase.dart';
import '../../domain/usecases/upload_photo_usecase.dart';

import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final GetProfileUseCase getProfileUseCase;
  final UpdateProfileUseCase updateProfileUseCase;
  final UploadPhotoUseCase uploadPhotoUseCase;
  final ProfileLogoutUseCase logoutUseCase;

  ProfileBloc({
    required this.getProfileUseCase,
    required this.updateProfileUseCase,
    required this.uploadPhotoUseCase,
    required this.logoutUseCase,
  }) : super(const ProfileInitial()) {
    on<LoadProfileEvent>(_onLoadProfile);
    on<RefreshProfileEvent>(_onRefreshProfile);
    on<UpdateProfileEvent>(_onUpdateProfile);
    on<UploadPhotoEvent>(_onUploadPhoto);
    on<LogoutEvent>(_onLogout);
  }

  // ------------------ EVENTS ------------------
  Future<void> _onLoadProfile(
    LoadProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(const ProfileLoading());

    final result = await getProfileUseCase(const NoParams());

    result.fold(
      (failure) => emit(_mapFailureToErrorState(failure)),
      (profile) => emit(ProfileLoaded(profile: profile)),
    );
  }

  Future<void> _onRefreshProfile(
    RefreshProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    if (state is ProfileLoaded) {
      final currentProfile = (state as ProfileLoaded).profile;
      emit(ProfileRefreshing(profile: currentProfile));
    } else {
      emit(const ProfileLoading());
    }

    final result = await getProfileUseCase(const NoParams());

    result.fold((failure) {
      if (state is ProfileRefreshing) {
        final currentProfile = (state as ProfileRefreshing).profile;
        emit(_mapFailureToErrorState(failure, currentProfile));
      } else {
        emit(_mapFailureToErrorState(failure));
      }
    }, (profile) => emit(ProfileLoaded(profile: profile)));
  }

  Future<void> _onUpdateProfile(
    UpdateProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    if (state is ProfileLoaded) {
      final currentProfile = (state as ProfileLoaded).profile;
      emit(ProfileUpdating(profile: currentProfile));
    }

    final result = await updateProfileUseCase(
      UpdateProfileParams(profile: event.profile),
    );

    result.fold((failure) {
      if (state is ProfileUpdating) {
        final previousProfile = (state as ProfileUpdating).profile;
        emit(_mapFailureToErrorState(failure, previousProfile));
      } else {
        emit(_mapFailureToErrorState(failure));
      }
    }, (updatedProfile) => emit(ProfileLoaded(profile: updatedProfile)));
  }

  Future<void> _onUploadPhoto(
    UploadPhotoEvent event,
    Emitter<ProfileState> emit,
  ) async {
    if (state is ProfileLoaded) {
      final currentProfile = (state as ProfileLoaded).profile;
      emit(ProfilePhotoUploading(profile: currentProfile));
    }

    final result = await uploadPhotoUseCase(
      UploadPhotoParams(imageFile: event.imageFile),
    );

    result.fold(
      (failure) {
        if (state is ProfilePhotoUploading) {
          final previousProfile = (state as ProfilePhotoUploading).profile;
          if (failure is FileFailure) {
            final fileErrorType = _getFileErrorType(failure.message);
            emit(
              ProfileFileError(
                message: failure.message,
                profile: previousProfile,
                fileErrorType: fileErrorType,
              ),
            );
          } else {
            emit(_mapFailureToErrorState(failure, previousProfile));
          }
        } else {
          emit(_mapFailureToErrorState(failure));
        }
      },
      (photoUpload) {
        if (state is ProfilePhotoUploading) {
          final currentProfile = (state as ProfilePhotoUploading).profile;
          final updatedProfile = currentProfile.copyWith(
            photoUrl: photoUpload.photoUrl,
          );
          emit(
            ProfilePhotoUploaded(
              profile: updatedProfile,
              message: 'Photo uploaded successfully!',
            ),
          );

          // Küçük gecikmeden sonra normal state'e dön
          Timer(const Duration(seconds: 2), () {
            if (state is ProfilePhotoUploaded) {
              emit(ProfileLoaded(profile: updatedProfile));
            }
          });
        }
      },
    );
  }

  Future<void> _onLogout(LogoutEvent event, Emitter<ProfileState> emit) async {
    final result = await getProfileUseCase(const NoParams());

    result.fold(
      (failure) => emit(_mapFailureToErrorState(failure)),
      (_) => emit(const ProfileLoggedOut()),
    );
  }

  // ------------------ HELPER METHODS ------------------
  ProfileState _mapFailureToErrorState(
    Failure failure, [
    ProfileEntity? profile,
  ]) {
    if (failure is AuthFailure) {
      return ProfileAuthError(message: failure.message, profile: profile);
    } else if (failure is ValidationFailure) {
      return ProfileError(
        message: failure.message,
        profile: profile,
        errorType: ProfileErrorType.validation,
        validationErrors: failure.errors,
        canRetry: false,
      );
    } else if (failure is NetworkFailure) {
      return ProfileError(
        message: failure.message,
        profile: profile,
        errorType: ProfileErrorType.network,
        canRetry: true,
      );
    } else if (failure is ServerFailure) {
      return ProfileError(
        message: failure.message,
        profile: profile,
        errorType: ProfileErrorType.server,
        canRetry: true,
      );
    } else if (failure is CacheFailure) {
      return ProfileError(
        message: failure.message,
        profile: profile,
        errorType: ProfileErrorType.cache,
        canRetry: true,
      );
    } else {
      return ProfileError(
        message: failure.message,
        profile: profile,
        errorType: ProfileErrorType.general,
        canRetry: true,
      );
    }
  }

  FileErrorType _getFileErrorType(String errorMessage) {
    final message = errorMessage.toLowerCase();
    if (message.contains('too large') || message.contains('size')) {
      return FileErrorType.tooLarge;
    } else if (message.contains('format') ||
        message.contains('type') ||
        message.contains('extension')) {
      return FileErrorType.invalidFormat;
    } else if (message.contains('not found') || message.contains('exist')) {
      return FileErrorType.notFound;
    } else if (message.contains('permission') || message.contains('access')) {
      return FileErrorType.permissionDenied;
    } else {
      return FileErrorType.general;
    }
  }

  // ------------------ GETTERS ------------------
  ProfileEntity? get currentProfile {
    final currentState = state;
    if (currentState is ProfileLoaded) return currentState.profile;
    if (currentState is ProfileRefreshing) return currentState.profile;
    if (currentState is ProfileUpdating) return currentState.profile;
    if (currentState is ProfilePhotoUploading) return currentState.profile;
    if (currentState is ProfilePhotoUploaded) return currentState.profile;
    if (currentState is ProfileError) return currentState.profile;
    if (currentState is ProfileAuthError) return currentState.profile;
    if (currentState is ProfileFileError) return currentState.profile;
    return null;
  }
}
