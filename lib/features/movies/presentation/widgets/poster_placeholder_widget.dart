// lib/features/movies/presentation/widgets/poster_placeholder_widget.dart
import 'package:flutter/material.dart';
import '../../domain/entities/movie_entity.dart';

class PosterPlaceholderWidget extends StatelessWidget {
  final MovieEntity movie;
  final bool isLoading;
  final bool hasError;

  const PosterPlaceholderWidget({
    super.key,
    required this.movie,
    this.isLoading = false,
    this.hasError = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFF1a1a1a),
            const Color(0xFF0d0d0d),
            Colors.black.withOpacity(0.9),
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isLoading) ...[
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
                strokeWidth: 3,
              ),
              const SizedBox(height: 20),
              Text(
                'Poster yükleniyor...',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.8),
                  fontSize: 14,
                  fontFamily: 'Euclid Circular A',
                  fontWeight: FontWeight.w500,
                ),
              ),
            ] else ...[
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFE50914).withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFFE50914).withOpacity(0.5),
                    width: 2,
                  ),
                ),
                child: Icon(
                  hasError ? Icons.wifi_off : Icons.movie_outlined,
                  size: 60,
                  color: hasError ? Colors.orange : const Color(0xFFE50914),
                ),
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Text(
                  movie.title,
                  textAlign: TextAlign.center,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Euclid Circular A',
                    height: 1.3,
                  ),
                ),
              ),
              if (movie.year != null) ...[
                const SizedBox(height: 8),
                Text(
                  movie.year!,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 16,
                    fontFamily: 'Euclid Circular A',
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}