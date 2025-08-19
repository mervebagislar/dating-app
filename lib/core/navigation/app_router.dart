// lib/core/navigation/app_router.dart - UPDATED MOVIES BLOC INITIALIZATION
import 'package:dating_app/config/injection/injection_container.dart' as di;
import 'package:dating_app/features/movies/presentation/pages/home/home_page.dart';
import 'package:dating_app/features/profile/presentation/bloc/favorite_movies_bloc.dart';
import 'package:dating_app/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:dating_app/features/profile/presentation/pages/profile_page.dart';
import 'package:dating_app/features/profile/presentation/pages/photo_upload_page.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../features/movies/presentation/bloc/movies_bloc.dart';
import '../../features/movies/presentation/bloc/movies_event.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/auth/presentation/bloc/auth_state.dart';
import '../../features/auth/presentation/bloc/auth_event.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import 'dart:async';

import '../../shared/widgets/bottom_navigation_shell.dart';
import '../constants/app_colors.dart';
import 'app_routes.dart';

class AppRouter {
  static late AuthBloc _authBloc;
  
  static GoRouter createRouter(AuthBloc authBloc) {
    _authBloc = authBloc;
    
    return GoRouter(
      initialLocation: AppRoutes.login,
      debugLogDiagnostics: false,
      refreshListenable: GoRouterRefreshStream(_authBloc.stream),
      
      redirect: (context, state) {
        final authState = _authBloc.state;
        final isAuthenticated = authState.isAuthenticated;
        final location = state.uri.toString();
        
        print('🧭 Navigation: $location (Auth: $isAuthenticated)');
        print('🔍 Auth State: ${authState.runtimeType}');
        
        const publicRoutes = [AppRoutes.login, AppRoutes.register];
        final isPublicRoute = publicRoutes.contains(location);
        
        if (isAuthenticated && isPublicRoute) {
          if (authState is AuthRegisterSuccess) {
            print('✅ Registration successful - redirecting to PROFILE');
            return AppRoutes.profile;
          } else if (authState is AuthLoginSuccess || authState is AuthAuthenticated) {
            print('✅ Login successful - redirecting to home');
            return AppRoutes.home;
          } else {
            print('✅ Already authenticated - redirecting to home');
            return AppRoutes.home;
          }
        }
        
        if (!isAuthenticated && !isPublicRoute) {
          print('🔒 Redirecting to login - user not authenticated');
          return AppRoutes.login;
        }
        
        return null;
      },

      routes: [
        // ✅ AUTH ROUTES (No Shell - Full Screen)
        GoRoute(
          path: AppRoutes.login,
          name: 'login',
          builder: (context, state) => BlocProvider.value(
            value: _authBloc,
            child: const LoginPage(),
          ),
        ),
        
        GoRoute(
          path: AppRoutes.register,
          name: 'register',
          builder: (context, state) => BlocProvider.value(
            value: _authBloc,
            child: const RegisterPage(),
          ),
        ),

        // ✅ PHOTO UPLOAD ROUTE (No Shell - Modal Page)
        GoRoute(
          path: AppRoutes.photoUpload,
          name: 'photoUpload',
          builder: (context, state) => MultiBlocProvider(
            providers: [
              BlocProvider.value(value: _authBloc),
              BlocProvider(create: (_) => di.sl<ProfileBloc>()),
            ],
            child: const PhotoUploadPage(),
          ),
        ),

        // ✅ MAIN APP ROUTES (With shell - bottom navigation)
        ShellRoute(
          builder: (context, state, child) {
            return BlocProvider.value(
              value: _authBloc,
              child: BottomNavigationShell(
                currentRoute: state.fullPath ?? state.uri.toString(),
                child: child,
              ),
            );
          },
          routes: [
            GoRoute(
              path: AppRoutes.home,
              name: 'home',
              builder: (context, state) {
                print('🏠 Building Clean Architecture HomePage');
                return MultiBlocProvider(
                  providers: [
                    BlocProvider.value(value: _authBloc),
                    // ✅ FIXED: Create new OptimizedMoviesBloc with proper initialization
                    BlocProvider(
                      create: (context) {
                        final bloc = di.sl<OptimizedMoviesBloc>();
                        print('🎬 MoviesBloc created - loading first page with favorites');
                        // Load favorites and first page
                        bloc.add(const MoviesLoadRequested(page: 1));
                        return bloc;
                      },
                    ),
                  ],
                  child: const HomePage(),
                );
              },
            ),

            GoRoute(
              path: AppRoutes.profile,
              name: 'profile',
              builder: (context, state) {
                print('👤 Building Real ProfilePage');
                
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  final authState = _authBloc.state;
                  if (authState is AuthRegisterSuccess) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'Hoş geldiniz ${authState.user.name}! Profilinizi tamamlayın.',
                          style: const TextStyle(
                            fontFamily: 'Euclid Circular A',
                            fontSize: 14,
                          ),
                        ),
                        backgroundColor: const Color(0xFF4CAF50),
                        duration: const Duration(seconds: 3),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    );
                  }
                });

                return MultiBlocProvider(
                  providers: [
                    BlocProvider.value(value: _authBloc),
                    BlocProvider(create: (_) => di.sl<ProfileBloc>()),
                    BlocProvider(create: (_) => di.sl<FavoriteMoviesBloc>()),
                  ],
                  child: const ProfilePage(),
                );
              },
            ),
          ],
        ),
      ],

      errorBuilder: (context, state) {
        print('❌ Router Error: ${state.error}');
        return ErrorPage(error: state.error.toString());
      },
    );
  }
}

// ✅ REFRESH STREAM FOR GO_ROUTER
class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    notifyListeners();
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}

// ✅ NAVIGATION EXTENSION
extension AppNavigator on BuildContext {
  void goToHome() {
    print('🏠 Navigation: Going to home');
    go(AppRoutes.home);
  }

  void goToProfile() {
    print('👤 Navigation: Going to profile');
    go(AppRoutes.profile);
  }
  
  void goToLogin() {
    print('🔒 Navigation: Going to login');
    go(AppRoutes.login);
  }
  
  void goToRegister() {
    print('📝 Navigation: Going to register');
    go(AppRoutes.register);
  }

  void logoutForTesting() {
    print('🔓 Manual logout for testing');
    read<AuthBloc>().add(const LogoutRequested());
  }
}

// ✅ ERROR PAGE WITH LOGOUT OPTION
class ErrorPage extends StatelessWidget {
  final String error;

  const ErrorPage({super.key, required this.error});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 64,
                  color: AppColors.error,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Bir hata oluştu',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  error,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.white.withOpacity(0.7),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ElevatedButton(
                      onPressed: () => context.goToHome(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: AppColors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Ana Sayfa',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                    
                    ElevatedButton(
                      onPressed: () => context.goToProfile(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4CAF50),
                        foregroundColor: AppColors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Profil',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                    
                    ElevatedButton(
                      onPressed: () {
                        print('🔓 Manual logout from error page');
                        context.read<AuthBloc>().add(const LogoutRequested());
                        context.goToLogin();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.grey600,
                        foregroundColor: AppColors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Çıkış'),
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Hesabınız yok mu? ',
                      style: TextStyle(
                        color: AppColors.white.withOpacity(0.6),
                        fontSize: 14,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.goToRegister(),
                      child: const Text(
                        'Kaydolun',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          decoration: TextDecoration.underline,
                          decorationColor: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}