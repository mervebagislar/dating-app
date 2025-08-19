// lib/features/auth/presentation/widgets/login_footer_widget.dart
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class LoginFooterWidget extends StatelessWidget {
  const LoginFooterWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Bir hesabın yok mu? ',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: AppColors.white.withOpacity(0.5),
            height: 1.5,
          ),
        ),
        TextButton(
          onPressed: () {
            // Navigate to register - implement navigation
          },
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            minimumSize: Size.zero,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
          child: const Text(
            'Kayıt Ol!',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: AppColors.white,
              height: 1.5,
            ),
          ),
        ),
      ],
    );
  }
}