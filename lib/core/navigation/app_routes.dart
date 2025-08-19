// lib/core/navigation/app_routes.dart - REGISTER ROUTE ADDED
class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register'; // ✅ REGISTER ROUTE ADDED
  static const String home = '/home';
  static const String profile = '/profile';
  static const String movies = '/movies';
  static const String movieDetail = '/movie/:id';
  static const String photoUpload = '/photo-upload';
  
  // Private constructor
  AppRoutes._();
}

// ✅ SAMPLE ROUTER CONFIGURATION
/*
// lib/core/navigation/app_router.dart içinde şu route'u ekleyin:

GoRoute(
  path: AppRoutes.register,
  pageBuilder: (context, state) => CustomTransitionPage<void>(
    key: state.pageKey,
    child: BlocProvider(
      create: (context) => sl<AuthBloc>(),
      child: const RegisterPage(),
    ),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  ),
),
*/