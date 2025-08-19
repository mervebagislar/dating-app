// lib/features/movies/presentation/widgets/app_logo_widget.dart
import 'package:flutter/material.dart';

class AppLogoWidget extends StatelessWidget {
  const AppLogoWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 666.01,
      left: 34.5,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: const Color(0xFFE50914), // brand color
          borderRadius: BorderRadius.circular(21),
          border: Border.all(color: Colors.white, width: 1.5),
        ),
        child: Center(
          child: Image.asset(
            'assets/images/logo.png',
            width: 20.76, // Figma genişlik
            height: 17.56, // Figma yükseklik
            fit: BoxFit.contain,
          ),
        ),
      ),
    );
  }
}
