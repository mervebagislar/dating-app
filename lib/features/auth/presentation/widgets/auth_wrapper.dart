// lib/features/auth/presentation/widgets/auth_wrapper.dart
import 'package:dating_app/config/injection/injection_container.dart' as di;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/utils/logger.dart';
import '../../../../features/movies/presentation/bloc/movies_bloc.dart';
import '../../../../features/movies/presentation/pages/home/home_page.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_state.dart';
import '../pages/login_page.dart';

/// AuthWrapper - Manages navigation based on authentication state
class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        AppLogger.d('AuthWrapper state: ${state.runtimeType}');
        
        // Show loading screen while checking auth status
        if (state is AuthLoading) {
          return const _LoadingScreen();
        }
        
        // Show authenticated screens
        if (state.isAuthenticated && state.user != null) {
          AppLogger.d('User authenticated: ${state.user!.name}');
          // HomePage needs MoviesBloc, so wrap it with BlocProvider
          return BlocProvider(
            create: (context) => di.sl<MoviesBloc>(),
            child: const HomePage(),
          );
        }
        
        // Show login screen for unauthenticated users
        AppLogger.d('User not authenticated');
        return const LoginPage();
      },
    );
  }
}

/// Loading screen shown while authentication is being checked
class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFF090909),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
            ),
            SizedBox(height: 16),
            Text(
              'Yükleniyor...',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}