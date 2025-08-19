// photo_upload_page.dart - Updated with profile auto-refresh
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:go_router/go_router.dart'; // ✅ GoRouter import
import '../../../../core/constants/app_colors.dart';
import '../../../../core/navigation/app_routes.dart'; // ✅ Routes import
import '../bloc/profile_bloc.dart';
import '../bloc/profile_event.dart';
import '../bloc/profile_state.dart';

class PhotoUploadPage extends StatefulWidget {
  const PhotoUploadPage({super.key});

  @override
  State<PhotoUploadPage> createState() => _PhotoUploadPageState();
}

class _PhotoUploadPageState extends State<PhotoUploadPage> {
  File? _selectedImage;
  final ImagePicker _picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090909), // ✅ Figma background: #090909
      body: SafeArea(
        child: BlocListener<ProfileBloc, ProfileState>(
          listener: (context, state) {
            if (state is ProfilePhotoUploaded) {
              // ✅ Başarılı upload sonrası profil sayfasına yönlendir
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text(
                    'Fotoğraf başarıyla yüklendi!',
                    style: TextStyle(
                      fontFamily: 'Euclid Circular A',
                      fontSize: 14,
                    ),
                  ),
                  backgroundColor: const Color(0xFF4CAF50),
                  duration: const Duration(seconds: 1),
                ),
              );

              // ✅ Profil sayfasına git ve refresh tetikle
              _navigateToProfileWithRefresh();
            } else if (state is ProfileError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    state.message,
                    style: const TextStyle(
                      fontFamily: 'Euclid Circular A',
                      fontSize: 14,
                    ),
                  ),
                  backgroundColor: AppColors.error,
                ),
              );
            }
          },
          child: Container(
            width: 402, // ✅ Figma width
            height: 844, // ✅ Figma height
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30), // ✅ Figma border-radius
              color: const Color(0xFF090909), // ✅ Figma background
            ),
            child: Column(
              children: [
                // ✅ Header Section
                _buildHeader(),

                const SizedBox(
                  height: 18.02,
                ), // ✅ Calculated from Figma positions
                // ✅ Title
                _buildTitle(),

                const SizedBox(height: 30.25), // ✅ Calculated spacing
                // ✅ Subtitle
                _buildSubtitle(),

                const SizedBox(height: 78.65), // ✅ Calculated spacing
                // ✅ Photo Upload Area
                _buildPhotoUploadArea(),

                const Spacer(),

                // ✅ Continue Button
                _buildContinueButton(),

                const SizedBox(height: 26), // ✅ Bottom padding
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ✅ Figma Header with exact positioning
  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      height: 67.21, // ✅ Calculated from Figma (50 + icon height)
      child: Stack(
        children: [
          // ✅ Profile Circle - Exact Figma positioning
          Positioned(
            top: 14.04, // ✅ Figma: top: 38.04px - SafeArea adjustment
            left: 24.43, // ✅ Figma: left: 24.43px
            child: Container(
              width: 44.342132568359375, // ✅ Figma exact width
              height: 44.342132568359375, // ✅ Figma exact height
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(
                  0x1AFFFFFF,
                ), // ✅ Figma: #FFFFFF1A (10% white)
                border: Border.all(
                  color: const Color(
                    0x33FFFFFF,
                  ), // ✅ Figma: #FFFFFF33 (20% white)
                  width: 1, // ✅ Figma border-width: 1px
                ),
              ),
            ),
          ),

          // ✅ Back Button - Exact Figma positioning
          Positioned(
            top: 24.21, // ✅ Figma: top: 48.21px - SafeArea adjustment
            left: 34.6, // ✅ Figma: left: 34.6px
            child: GestureDetector(
              onTap: () {
                // ✅ GoRouter ile geri dön
                if (Navigator.of(context).canPop()) {
                  Navigator.of(context).pop();
                } else {
                  // Fallback: Profil sayfasına git
                  context.go('/profile');
                }
              },
              child: Container(
                width: 24, // ✅ Figma width
                height: 24, // ✅ Figma height
                decoration: const BoxDecoration(color: Colors.transparent),
                child: const Icon(
                  Icons.arrow_back_ios,
                  size: 15, // ✅ Figma inner icon size
                  color: Color(0xFFFFFFFF), // ✅ Figma white color
                ),
              ),
            ),
          ),

          // ✅ Title - Exact Figma positioning
          Positioned(
            top: 26, // ✅ Figma: top: 50px - SafeArea adjustment
            left: 156.47, // ✅ Figma: left: 156.47px
            child: SizedBox(
              width: 88, // ✅ Figma width
              height: 19, // ✅ Figma height
              child: const Text(
                'Profil Detayı',
                textAlign: TextAlign.center, // ✅ Figma text-align: center
                style: TextStyle(
                  fontFamily: 'Euclid Circular A', // ✅ Figma font-family
                  fontSize: 15, // ✅ Figma font-size
                  fontWeight: FontWeight.w500, // ✅ Figma font-weight: Medium
                  color: Color(0xFFFFFFFF), // ✅ Figma white color
                  height: 1.0, // ✅ Figma line-height: 100%
                  letterSpacing: 0, // ✅ Figma letter-spacing: 0%
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ✅ Main Title - Düzeltilmiş (Positioned kaldırıldı)
  Widget _buildTitle() {
    return Container(
      width: 208, // ✅ Figma width
      height: 23, // ✅ Figma height
      alignment: Alignment.center,
      child: const Text(
        'Fotoğraflarınızı Yükleyin',
        textAlign: TextAlign.center, // ✅ Figma text-align: center
        style: TextStyle(
          fontFamily: 'Euclid Circular A', // ✅ Figma font-family
          fontSize: 18, // ✅ Figma font-size
          fontWeight: FontWeight.w600, // ✅ Figma SemiBold
          color: Color(0xFFFFFFFF), // ✅ Figma white color
          height: 1.0, // ✅ Figma line-height: 100%
          letterSpacing: 0, // ✅ Figma letter-spacing: 0%
        ),
      ),
    );
  }

  // ✅ Subtitle - Exact Figma specs
  Widget _buildSubtitle() {
    return Container(
      width: 188.64682006835938, // ✅ Figma width
      height: 31, // ✅ Figma height
      alignment: Alignment.center,
      child: const Text(
        'Resources out incentivize relaxation floor loss cc.',
        textAlign: TextAlign.center, // ✅ Figma text-align: center
        style: TextStyle(
          fontFamily: 'Euclid Circular A', // ✅ Figma font-family
          fontSize: 13, // ✅ Figma font-size
          fontWeight: FontWeight.w400, // ✅ Figma Regular
          color: Color(0xFFFFFFFF), // ✅ Figma white color
          height: 1.0, // ✅ Figma line-height: 100%
          letterSpacing: 0, // ✅ Figma letter-spacing: 0%
        ),
      ),
    );
  }

  // ✅ Photo Upload Area - Exact Figma specs
  Widget _buildPhotoUploadArea() {
    return GestureDetector(
      onTap: _showImagePickerDialog,
      child: Container(
        width: 168.94888305664062, // ✅ Figma width
        height: 164.29891967773438, // ✅ Figma height
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(31), // ✅ Figma border-radius
          color: const Color(0x1AFFFFFF), // ✅ Figma: #FFFFFF1A (10% white)
          border: Border.all(
            color: const Color(0x1AFFFFFF), // ✅ Figma border color
            width: 1.55, // ✅ Figma border-width: 1.55px
          ),
        ),
        child:
            _selectedImage != null
                ? ClipRRect(
                  borderRadius: BorderRadius.circular(31),
                  child: Image.file(
                    _selectedImage!,
                    fit: BoxFit.cover,
                    width: double.infinity,
                    height: double.infinity,
                  ),
                )
                : Stack(
                  children: [
                    // ✅ Plus Icon - Exact Figma positioning
                    Positioned(
                      top:
                          39.06, // ✅ Calculated from Figma: 267.44 - 227.92 = 39.52
                      left:
                          41.85, // ✅ Calculated from Figma: 158.38 - 116.53 = 41.85
                      child: Container(
                        width: 85.24943542480469, // ✅ Figma width
                        height: 85.24943542480469, // ✅ Figma height
                        child: const Icon(
                          Icons.add,
                          size: 40, // ✅ Adjusted for visual balance
                          color: Color(
                            0x80FFFFFF,
                          ), // ✅ Figma: 50% white opacity
                        ),
                      ),
                    ),
                  ],
                ),
      ),
    );
  }

  // ✅ Continue Button - Exact Figma specs
  Widget _buildContinueButton() {
    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        final isUploading = state is ProfilePhotoUploading;

        return Container(
          width: 350, // ✅ Figma width
          height: 53.310001373291016, // ✅ Figma height
          margin: const EdgeInsets.symmetric(
            horizontal: 26,
          ), // ✅ Figma positioning
          child: ElevatedButton(
            onPressed:
                isUploading
                    ? null
                    : () {
                      // ✅ Her durumda profil sayfasına git
                      if (_selectedImage != null) {
                        // Fotoğraf varsa önce upload et
                        _uploadPhoto();
                        // Upload sonrası BlocListener ile profil sayfasına gidecek
                      } else {
                        // ✅ Fotoğraf yoksa da refresh ile profil sayfasına git
                        _navigateToProfileWithRefresh();
                      }
                    },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE50914), // ✅ Figma brand color
              foregroundColor: const Color(0xFFFFFFFF), // ✅ Figma white text
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(
                  18,
                ), // ✅ Figma border-radius
              ),
              padding: const EdgeInsets.fromLTRB(
                16,
                8,
                16,
                8,
              ), // ✅ Figma padding
              elevation: 0,
            ),
            child:
                isUploading
                    ? const CircularProgressIndicator(
                      color: Color(0xFFFFFFFF),
                      strokeWidth: 2,
                    )
                    : const Text(
                      'Devam Et', // ✅ PDF'deki orijinal metin - değişmez
                      style: TextStyle(
                        fontFamily: 'Euclid Circular A', // ✅ Figma font-family
                        fontSize: 15, // ✅ Figma font-size
                        fontWeight: FontWeight.w500, // ✅ Figma Medium
                        height: 1.0, // ✅ Figma line-height: 100%
                        letterSpacing: 0, // ✅ Figma letter-spacing: 0%
                      ),
                    ),
          ),
        );
      },
    );
  }

  void _showImagePickerDialog() {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: const Color(0xFF090909),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            title: const Text(
              'Fotoğraf Seç',
              style: TextStyle(
                color: Color(0xFFFFFFFF),
                fontFamily: 'Euclid Circular A',
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // ✅ Camera Option
                ListTile(
                  leading: const Icon(
                    Icons.camera_alt,
                    color: Color(0xFFFFFFFF),
                    size: 24,
                  ),
                  title: const Text(
                    'Kamera',
                    style: TextStyle(
                      color: Color(0xFFFFFFFF),
                      fontFamily: 'Euclid Circular A',
                      fontSize: 16,
                    ),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    _pickImage(ImageSource.camera);
                  },
                ),

                // ✅ Gallery Option
                ListTile(
                  leading: const Icon(
                    Icons.photo_library,
                    color: Color(0xFFFFFFFF),
                    size: 24,
                  ),
                  title: const Text(
                    'Galeri',
                    style: TextStyle(
                      color: Color(0xFFFFFFFF),
                      fontFamily: 'Euclid Circular A',
                      fontSize: 16,
                    ),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    _pickImage(ImageSource.gallery);
                  },
                ),
              ],
            ),
          ),
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? image = await _picker.pickImage(
        source: source,
        imageQuality: 80,
        maxWidth: 1024,
        maxHeight: 1024,
      );

      if (image != null) {
        final file = File(image.path);
        final fileSize = await file.length();

        // File size validation (5MB limit)
        if (fileSize > 5 * 1024 * 1024) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Dosya boyutu 5MB\'dan küçük olmalıdır'),
              backgroundColor: Color(0xFFE50914),
            ),
          );
          return;
        }

        // File format validation
        final extension = image.path.split('.').last.toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'webp'].contains(extension)) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Sadece JPG, PNG ve WebP formatları desteklenir'),
              backgroundColor: Color(0xFFE50914),
            ),
          );
          return;
        }

        setState(() {
          _selectedImage = file;
        });

        // Success feedback
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Fotoğraf başarıyla seçildi',
              style: TextStyle(fontFamily: 'Euclid Circular A', fontSize: 14),
            ),
            backgroundColor: Color(0xFF4CAF50),
            duration: Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Fotoğraf seçilirken hata oluştu: $e',
            style: const TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 14,
            ),
          ),
          backgroundColor: const Color(0xFFE50914),
        ),
      );
    }
  }

  void _uploadPhoto() {
    if (_selectedImage != null) {
      print('🚀 Starting photo upload and navigation');

      // ✅ Upload işlemini başlat
      context.read<ProfileBloc>().add(
        UploadPhotoEvent(imageFile: _selectedImage!),
      );

      // ✅ Upload başladıktan sonra 3 saniye bekleyip profil sayfasına git
      Future.delayed(const Duration(seconds: 1), () {
        print('⏰ Timeout reached - navigating to profile with refresh');
        if (mounted) {
          // ✅ Timeout durumunda da refresh ile git
          _navigateToProfileWithRefresh();
        }
      });
    }
  }

  // ✅ Profil sayfasına refresh ile geçiş metodu
  void _navigateToProfileWithRefresh() {
    print('🔄 Navigating to profile with refresh signal');
    context.go(
      '${AppRoutes.profile}?refresh=true&timestamp=${DateTime.now().millisecondsSinceEpoch}',
    );
  }
}
