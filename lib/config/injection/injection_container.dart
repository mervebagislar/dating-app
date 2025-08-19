// lib/config/injection/injection_container.dart - FIXED MOVIES BLOC INJECTION
import 'package:dating_app/core/constants/api_constants.dart';
import 'package:dating_app/core/network/network_info.dart';
import 'package:dating_app/features/movies/presentation/bloc/movies_bloc.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Features - Auth
import '../../features/auth/data/datasources/auth_remote_datasource.dart';
import '../../features/auth/data/datasources/auth_local_datasource.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/login_usecase.dart';
import '../../features/auth/domain/usecases/register_usecase.dart';
import '../../features/auth/domain/usecases/logout_usecase.dart';
import '../../features/auth/domain/usecases/get_current_user_usecase.dart';
import '../../features/auth/domain/usecases/check_auth_usecase.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/auth/presentation/viewmodels/auth_viewmodel.dart';

// Features - Movies
import '../../features/movies/data/datasources/movies_remote_datasource.dart';
import '../../features/movies/data/datasources/movies_local_datasource.dart';
import '../../features/movies/data/repositories/movies_repository_impl.dart';
import '../../features/movies/domain/repositories/movies_repository.dart';
import '../../features/movies/domain/usecases/get_movies_usecase.dart';
import '../../features/movies/domain/usecases/get_favorite_movies_usecase.dart';
import '../../features/movies/domain/usecases/toggle_favorite_usecase.dart';
import '../../features/movies/domain/usecases/search_movies_usecase.dart';
import '../../features/movies/presentation/viewmodels/movies_viewmodel.dart';

// Features - Profile
import '../../features/profile/data/datasources/profile_remote_datasource.dart';
import '../../features/profile/data/datasources/profile_remote_datasource_impl.dart';
import '../../features/profile/data/datasources/profile_local_datasource.dart';
import '../../features/profile/data/datasources/profile_local_datasource_impl.dart';
import '../../features/profile/data/repositories/profile_repository_impl_improved.dart';
import '../../features/profile/domain/repositories/profile_repository.dart';
import '../../features/profile/domain/usecases/get_profile_usecase.dart';
import '../../features/profile/domain/usecases/update_profile_usecase.dart';
import '../../features/profile/domain/usecases/upload_photo_usecase.dart';
import '../../features/profile/domain/usecases/logout_usecase.dart';
import '../../features/profile/presentation/bloc/profile_bloc.dart';
import '../../features/profile/presentation/bloc/favorite_movies_bloc.dart';
import '../../features/profile/presentation/viewmodels/profile_viewmodel.dart';

final sl = GetIt.instance;

Future<void> init() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Core
  await _initCore();

  // Features
  _initAuthFeature();
  _initMoviesFeature();
  _initProfileFeature();
}

// ===================== CORE =====================
Future<void> _initCore() async {
  sl.registerLazySingleton(() => Connectivity());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  sl.registerLazySingleton(() => const FlutterSecureStorage());

  sl.registerLazySingleton<Dio>(() {
    final dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: ApiConstants.connectionTimeout,
        receiveTimeout: ApiConstants.receiveTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          if (options.path.contains('/login') ||
              options.path.contains('/register') ||
              options.extra['skipAuthInterceptor'] == true) {
            return handler.next(options);
          }

          final storage = sl<FlutterSecureStorage>();
          final token = await storage.read(key: 'auth_token');
          if (token != null && !options.headers.containsKey('Authorization')) {
            options.headers['Authorization'] =
                token.startsWith('Bearer ') ? token : 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          if (error.response?.statusCode == 401) {
            _clearAuthToken();
          }
          handler.next(error);
        },
      ),
    );

    dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: false,
        logPrint: (object) => print('🌐 [Dio] $object'),
      ),
    );

    return dio;
  });
}

Future<void> _clearAuthToken() async {
  final storage = sl<FlutterSecureStorage>();
  await storage.delete(key: 'auth_token');
}

// ===================== AUTH FEATURE =====================
void _initAuthFeature() {
  // DataSources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(dio: sl<Dio>()),
  );
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(storage: sl<FlutterSecureStorage>()),
  );

  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // UseCases
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterUseCase(sl()));
  sl.registerLazySingleton(() => LogoutUseCase(sl()));
  sl.registerLazySingleton(() => GetCurrentUserUseCase(sl()));
  sl.registerLazySingleton(() => CheckAuthUseCase(sl()));

  // Bloc
  sl.registerFactory(
    () => AuthBloc(
      loginUseCase: sl(),
      registerUseCase: sl(),
      logoutUseCase: sl(),
      getCurrentUserUseCase: sl(),
      checkAuthUseCase: sl(),
      authRepository: sl(),
    ),
  );

  // ✅ ADDED: MVVM ViewModel
  sl.registerFactory(() => AuthViewModel(sl()));
}

// ===================== MOVIES FEATURE =====================
void _initMoviesFeature() {
  // DataSources
  sl.registerLazySingleton<MoviesRemoteDataSource>(
    () => MoviesRemoteDataSourceImpl(),
  );
  sl.registerLazySingleton<MoviesLocalDataSource>(
    () => MoviesLocalDataSourceImpl(storage: sl<FlutterSecureStorage>()),
  );

  // Repository
  sl.registerLazySingleton<MoviesRepository>(
    () => MoviesRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // UseCases
  sl.registerLazySingleton(() => GetMoviesUseCase(sl()));
  sl.registerLazySingleton(() => GetFavoriteMoviesUseCase(sl()));
  sl.registerLazySingleton(() => ToggleFavoriteUseCase(sl()));
  sl.registerLazySingleton(() => SearchMoviesUseCase(sl()));

  // ✅ FIXED: Using OptimizedMoviesBloc with ALL required dependencies
  sl.registerFactory(
    () => OptimizedMoviesBloc(
      getMoviesUseCase: sl(),
      toggleFavoriteUseCase: sl(),
      getFavoriteMoviesUseCase: sl(), // ✅ ADDED: Now injecting GetFavoriteMoviesUseCase
      searchMoviesUseCase: sl(),      // ✅ ADDED: Now injecting SearchMoviesUseCase
    ),
  );

  // ✅ ADDED: MVVM ViewModel
  sl.registerFactory(() => MoviesViewModel(sl()));
}

// ===================== PROFILE FEATURE =====================
void _initProfileFeature() {
  // DataSources
  sl.registerLazySingleton<ProfileRemoteDataSource>(
    () => ProfileRemoteDataSourceImpl(dio: sl<Dio>()),
  );
  sl.registerLazySingleton<ProfileLocalDataSource>(
    () => ProfileLocalDataSourceImpl(secureStorage: sl<FlutterSecureStorage>()),
  );

  // ✅ FIXED: Using ImprovedProfileRepositoryImpl instead of ProfileRepositoryImpl
  sl.registerLazySingleton<ProfileRepository>(
    () => ImprovedProfileRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // UseCases
  sl.registerLazySingleton(() => GetProfileUseCase(sl()));
  sl.registerLazySingleton(() => UpdateProfileUseCase(sl()));
  sl.registerLazySingleton(() => UploadPhotoUseCase(sl()));
  sl.registerLazySingleton(() => ProfileLogoutUseCase(sl()));

  // Blocs
  sl.registerFactory(
    () => ProfileBloc(
      getProfileUseCase: sl(),
      updateProfileUseCase: sl(),
      uploadPhotoUseCase: sl(),
      logoutUseCase: sl<ProfileLogoutUseCase>(), // ✅ FIXED: Using ProfileLogoutUseCase
    ),
  );

  sl.registerFactory(() => FavoriteMoviesBloc(getFavoriteMoviesUseCase: sl()));

  // ✅ ADDED: MVVM ViewModel
  sl.registerFactory(() => ProfileViewModel(sl()));
}