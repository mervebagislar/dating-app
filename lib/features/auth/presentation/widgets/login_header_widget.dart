// lib/features/auth/presentation/widgets/login_header_widget.dart
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class LoginHeaderWidget extends StatelessWidget {
  const LoginHeaderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          'Merhabalar',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.white,
            height: 1.0,
            letterSpacing: 0,
          ),
        ),
        SizedBox(height: 8),
        Text(
          'Tempus varius a vitae interdum id tortor\nelementum tristique eleifend at.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: AppColors.white,
            height: 1.0,
            letterSpacing: 0,
          ),
        ),
      ],
    );
  }
}




