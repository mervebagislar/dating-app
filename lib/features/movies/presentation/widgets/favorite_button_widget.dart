// lib/features/movies/presentation/widgets/favorite_button_widget.dart
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../domain/entities/movie_entity.dart';

class FavoriteButtonWidget extends StatelessWidget {
  final MovieEntity movie;
  final VoidCallback onToggle;

  const FavoriteButtonWidget({
    super.key,
    required this.movie,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: MediaQuery.of(context).size.height * 0.65,
      right: 16.5,
      child: GestureDetector(
        onTap: onToggle,
        child: AnimatedScale(
          scale: movie.isFavorite ? 1.1 : 1.0,
          duration: const Duration(milliseconds: 200),
          child: Container(
            width: 49.18,
            height: 71.70,
            decoration: BoxDecoration(
              color: const Color(0x33000000),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: const Color(0x33FFFFFF),
                width: 1,
              ),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                child: Center(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: Icon(
                      movie.isFavorite ? Icons.favorite : Icons.favorite_border,
                      key: ValueKey(movie.isFavorite),
                      size: 24,
                      color: movie.isFavorite ? const Color(0xFFE50914) : Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}