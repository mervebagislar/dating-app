// lib/shared/widgets/bottom_navigation_shell.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/app_colors.dart';
import '../../core/navigation/app_routes.dart';

class BottomNavigationShell extends StatelessWidget {
  final Widget child;
  final String currentRoute;

  const BottomNavigationShell({
    super.key,
    required this.child,
    required this.currentRoute,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: child,
      bottomNavigationBar: _buildBottomNavigation(context),
    );
  }

  Widget _buildBottomNavigation(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 71.10,
      decoration: const BoxDecoration(
        color: Color(0xFF090909),
        border: Border(top: BorderSide(color: Color(0xFF333333), width: 0.5)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 67.96),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildNavButton(
                context: context,
                title: 'Anasayfa',
                icon: Icons.home_outlined,
                isSelected: currentRoute == AppRoutes.home,
                onTap: () => context.go(AppRoutes.home),
              ),
              _buildNavButton(
                context: context,
                title: 'Profil',
                icon: Icons.person_outline,
                isSelected: currentRoute == AppRoutes.profile,
                onTap: () => context.go(AppRoutes.profile),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavButton({
    required BuildContext context,
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 125.04,
        height: 40.92,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0x33FFFFFF), width: 1),
          color: isSelected ? const Color(0x1AFFFFFF) : Colors.transparent,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 28,
              height: 28,
              child: Icon(icon, size: 22.17, color: Colors.white),
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                title,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontFamily: 'Euclid Circular A',
                  fontWeight: FontWeight.w500,
                  fontSize: 12,
                  height: 1.0,
                  letterSpacing: 0,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
