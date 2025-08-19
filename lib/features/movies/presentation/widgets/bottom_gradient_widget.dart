// lib/features/movies/presentation/widgets/bottom_gradient_widget.dart
import 'package:flutter/widgets.dart';

class BottomGradientWidget extends StatelessWidget {
  const BottomGradientWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        width: 402,
        height: 69.91,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
            colors: [
              Color(0xFF000000),
              Color(0x00000000),
            ],
          ),
        ),
      ),
    );
  }
}