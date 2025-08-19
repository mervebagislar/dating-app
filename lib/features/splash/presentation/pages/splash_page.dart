import 'package:dating_app/features/auth/presentation/pages/login_page.dart';
import 'package:flutter/material.dart';
import 'package:dating_app/core/constants/app_colors.dart';


class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    // 2 saniye bekleyip login sayfasına yönlendir
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginPage()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Arka plan
          Image.asset(
            'assets/images/SinFlixSplash.png',
            fit: BoxFit.cover,
          ),
          // Logo (opsiyonel)
          
        ],
      ),
    );
  }
}
