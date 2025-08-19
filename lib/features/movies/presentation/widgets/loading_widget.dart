// lib/features/movies/presentation/widgets/loading_widget.dart
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class MovieLoadingWidget extends StatefulWidget {
  const MovieLoadingWidget({super.key});

  @override
  State<MovieLoadingWidget> createState() => _MovieLoadingWidgetState();
}

class _MovieLoadingWidgetState extends State<MovieLoadingWidget>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              return Transform.scale(
                scale: 0.8 + (0.2 * _animation.value),
                child: const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                  strokeWidth: 3,
                ),
              );
            },
          ),
          const SizedBox(height: 20),
          const Text(
            'Filmler yükleniyor...',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}