// lib/features/profile/presentation/pages/profile_page.dart - UPDATED with auto-refresh
import 'package:dating_app/config/injection/injection_container.dart';
import 'package:dating_app/features/profile/presentation/pages/favorite_movies_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/navigation/app_routes.dart';

import '../bloc/profile_bloc.dart';
import '../bloc/profile_event.dart';
import '../bloc/profile_state.dart';
import '../bloc/favorite_movies_bloc.dart';
import '../bloc/favorite_movies_event.dart';
import '../bloc/favorite_movies_state.dart';
import '../widgets/profile_header_widget.dart';
import '../widgets/profile_info_widget.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => sl<ProfileBloc>()..add(const LoadProfileEvent()),
        ),
        BlocProvider(
          create:
              (context) =>
                  sl<FavoriteMoviesBloc>()
                    ..add(const LoadFavoriteMoviesEvent()),
        ),
      ],
      child: const ProfileView(),
    );
  }
}

class ProfileView extends StatefulWidget {
  const ProfileView({super.key});

  @override
  State<ProfileView> createState() => _ProfileViewState();
}

class _ProfileViewState extends State<ProfileView> with RouteAware {
  
  @override
  void initState() {
    super.initState();
    print('🔵 ProfileView initState called');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    
    // ✅ Her sayfa değişiminde kontrol et
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAndRefresh();
    });
  }
  
  // ✅ Sayfa her açıldığında refresh kontrolü
  void _checkAndRefresh() {
    final location = GoRouterState.of(context).uri.toString();
    print('📍 Current location: $location');
    
    // ✅ Refresh parameter varsa veya photo upload'dan geliyorsa
    if (location.contains('refresh=true') || location.contains('photo-upload')) {
      print('🔄 Auto refresh triggered');
      
      // ✅ Kısa bir delay ile refresh et
      Future.delayed(const Duration(milliseconds: 200), () {
        if (mounted) {
          print('🔄 Executing refresh...');
          context.read<ProfileBloc>().add(const RefreshProfileEvent());
          context.read<FavoriteMoviesBloc>().add(const RefreshFavoriteMoviesEvent());
          
          // ✅ Success feedback
          Future.delayed(const Duration(milliseconds: 800), () {
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Profil bilgileri güncellendi',
                    style: TextStyle(
                      fontFamily: 'Euclid Circular A',
                      fontSize: 14,
                    ),
                  ),
                  backgroundColor: Color(0xFF4CAF50),
                  duration: Duration(seconds: 2),
                ),
              );
            }
          });
        }
      });
      
      // ✅ URL'i temizle
      if (location.contains('refresh=true')) {
        Future.delayed(const Duration(milliseconds: 100), () {
          if (mounted) {
            context.go(AppRoutes.profile);
          }
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: SafeArea(
        child: BlocListener<ProfileBloc, ProfileState>(
          listener: (context, state) {
            if (state is ProfilePhotoUploaded) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: AppColors.success,
                  duration: const Duration(seconds: 2),
                ),
              );
            } else if (state is ProfileError) {
              // ✅ IMPROVED: Better error handling with retry mechanism
              _showErrorSnackBar(context, state.message);
            } else if (state is ProfileLoggedOut) {
              context.go(AppRoutes.login);
            }
          },
          child: RefreshIndicator(
            onRefresh: () async {
              context.read<ProfileBloc>().add(const RefreshProfileEvent());
              context.read<FavoriteMoviesBloc>().add(
                const RefreshFavoriteMoviesEvent(),
              );
            },
            color: AppColors.primary,
            backgroundColor: AppColors.backgroundDark,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              // ✅ REDUCED: Bottom padding since shell handles navigation
              padding: const EdgeInsets.only(bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  SizedBox(height: 14),

                  // Header
                  ProfileHeaderWidget(),

                  SizedBox(height: 69.02),

                  // Profile Info Section
                  ProfileInfoWidget(),

                  SizedBox(height: 59.9),

                  // Favorite Movies Section
                  FavoriteMoviesWidget(),
                ],
              ),
            ),
          ),
        ),
      ),
      // ✅ REMOVED: bottomNavigationBar - Shell handles navigation
      // Bottom navigation is now handled by BottomNavigationShell
    );
  }

  // ✅ ADDED: Improved error handling method
  void _showErrorSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error_outline, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  fontFamily: 'Euclid Circular A',
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.error,
        duration: const Duration(seconds: 5),
        action: SnackBarAction(
          label: 'Tekrar Dene',
          textColor: AppColors.white,
          onPressed: () {
            context.read<ProfileBloc>().add(const LoadProfileEvent());
            context.read<FavoriteMoviesBloc>().add(
              const LoadFavoriteMoviesEvent(),
            );
          },
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}