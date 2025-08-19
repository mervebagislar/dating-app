// lib/main.dart - TEMPORARY LOGIN REDIRECT
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/auth/presentation/bloc/auth_event.dart';
import 'config/injection/injection_container.dart' as di;
import 'core/constants/app_colors.dart';
import 'core/navigation/app_router.dart';
import 'core/utils/logger.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/splash/presentation/pages/splash_page.dart';
// ✅ LOGIN PAGE IMPORT EKLEYIN
import 'features/auth/presentation/pages/login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    AppLogger.i('🚀 Dating App Started - Case Study Implementation');

    await di.init();
    AppLogger.i('✅ Clean Architecture DI configured');

    await _setupSystemUI();
    AppLogger.i('✅ System UI configured');

    runApp(const DatingApp());
  } catch (e, stackTrace) {
    AppLogger.e(
      '❌ App initialization failed: $e',
      error: e,
      stackTrace: stackTrace,
    );
    runApp(ErrorApp(error: e.toString()));
  }
}

Future<void> _setupSystemUI() async {
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.backgroundDark,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
}

class DatingApp extends StatefulWidget {
  const DatingApp({super.key});

  @override
  State<DatingApp> createState() => _DatingAppState();
}

class _DatingAppState extends State<DatingApp> {
  late final AuthBloc _authBloc;
  bool _showSplash = true;

  // ✅ TEMPORARY DEBUG FLAG - Login sayfasına direkt git
  static const bool TEMP_SHOW_LOGIN = true;

  @override
  void initState() {
    super.initState();
    
    // ✅ Initialize AuthBloc
    _authBloc = di.sl<AuthBloc>();
    
    // ✅ DEBUG: Skip splash if showing login directly
    if (TEMP_SHOW_LOGIN) {
      _showSplash = false;
      AppLogger.i('🔧 DEBUG MODE: Skipping splash, showing login directly');
    } else {
      // Normal splash timer
      _startSplashTimer();
    }
    
    AppLogger.i('✅ App initialized');
  }

  void _startSplashTimer() async {
    AppLogger.i('🎬 Showing splash screen for 3 seconds...');
    
    // ✅ Show splash for 3 seconds
    await Future.delayed(const Duration(seconds: 3));
    
    if (!mounted) return;
    
    // ✅ Check auth status
    _authBloc.add(const AuthStatusRequested());
    
    // ✅ Wait a bit for auth check
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (!mounted) return;
    
    // ✅ Hide splash and show router
    setState(() {
      _showSplash = false;
    });
    
    AppLogger.i('✅ Splash completed, showing main app with GoRouter');
  }

  @override
  void dispose() {
    _authBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // ✅ Always wrap with BlocProvider for AuthBloc
    return BlocProvider<AuthBloc>.value(
      value: _authBloc,
      child: _showSplash 
          ? _buildSplashApp() 
          : TEMP_SHOW_LOGIN 
              ? _buildLoginApp()  // ✅ Direct login app
              : _buildMainApp(),  // Normal router app
    );
  }

  // ✅ Splash screen app
  Widget _buildSplashApp() {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Dating App',
      theme: _buildDarkTheme(),
      home: const SplashPage(),
    );
  }

  // ✅ TEMPORARY: Direct login app
  Widget _buildLoginApp() {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Dating App - Login Design',
      theme: _buildDarkTheme(),
      home: const LoginPage(), // ✅ Direkt login sayfası
    );
  }

  // ✅ Main app with GoRouter
  Widget _buildMainApp() {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'Dating App',
      theme: _buildDarkTheme(),
      routerConfig: AppRouter.createRouter(_authBloc),
    );
  }

  ThemeData _buildDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        background: AppColors.backgroundDark,
      ),
      fontFamily: 'Euclid Circular A',
    );
  }
}

/// Error widget for initialization failures
class ErrorApp extends StatelessWidget {
  final String error;
  const ErrorApp({super.key, required this.error});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dating App - Error',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: Scaffold(
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
                    'Uygulama Başlatılamadı',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: AppColors.white,
                      fontFamily: 'Euclid Circular A',
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceDark,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: AppColors.error.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      error,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.white.withOpacity(0.8),
                        fontFamily: 'Euclid Circular A',
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton.icon(
                    onPressed: () {
                      SystemNavigator.pop();
                    },
                    icon: const Icon(Icons.refresh),
                    label: const Text('Uygulamayı Yeniden Başlat'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 16,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}