// lib/features/auth/presentation/bloc/auth_bloc.dart
import 'dart:async';
import 'package:dating_app/features/auth/domain/entities/user_entity.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/utils/logger.dart';
import '../../domain/usecases/check_auth_usecase.dart';
import '../../domain/usecases/get_current_user_usecase.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/register_usecase.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final LogoutUseCase logoutUseCase;
  final CheckAuthUseCase checkAuthUseCase;
  final GetCurrentUserUseCase getCurrentUserUseCase;
  final AuthRepository authRepository;

  AuthBloc({
    required this.loginUseCase,
    required this.registerUseCase,
    required this.logoutUseCase,
    required this.checkAuthUseCase,
    required this.getCurrentUserUseCase,
    required this.authRepository,
  }) : super(const AuthInitial()) {
    
    // ✅ Register event handlers
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<AuthStatusRequested>(_onAuthStatusRequested);
    on<CurrentUserRequested>(_onCurrentUserRequested);
    on<UserProfileRefreshRequested>(_onUserProfileRefreshRequested);
    on<ProfilePhotoUploadRequested>(_onProfilePhotoUploadRequested);
    on<AuthDataClearRequested>(_onAuthDataClearRequested);
    on<TokenValidationRequested>(_onTokenValidationRequested);
    on<AuthStateReset>(_onAuthStateReset);

    // ✅ Auto-check authentication on bloc creation
    add(const AuthStatusRequested());
  }

  // ✅ Login Event Handler
  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'LoginRequested');
      emit(const AuthLoginLoading());

      final loginParams = LoginParams(
        email: event.email,
        password: event.password,
      );

      final result = await loginUseCase(loginParams);

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthLoginError: ${failure.message}');
          emit(AuthLoginError(
            message: failure.message,
            statusCode: failure.statusCode,
          ));
        },
        (user) {
          AppLogger.blocState('AuthBloc', 'AuthLoginSuccess: ${user.name}');
          emit(AuthLoginSuccess(user: user));
          // Automatically transition to authenticated state
          emit(AuthAuthenticated(user: user));
        },
      );
    } catch (e) {
      AppLogger.e('Login bloc error', error: e);
      emit(AuthLoginError(message: 'Beklenmeyen hata oluştu: $e'));
    }
  }

  // ✅ Register Event Handler
  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'RegisterRequested');
      emit(const AuthRegisterLoading());

      final registerParams = RegisterParams(
        name: event.name,
        email: event.email,
        password: event.password,
        confirmPassword: event.confirmPassword,
      );

      final result = await registerUseCase(registerParams);

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthRegisterError: ${failure.message}');
          emit(AuthRegisterError(
            message: failure.message,
            statusCode: failure.statusCode,
          ));
        },
        (user) {
          AppLogger.blocState('AuthBloc', 'AuthRegisterSuccess: ${user.name}');
          emit(AuthRegisterSuccess(user: user));
          // Automatically transition to authenticated state
          emit(AuthAuthenticated(user: user));
        },
      );
    } catch (e) {
      AppLogger.e('Register bloc error', error: e);
      emit(AuthRegisterError(message: 'Beklenmeyen hata oluştu: $e'));
    }
  }

  // ✅ Logout Event Handler
  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'LogoutRequested');
      emit(const AuthLogoutLoading());

      final result = await logoutUseCase();

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthLogoutError: ${failure.message}');
          emit(AuthLogoutError(message: failure.message));
        },
        (_) {
          AppLogger.blocState('AuthBloc', 'AuthLogoutSuccess');
          emit(const AuthLogoutSuccess());
          emit(const AuthUnauthenticated());
        },
      );
    } catch (e) {
      AppLogger.e('Logout bloc error', error: e);
      emit(AuthLogoutError(message: 'Çıkış yapılırken hata oluştu: $e'));
    }
  }

  // ✅ Auth Status Check Event Handler
  Future<void> _onAuthStatusRequested(
    AuthStatusRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'AuthStatusRequested');
      emit(const AuthLoading());

      final result = await checkAuthUseCase();

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthUnauthenticated: ${failure.message}');
          emit(const AuthUnauthenticated());
        },
        (isAuthenticated) {
          if (isAuthenticated) {
            // Get current user if authenticated
            add(const CurrentUserRequested());
          } else {
            AppLogger.blocState('AuthBloc', 'AuthUnauthenticated');
            emit(const AuthUnauthenticated());
          }
        },
      );
    } catch (e) {
      AppLogger.e('Auth status check error', error: e);
      emit(const AuthUnauthenticated());
    }
  }

  // ✅ Get Current User Event Handler
  Future<void> _onCurrentUserRequested(
    CurrentUserRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'CurrentUserRequested');

      final result = await getCurrentUserUseCase();

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthError: ${failure.message}');
          emit(AuthError(
            message: failure.message,
            statusCode: failure.statusCode,
          ));
        },
        (user) {
          AppLogger.blocState('AuthBloc', 'AuthUserProfileLoaded: ${user.name}');
          emit(AuthUserProfileLoaded(user: user));
          emit(AuthAuthenticated(user: user));
        },
      );
    } catch (e) {
      AppLogger.e('Get current user error', error: e);
      emit(AuthError(message: 'Kullanıcı bilgisi alınamadı: $e'));
    }
  }

  // ✅ Refresh User Profile Event Handler
  Future<void> _onUserProfileRefreshRequested(
    UserProfileRefreshRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'UserProfileRefreshRequested');

      final result = await authRepository.refreshUserProfile();

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthError: ${failure.message}');
          emit(AuthError(
            message: failure.message,
            statusCode: failure.statusCode,
          ));
        },
        (user) {
          AppLogger.blocState('AuthBloc', 'AuthUserProfileRefreshed: ${user.name}');
          emit(AuthUserProfileRefreshed(user: user));
          emit(AuthAuthenticated(user: user));
        },
      );
    } catch (e) {
      AppLogger.e('Refresh user profile error', error: e);
      emit(AuthError(message: 'Profil yenilenemedi: $e'));
    }
  }

  // ✅ Upload Profile Photo Event Handler
  Future<void> _onProfilePhotoUploadRequested(
    ProfilePhotoUploadRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'ProfilePhotoUploadRequested');
      emit(const AuthPhotoUploadLoading());

      final result = await authRepository.uploadProfilePhoto(event.photo);

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthPhotoUploadError: ${failure.message}');
          emit(AuthPhotoUploadError(message: failure.message));
        },
        (photoUrl) {
          AppLogger.blocState('AuthBloc', 'AuthPhotoUploadSuccess: $photoUrl');
          emit(AuthPhotoUploadSuccess(photoUrl: photoUrl));
          
          // Refresh user profile to get updated data
          add(const UserProfileRefreshRequested());
        },
      );
    } catch (e) {
      AppLogger.e('Photo upload error', error: e);
      emit(AuthPhotoUploadError(message: 'Fotoğraf yüklenemedi: $e'));
    }
  }

  // ✅ Clear Auth Data Event Handler
  Future<void> _onAuthDataClearRequested(
    AuthDataClearRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'AuthDataClearRequested');

      final result = await authRepository.clearAuthData();

      result.fold(
        (failure) {
          AppLogger.e('Clear auth data error: ${failure.message}');
        },
        (_) {
          AppLogger.blocState('AuthBloc', 'AuthDataCleared');
        },
      );

      emit(const AuthUnauthenticated());
    } catch (e) {
      AppLogger.e('Clear auth data error', error: e);
      emit(const AuthUnauthenticated());
    }
  }

  // ✅ Token Validation Event Handler
  Future<void> _onTokenValidationRequested(
    TokenValidationRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      AppLogger.blocEvent('AuthBloc', 'TokenValidationRequested');

      final result = await authRepository.validateToken();

      result.fold(
        (failure) {
          AppLogger.blocState('AuthBloc', 'AuthTokenInvalid: ${failure.message}');
          emit(const AuthTokenInvalid());
        },
        (isValid) {
          if (isValid) {
            AppLogger.blocState('AuthBloc', 'AuthTokenValid');
            emit(const AuthTokenValid());
          } else {
            AppLogger.blocState('AuthBloc', 'AuthTokenInvalid');
            emit(const AuthTokenInvalid());
            emit(const AuthUnauthenticated());
          }
        },
      );
    } catch (e) {
      AppLogger.e('Token validation error', error: e);
      emit(const AuthTokenInvalid());
    }
  }

  // ✅ Reset Auth State Event Handler
  Future<void> _onAuthStateReset(
    AuthStateReset event,
    Emitter<AuthState> emit,
  ) async {
    AppLogger.blocEvent('AuthBloc', 'AuthStateReset');
    emit(const AuthInitial());
  }

  // ✅ Helper method to get current user from state
  UserEntity? get currentUser => state.user;

  // ✅ Helper method to check if user is authenticated
  bool get isAuthenticated => state.isAuthenticated;

  // ✅ Helper method to check if user is loading
  bool get isLoading => state.isLoading;
}