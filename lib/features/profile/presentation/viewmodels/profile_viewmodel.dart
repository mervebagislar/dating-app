// lib/features/profile/presentation/viewmodels/profile_viewmodel.dart
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dating_app/core/utils/logger.dart';
import '../../domain/entities/profile_entity.dart';
import '../../domain/repositories/profile_repository.dart';

// ✅ MVVM: ViewModel for Profile feature
class ProfileViewModel extends ChangeNotifier {
  final ProfileRepository _profileRepository;

  ProfileViewModel(this._profileRepository);

  // ✅ State variables
  bool _isLoading = false;
  bool _isUpdating = false;
  bool _isUploadingPhoto = false;
  String? _errorMessage;

  // ✅ Data
  ProfileEntity? _profile;
  List<dynamic> _favoriteMovies = []; // Using dynamic for now

  // ✅ Getters
  bool get isLoading => _isLoading;
  bool get isUpdating => _isUpdating;
  bool get isUploadingPhoto => _isUploadingPhoto;
  String? get errorMessage => _errorMessage;
  ProfileEntity? get profile => _profile;
  List<dynamic> get favoriteMovies => _favoriteMovies;

  // ✅ Load profile
  Future<void> loadProfile() async {
    try {
      _setLoading(true);
      _clearError();

      AppLogger.i('[ProfileViewModel] Loading profile');

      final result = await _profileRepository.getProfile();

      result.fold(
        (failure) => _handleFailure(failure),
        (profile) => _handleProfileLoaded(profile),
      );
    } catch (e) {
      AppLogger.e('[ProfileViewModel] Load profile error: $e');
      _setError('Profil yüklenirken hata oluştu: $e');
    } finally {
      _setLoading(false);
    }
  }

  // ✅ Update profile
  Future<bool> updateProfile({String? name, String? email}) async {
    try {
      _setUpdating(true);
      _clearError();

      AppLogger.i('[ProfileViewModel] Updating profile');

      // Create update data
      final updateData = <String, dynamic>{};
      if (name != null) updateData['name'] = name;
      if (email != null) updateData['email'] = email;

      if (updateData.isEmpty) {
        AppLogger.w('[ProfileViewModel] No update data provided');
        return false;
      }

      // Create ProfileEntity from update data
      final updatedProfile = ProfileEntity(
        id: _profile?.id ?? '',
        name: name ?? _profile?.name ?? '',
        email: email ?? _profile?.email ?? '',
        photoUrl: _profile?.photoUrl,
      );

      final result = await _profileRepository.updateProfile(updatedProfile);

      return result.fold(
        (failure) {
          _handleFailure(failure);
          return false;
        },
        (updatedProfile) {
          _handleProfileUpdated(updatedProfile);
          return true;
        },
      );
    } catch (e) {
      AppLogger.e('[ProfileViewModel] Update profile error: $e');
      _setError('Profil güncellenirken hata oluştu: $e');
      return false;
    } finally {
      _setUpdating(false);
    }
  }

  // ✅ Upload profile photo
  Future<bool> uploadProfilePhoto(File photo) async {
    try {
      _setUploadingPhoto(true);
      _clearError();

      AppLogger.i('[ProfileViewModel] Uploading profile photo');

      final result = await _profileRepository.uploadPhoto(photo);

      return result.fold(
        (failure) {
          _handleFailure(failure);
          return false;
        },
        (photoUpload) {
          _handlePhotoUploaded(photoUpload.photoUrl);
          return true;
        },
      );
    } catch (e) {
      AppLogger.e('[ProfileViewModel] Upload photo error: $e');
      _setError('Fotoğraf yüklenirken hata oluştu: $e');
      return false;
    } finally {
      _setUploadingPhoto(false);
    }
  }

  // ✅ Load favorite movies
  Future<void> loadFavoriteMovies() async {
    try {
      _setLoading(true);
      _clearError();

      AppLogger.i('[ProfileViewModel] Loading favorite movies');

      // This would typically come from a separate repository
      // For now, we'll simulate it
      await Future.delayed(const Duration(milliseconds: 500));

      // Simulate loading favorite movies
      _favoriteMovies = [
        {'id': '1', 'title': 'Sample Movie 1', 'year': '2023'},
        {'id': '2', 'title': 'Sample Movie 2', 'year': '2022'},
      ];

      AppLogger.s(
        '[ProfileViewModel] Favorite movies loaded: ${_favoriteMovies.length} movies',
      );
      notifyListeners();
    } catch (e) {
      AppLogger.e('[ProfileViewModel] Load favorite movies error: $e');
      _setError('Favori filmler yüklenirken hata oluştu: $e');
    } finally {
      _setLoading(false);
    }
  }

  // ✅ Refresh profile
  Future<void> refreshProfile() async {
    await loadProfile();
    await loadFavoriteMovies();
  }

  // ✅ Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setUpdating(bool updating) {
    _isUpdating = updating;
    notifyListeners();
  }

  void _setUploadingPhoto(bool uploading) {
    _isUploadingPhoto = uploading;
    notifyListeners();
  }

  void _setError(String message) {
    _errorMessage = message;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  void _handleFailure(Failure failure) {
    _setError(failure.message);
    AppLogger.e('[ProfileViewModel] Failure: ${failure.message}');
  }

  void _handleProfileLoaded(ProfileEntity profile) {
    _profile = profile;
    _clearError();
    AppLogger.s('[ProfileViewModel] Profile loaded: ${profile.name}');
    notifyListeners();
  }

  void _handleProfileUpdated(ProfileEntity updatedProfile) {
    _profile = updatedProfile;
    _clearError();
    AppLogger.s('[ProfileViewModel] Profile updated: ${updatedProfile.name}');
    notifyListeners();
  }

  void _handlePhotoUploaded(String photoUrl) {
    if (_profile != null) {
      // Update profile with new photo URL
      // This would require ProfileEntity to have a copyWith method
      _clearError();
      AppLogger.s('[ProfileViewModel] Photo uploaded successfully');
      notifyListeners();
    }
  }

  // ✅ Check if profile has photo
  bool get hasProfilePhoto {
    return _profile?.photoUrl != null && _profile!.photoUrl!.isNotEmpty;
  }

  // ✅ Get profile initials
  String get profileInitials {
    if (_profile?.name == null || _profile!.name.isEmpty) return 'U';

    final parts =
        _profile!.name.split(' ').where((part) => part.isNotEmpty).toList();
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else if (parts.isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return 'U';
  }

  // ✅ Dispose method
  @override
  void dispose() {
    AppLogger.i('[ProfileViewModel] Disposed');
    super.dispose();
  }
}
