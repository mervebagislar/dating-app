import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../bloc/profile_state.dart';

class ProfileFileErrorWidget extends StatelessWidget {
  final ProfileFileError error;
  final VoidCallback? onRetry;
  final VoidCallback? onSelectNewFile;

  const ProfileFileErrorWidget({
    super.key,
    required this.error,
    this.onRetry,
    this.onSelectNewFile,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.warning.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.warning.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _getFileErrorIcon(),
            size: 32,
            color: AppColors.warning,
          ),
          
          const SizedBox(height: 12),
          
          Text(
            _getFileErrorTitle(),
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.white,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 8),
          
          Text(
            error.message,
            style: TextStyle(
              fontSize: 14,
              color: AppColors.white.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 16),
          
          // Action buttons based on error type
          _buildActionButtons(),
        ],
      ),
    );
  }

  IconData _getFileErrorIcon() {
    switch (error.fileErrorType) {
      case FileErrorType.tooLarge:
        return Icons.file_copy_outlined;
      case FileErrorType.invalidFormat:
        return Icons.image_not_supported;
      case FileErrorType.notFound:
        return Icons.file_present_outlined;
      case FileErrorType.permissionDenied:
        return Icons.lock_outline;
      default:
        return Icons.error_outline;
    }
  }

  String _getFileErrorTitle() {
    switch (error.fileErrorType) {
      case FileErrorType.tooLarge:
        return 'Dosya Çok Büyük';
      case FileErrorType.invalidFormat:
        return 'Geçersiz Format';
      case FileErrorType.notFound:
        return 'Dosya Bulunamadı';
      case FileErrorType.permissionDenied:
        return 'İzin Hatası';
      default:
        return 'Dosya Hatası';
    }
  }

  Widget _buildActionButtons() {
    switch (error.fileErrorType) {
      case FileErrorType.invalidFormat:
      case FileErrorType.notFound:
      case FileErrorType.permissionDenied:
        // These errors need a new file selection
        return ElevatedButton.icon(
          onPressed: onSelectNewFile,
          icon: const Icon(Icons.photo_library),
          label: const Text('Yeni Dosya Seç'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.white,
          ),
        );
      
      default:
        // Other errors can be retried
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            if (onSelectNewFile != null)
              ElevatedButton.icon(
                onPressed: onSelectNewFile,
                icon: const Icon(Icons.photo_library),
                label: const Text('Yeni Dosya'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.grey600,
                  foregroundColor: AppColors.white,
                ),
              ),
            
            if (onRetry != null)
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Tekrar Dene'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.white,
                ),
              ),
          ],
        );
    }
  }
}