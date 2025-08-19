// lib/core/navigation/enhanced_app_router.dart - FIXED
import 'dart:async';

import 'package:dating_app/features/movies/presentation/pages/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../config/injection/injection_container.dart' as di;
import '../../core/constants/app_colors.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/auth/presentation/bloc/auth_state.dart';
import '../../features/auth/presentation/bloc/auth_event.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import '../../features/movies/presentation/bloc/movies_bloc.dart';
import '../../features/movies/presentation/bloc/movies_event.dart'; // ✅ FIXED: Import events

import '../../features/profile/presentation/bloc/profile_bloc.dart';
import '../../features/profile/presentation/bloc/favorite_movies_bloc.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/profile/presentation/pages/photo_upload_page.dart';
import '../../shared/widgets/bottom_navigation_shell.dart';
import 'app_routes.dart';

class EnhancedAppRouter {
  static late final GoRouter _router;
  static late final AuthBloc _authBloc;

  static GoRouter get router => _router;

  static void initialize() {
    _authBloc = di.sl<AuthBloc>();
    
    _router = GoRouter(
      initialLocation: AppRoutes.home,
      debugLogDiagnostics: false,
      refreshListenable: GoRouterRefreshStream(_authBloc.stream),
      
      redirect: (context, state) {
        final isAuthenticated = _authBloc.state.isAuthenticated;
        final location = state.uri.toString();
        
        print('🧭 Navigation: $location (Auth: $isAuthenticated)');
        
        // Public routes that don't require auth
        const publicRoutes = [AppRoutes.login, AppRoutes.register];
        final isPublicRoute = publicRoutes.contains(location);
        
        // Redirect logic
        if (!isAuthenticated && !isPublicRoute) {
          print('🔒 Redirecting to login - user not authenticated');
          return AppRoutes.login;
        } else if (isAuthenticated && isPublicRoute) {
          print('✅ Redirecting to home - user already authenticated');
          return AppRoutes.home;
        }
        
        return null; // No redirect needed
      },

      routes: [
        // ✅ AUTH ROUTES (No Shell)
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
        
        // ✅ APP SHELL ROUTES (With Bottom Navigation)
        ShellRoute(
          builder: (context, state, child) {
            return BlocProvider.value(
              value: _authBloc,
              child: BottomNavigationShell(
                currentRoute: state.uri.toString(),
                child: child,
              ),
            );
          },
          routes: [
            GoRoute(
              path: AppRoutes.home,
              name: 'home',
              builder: (context, state) => MultiBlocProvider(
                providers: [
                  BlocProvider.value(value: _authBloc),
                  BlocProvider(
                    create: (_) => di.sl<MoviesBloc>()
                      ..add(const MoviesLoadRequested(page: 1)), // ✅ FIXED: Correct event
                  ),
                ],
                child: const HomePage(),
              ),
            ),
            
            GoRoute(
              path: AppRoutes.profile,
              name: 'profile',
              builder: (context, state) => MultiBlocProvider(
                providers: [
                  BlocProvider.value(value: _authBloc),
                  BlocProvider(create: (_) => di.sl<MoviesBloc>()),
                  // ✅ Add ProfileBloc and FavoriteMoviesBloc with proper types
                  BlocProvider(create: (_) => di.sl<ProfileBloc>()),
                  BlocProvider(create: (_) => di.sl<FavoriteMoviesBloc>()),
                ],
                child: const ProfilePage(),
              ),
            ),
          ],
        ),
      ],
      
      errorBuilder: (context, state) => AppErrorPage(
        error: state.error.toString(),
        location: state.uri.toString(),
      ),
    );
  }

  static void dispose() {
    _authBloc.close();
  }
}

// ✅ CUSTOM REFRESH STREAM FOR GO_ROUTER
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

// ✅ PROFESSIONAL ERROR PAGE
class AppErrorPage extends StatelessWidget {
  final String error;
  final String location;

  const AppErrorPage({
    super.key,
    required this.error,
    required this.location,
  });

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
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.error.withOpacity(0.3),
                      width: 2,
                    ),
                  ),
                  child: const Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppColors.error,
                  ),
                ),
                
                const SizedBox(height: 24),
                
                const Text(
                  'Bir Hata Oluştu',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: AppColors.white,
                    fontFamily: 'Euclid Circular A',
                  ),
                ),
                
                const SizedBox(height: 8),
                
                Text(
                  'Sayfa: $location',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.white.withOpacity(0.7),
                    fontFamily: 'Euclid Circular A',
                  ),
                ),
                
                const SizedBox(height: 16),
                
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.grey600,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: AppColors.error.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    error,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.white.withOpacity(0.8),
                      fontFamily: 'Euclid Circular A',
                    ),
                  ),
                ),
                
                const SizedBox(height: 32),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ElevatedButton.icon(
                      onPressed: () => context.go(AppRoutes.home),
                      icon: const Icon(Icons.home),
                      label: const Text('Ana Sayfa'),
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
                    ),
                    
                    ElevatedButton.icon(
                      onPressed: () {
                        // ✅ Logout and redirect to login
                        context.read<AuthBloc>().add(const LogoutRequested());
                        context.go(AppRoutes.login);
                      },
                      icon: const Icon(Icons.logout),
                      label: const Text('Çıkış'),
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
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                TextButton(
                  onPressed: () {
                    // ✅ Go back if possible
                    if (Navigator.of(context).canPop()) {
                      Navigator.of(context).pop();
                    } else {
                      context.go(AppRoutes.home);
                    }
                  },
                  child: Text(
                    'Geri Dön',
                    style: TextStyle(
                      color: AppColors.white.withOpacity(0.7),
                      fontFamily: 'Euclid Circular A',
                    ),
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // ✅ Register suggestion in error page
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Hesabınız yok mu? ',
                      style: TextStyle(
                        color: AppColors.white.withOpacity(0.6),
                        fontSize: 14,
                        fontFamily: 'Euclid Circular A',
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        context.go(AppRoutes.register);
                      },
                      child: const Text(
                        'Kaydolun',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          decoration: TextDecoration.underline,
                          decorationColor: AppColors.primary,
                          fontFamily: 'Euclid Circular A',
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