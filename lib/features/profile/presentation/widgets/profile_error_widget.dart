import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../bloc/profile_bloc.dart';
import '../bloc/profile_event.dart';
import '../bloc/profile_state.dart';

class ProfileErrorWidget extends StatelessWidget {
  final ProfileError error;
  final VoidCallback? onRetry;
  final VoidCallback? onDismiss;

  const ProfileErrorWidget({
    super.key,
    required this.error,
    this.onRetry,
    this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.error.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.error.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Error Icon
          Icon(
            _getErrorIcon(),
            size: 32,
            color: AppColors.error,
          ),
          
          const SizedBox(height: 12),
          
          // Error Title
          Text(
            _getErrorTitle(),
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.white,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 8),
          
          // Error Message
          Text(
            error.message,
            style: TextStyle(
              fontSize: 14,
              color: AppColors.white.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
          ),
          
          // Validation Errors
          if (error.validationErrors != null) ...[
            const SizedBox(height: 12),
            _buildValidationErrors(),
          ],
          
          const SizedBox(height: 16),
          
          // Action Buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              if (onDismiss != null)
                TextButton(
                  onPressed: onDismiss,
                  child: Text(
                    'Kapat',
                    style: TextStyle(
                      color: AppColors.white.withOpacity(0.7),
                    ),
                  ),
                ),
              
              if (error.canRetry && onRetry != null)
                ElevatedButton(
                  onPressed: onRetry,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.white,
                  ),
                  child: const Text('Tekrar Dene'),
                ),
            ],
          ),
        ],
      ),
    );
  }

  IconData _getErrorIcon() {
    switch (error.errorType) {
      case ProfileErrorType.network:
        return Icons.wifi_off;
      case ProfileErrorType.server:
        return Icons.cloud_off; // ✅ FIXED: server_error yerine cloud_off
      case ProfileErrorType.authentication:
        return Icons.lock_outline;
      case ProfileErrorType.validation:
        return Icons.warning_amber;
      case ProfileErrorType.file:
        return Icons.file_present_outlined;
      default:
        return Icons.error_outline;
    }
  }

  String _getErrorTitle() {
    switch (error.errorType) {
      case ProfileErrorType.network:
        return 'Bağlantı Hatası';
      case ProfileErrorType.server:
        return 'Sunucu Hatası';
      case ProfileErrorType.authentication:
        return 'Kimlik Doğrulama Hatası';
      case ProfileErrorType.validation:
        return 'Doğrulama Hatası';
      case ProfileErrorType.file:
        return 'Dosya Hatası';
      default:
        return 'Hata Oluştu';
    }
  }

  Widget _buildValidationErrors() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.warning.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: AppColors.warning.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Düzeltilmesi gereken alanlar:',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.warning,
            ),
          ),
          const SizedBox(height: 8),
          ...error.validationErrors!.entries.map((entry) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '• ',
                    style: TextStyle(
                      color: AppColors.warning,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      '${entry.key}: ${entry.value.join(', ')}',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.white.withOpacity(0.9),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
