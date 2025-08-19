// lib/features/auth/presentation/viewmodels/auth_viewmodel.dart
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dating_app/core/utils/logger.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';

// ✅ MVVM: ViewModel for Auth feature
class AuthViewModel extends ChangeNotifier {
  final AuthRepository _authRepository;

  AuthViewModel(this._authRepository);

  // ✅ State variables
  bool _isLoading = false;
  bool _isAuthenticated = false;
  UserEntity? _currentUser;
  String? _errorMessage;
  bool _isLoginLoading = false;
  bool _isRegisterLoading = false;

  // ✅ Getters
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  UserEntity? get currentUser => _currentUser;
  String? get errorMessage => _errorMessage;
  bool get isLoginLoading => _isLoginLoading;
  bool get isRegisterLoading => _isRegisterLoading;

  // ✅ Login method
  Future<bool> login(String email, String password) async {
    try {
      _setLoginLoading(true);
      _clearError();

      AppLogger.i('[AuthViewModel] Login attempt for: $email');

      final result = await _authRepository.login(
        email: email,
        password: password,
      );

      return result.fold(
        (failure) {
          _handleFailure(failure);
          return false;
        },
        (user) {
          _handleLoginSuccess(user);
          return true;
        },
      );
    } catch (e) {
      AppLogger.e('[AuthViewModel] Login error: $e');
      _setError('Beklenmeyen hata oluştu: $e');
      return false;
    } finally {
      _setLoginLoading(false);
    }
  }

  // ✅ Register method
  Future<bool> register(String name, String email, String password) async {
    try {
      _setRegisterLoading(true);
      _clearError();

      AppLogger.i('[AuthViewModel] Register attempt for: $email');

      final result = await _authRepository.register(
        name: name,
        email: email,
        password: password,
      );

      return result.fold(
        (failure) {
          _handleFailure(failure);
          return false;
        },
        (user) {
          _handleLoginSuccess(user);
          return true;
        },
      );
    } catch (e) {
      AppLogger.e('[AuthViewModel] Register error: $e');
      _setError('Beklenmeyen hata oluştu: $e');
      return false;
    } finally {
      _setRegisterLoading(false);
    }
  }

  // ✅ Logout method
  Future<void> logout() async {
    try {
      _setLoading(true);

      AppLogger.i('[AuthViewModel] Logout attempt');

      final result = await _authRepository.logout();

      result.fold(
        (failure) => _handleFailure(failure),
        (_) => _handleLogoutSuccess(),
      );
    } catch (e) {
      AppLogger.e('[AuthViewModel] Logout error: $e');
      _setError('Çıkış yapılırken hata oluştu: $e');
    } finally {
      _setLoading(false);
    }
  }

  // ✅ Check authentication status
  Future<void> checkAuthStatus() async {
    try {
      _setLoading(true);

      AppLogger.i('[AuthViewModel] Checking auth status');

      final result = await _authRepository.isAuthenticated();

      result.fold((failure) => _handleFailure(failure), (isAuth) {
        if (isAuth) {
          _loadCurrentUser();
        } else {
          _handleNotAuthenticated();
        }
      });
    } catch (e) {
      AppLogger.e('[AuthViewModel] Check auth error: $e');
      _setError('Kimlik doğrulama kontrolünde hata: $e');
    } finally {
      _setLoading(false);
    }
  }

  // ✅ Load current user
  Future<void> _loadCurrentUser() async {
    try {
      final result = await _authRepository.getCurrentUser();

      result.fold(
        (failure) => _handleFailure(failure),
        (user) => _handleUserLoaded(user),
      );
    } catch (e) {
      AppLogger.e('[AuthViewModel] Load user error: $e');
      _setError('Kullanıcı bilgileri yüklenemedi: $e');
    }
  }

  // ✅ Upload profile photo
  Future<bool> uploadProfilePhoto(File photo) async {
    try {
      _setLoading(true);
      _clearError();

      AppLogger.i('[AuthViewModel] Uploading profile photo');

      final result = await _authRepository.uploadProfilePhoto(photo);

      return result.fold(
        (failure) {
          _handleFailure(failure);
          return false;
        },
        (photoUrl) {
          _handlePhotoUploadSuccess(photoUrl);
          return true;
        },
      );
    } catch (e) {
      AppLogger.e('[AuthViewModel] Photo upload error: $e');
      _setError('Fotoğraf yüklenirken hata oluştu: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // ✅ Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setLoginLoading(bool loading) {
    _isLoginLoading = loading;
    notifyListeners();
  }

  void _setRegisterLoading(bool loading) {
    _isRegisterLoading = loading;
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
    AppLogger.e('[AuthViewModel] Failure: ${failure.message}');
  }

  void _handleLoginSuccess(UserEntity user) {
    _currentUser = user;
    _isAuthenticated = true;
    _clearError();
    AppLogger.s('[AuthViewModel] Login success: ${user.name}');
    notifyListeners();
  }

  void _handleUserLoaded(UserEntity user) {
    _currentUser = user;
    _isAuthenticated = true;
    _clearError();
    AppLogger.s('[AuthViewModel] User loaded: ${user.name}');
    notifyListeners();
  }

  void _handleLogoutSuccess() {
    _currentUser = null;
    _isAuthenticated = false;
    _clearError();
    AppLogger.s('[AuthViewModel] Logout success');
    notifyListeners();
  }

  void _handleNotAuthenticated() {
    _currentUser = null;
    _isAuthenticated = false;
    _clearError();
    AppLogger.i('[AuthViewModel] User not authenticated');
    notifyListeners();
  }

  void _handlePhotoUploadSuccess(String photoUrl) {
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(photoUrl: photoUrl);
      _clearError();
      AppLogger.s('[AuthViewModel] Photo upload success');
      notifyListeners();
    }
  }

  // ✅ Copy with method for UserEntity (if not exists)
  UserEntity _copyUserWithPhoto(UserEntity user, String photoUrl) {
    return UserEntity(
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    );
  }

  // ✅ Dispose method
  @override
  void dispose() {
    AppLogger.i('[AuthViewModel] Disposed');
    super.dispose();
  }
}
