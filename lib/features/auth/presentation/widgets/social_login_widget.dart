// lib/features/auth/presentation/widgets/social_login_widget.dart
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class SocialLoginWidget extends StatelessWidget {
  const SocialLoginWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _SocialButton(icon: 'G', onTap: () => _handleSocialLogin(context, 'Google')),
        const SizedBox(width: 10),
        _SocialButton(icon: 'apple', onTap: () => _handleSocialLogin(context, 'Apple')),
        const SizedBox(width: 10),
        _SocialButton(icon: 'f', onTap: () => _handleSocialLogin(context, 'Facebook')),
      ],
    );
  }

  void _handleSocialLogin(BuildContext context, String provider) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$provider ile giriş özelliği yakında...')),
    );
  }
}

class _SocialButton extends StatelessWidget {
  final String icon;
  final VoidCallback onTap;

  const _SocialButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.white.withOpacity(0.2)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(18),
          child: Center(child: _buildIcon()),
        ),
      ),
    );
  }

  Widget _buildIcon() {
    switch (icon.toLowerCase()) {
      case 'g':
        return const Text('G', style: TextStyle(color: AppColors.white, fontSize: 20, fontWeight: FontWeight.w600));
      case 'apple':
        return const Icon(Icons.apple, color: AppColors.white, size: 24);
      case 'f':
        return const Text('f', style: TextStyle(color: AppColors.white, fontSize: 20, fontWeight: FontWeight.w600));
      default:
        return const SizedBox();
    }
  }
}
