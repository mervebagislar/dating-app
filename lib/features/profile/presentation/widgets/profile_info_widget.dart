// lib/features/profile/presentation/widgets/profile_info_widget.dart - GOROUTER NAVIGATION
import 'package:dating_app/features/profile/presentation/bloc/profile_event.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/navigation/app_routes.dart';
import '../bloc/profile_bloc.dart';
import '../bloc/profile_state.dart';

class ProfileInfoWidget extends StatelessWidget {
  const ProfileInfoWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        if (state is ProfileLoading) {
          return const _ProfileInfoLoadingWidget();
        }

        final profile = context.read<ProfileBloc>().currentProfile;

        if (profile == null) {
          return const _ProfileInfoErrorWidget();
        }

        return Padding(
          padding: const EdgeInsets.only(
            left: 35.12,
            right: 24,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile Photo
              _ProfilePhotoWidget(
                photoUrl: profile.photoUrl,
                isUploading: state is ProfilePhotoUploading,
              ),

              const SizedBox(width: 9.85),
              
              // User Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: 105,
                      height: 19,
                      child: Text(
                        profile.name,
                        textAlign: TextAlign.left,
                        style: const TextStyle(
                          fontFamily: 'Euclid Circular A',
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFFFFFFFF),
                          height: 1.0,
                          letterSpacing: 0,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),

                    const SizedBox(height: 5.78),
                    
                    SizedBox(
                      width: 58,
                      height: 18,
                      child: Text(
                        'ID: ${profile.id}',
                        textAlign: TextAlign.left,
                        style: const TextStyle(
                          fontFamily: 'Euclid Circular A',
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Color(0x80FFFFFF),
                          height: 1.5,
                          letterSpacing: 0,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),

              // Photo Upload Button
              _PhotoUploadButtonWidget(
                isUploading: state is ProfilePhotoUploading,
              ),
            ],
          ),
        );
      },
    );
  }
}

class _ProfilePhotoWidget extends StatelessWidget {
  final String? photoUrl;
  final bool isUploading;

  const _ProfilePhotoWidget({
    required this.photoUrl,
    required this.isUploading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 61.91,
      height: 61.91,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(62.88),
        color: const Color(0xFF333333),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(62.88),
        child: isUploading
            ? const _PhotoUploadingIndicator()
            : photoUrl != null && photoUrl!.isNotEmpty
                ? CachedNetworkImage(
                    imageUrl: photoUrl!,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => const _DefaultAvatarWidget(),
                    errorWidget: (context, url, error) => const _DefaultAvatarWidget(),
                    key: ValueKey(
                      'photo_${photoUrl.hashCode}_${DateTime.now().millisecondsSinceEpoch}',
                    ),
                  )
                : const _DefaultAvatarWidget(),
      ),
    );
  }
}

class _PhotoUploadingIndicator extends StatelessWidget {
  const _PhotoUploadingIndicator();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF333333),
      child: const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
          strokeWidth: 2,
        ),
      ),
    );
  }
}

class _DefaultAvatarWidget extends StatelessWidget {
  const _DefaultAvatarWidget();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(62.88),
        color: const Color(0xFFE50914).withOpacity(0.2),
      ),
      child: Center(
        child: Icon(
          Icons.person,
          size: 30,
          color: Colors.white.withOpacity(0.7),
        ),
      ),
    );
  }
}

class _PhotoUploadButtonWidget extends StatelessWidget {
  final bool isUploading;

  const _PhotoUploadButtonWidget({required this.isUploading});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isUploading ? null : () => _navigateToPhotoUpload(context),
      child: Container(
        width: 121,
        height: 36,
        padding: const EdgeInsets.fromLTRB(19, 10, 19, 10),
        decoration: BoxDecoration(
          color: isUploading
              ? const Color(0xFFE50914).withOpacity(0.6)
              : const Color(0xFFE50914),
          borderRadius: BorderRadius.circular(2),
        ),
        child: Center(
          child: isUploading
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                )
              : const Text(
                  'Fotoğraf Ekle',
                  style: TextStyle(
                    fontFamily: 'Euclid Circular A',
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFFFFFFFF),
                    height: 1.0,
                    letterSpacing: 0,
                  ),
                ),
        ),
      ),
    );
  }

  // ✅ FIX: GoRouter kullanarak photo upload sayfasına git (Shell dışında)
  void _navigateToPhotoUpload(BuildContext context) {
    try {
      // ✅ GoRouter ile photo upload sayfasına git
      // Bu route shell dışında tanımlanmış olacak, bu yüzden bottom navigation olmayacak
      context.push(AppRoutes.photoUpload);
    } catch (e) {
      // ✅ Hata durumunda kullanıcı dostu mesaj
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Fotoğraf yükleme sayfası açılamadı. Lütfen tekrar deneyin.',
            style: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 14,
            ),
          ),
          backgroundColor: AppColors.error,
          action: SnackBarAction(
            label: 'Tekrar Dene',
            textColor: AppColors.white,
            onPressed: () => _navigateToPhotoUpload(context),
          ),
        ),
      );
      
      print('❌ Photo upload navigation error: $e');
    }
  }
}

class _ProfileInfoLoadingWidget extends StatelessWidget {
  const _ProfileInfoLoadingWidget();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 35.12, right: 24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Photo skeleton
          Container(
            width: 61.91,
            height: 61.91,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(62.88),
              color: const Color(0xFF333333),
            ),
            child: const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
                strokeWidth: 2,
              ),
            ),
          ),

          const SizedBox(width: 9.85),

          // Info skeletons
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 105,
                  height: 19,
                  decoration: BoxDecoration(
                    color: const Color(0xFF333333),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 5.78),
                Container(
                  width: 58,
                  height: 18,
                  decoration: BoxDecoration(
                    color: const Color(0xFF333333),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ],
            ),
          ),

          // Button skeleton
          Container(
            width: 121,
            height: 36,
            decoration: BoxDecoration(
              color: const Color(0xFF333333),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileInfoErrorWidget extends StatelessWidget {
  const _ProfileInfoErrorWidget();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Center(
        child: Column(
          children: [
            Icon(
              Icons.error_outline,
              size: 48,
              color: const Color(0xFFE50914).withOpacity(0.7),
            ),
            const SizedBox(height: 16),
            const Text(
              'Profil bilgileri yüklenemedi',
              style: TextStyle(
                color: Color(0xFFFFFFFF),
                fontSize: 16,
                fontWeight: FontWeight.w600,
                fontFamily: 'Euclid Circular A',
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Lütfen tekrar deneyin',
              style: TextStyle(
                color: const Color(0xFFFFFFFF).withOpacity(0.5),
                fontSize: 14,
                fontFamily: 'Euclid Circular A',
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                context.read<ProfileBloc>().add(const LoadProfileEvent());
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE50914),
                foregroundColor: const Color(0xFFFFFFFF),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              child: const Text(
                'Tekrar Dene',
                style: TextStyle(
                  fontFamily: 'Euclid Circular A',
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}