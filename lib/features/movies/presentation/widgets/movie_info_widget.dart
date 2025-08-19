import 'package:flutter/material.dart';
import '../../domain/entities/movie_entity.dart';

class MovieInfoWidget extends StatelessWidget {
  final MovieEntity movie;
  final bool isDescriptionExpanded;
  final VoidCallback onToggleDescription;

  const MovieInfoWidget({
    super.key,
    required this.movie,
    required this.isDescriptionExpanded,
    required this.onToggleDescription,
  });

  @override
  Widget build(BuildContext context) {
    // Maksimum karakter sayısı
    const int maxChars = 80;
    final String plotText = movie.plot ?? '';
    final bool needTruncate = plotText.length > maxChars;

    // Başlangıçta kısaltılmış metin
    final String displayText = !isDescriptionExpanded && needTruncate
        ? plotText.substring(0, maxChars) + '...'
        : plotText;

    return Positioned(
      top: 660.79,
      left: 90.44,
      child: SizedBox(
        width: 278.21,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🎬 Movie Title
            Text(
              movie.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontFamily: 'Euclid Circular A',
                fontWeight: FontWeight.w600,
                fontSize: 18,
                height: 1.0,
                color: Colors.white,
              ),
            ),

            const SizedBox(height: 4.78),

            // 📝 Movie Description + Daha Fazlası
            if (plotText.isNotEmpty) ...[
              AnimatedSize(
                duration: const Duration(milliseconds: 300),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      displayText,
                      style: const TextStyle(
                        fontFamily: 'Euclid Circular A',
                        fontWeight: FontWeight.w400,
                        fontSize: 13,
                        height: 1.0,
                        color: Color(0xBFFFFFFF), // %75 beyaz
                      ),
                    ),
                    if (needTruncate)
                      GestureDetector(
                        onTap: onToggleDescription,
                        child: Padding(
                          padding: const EdgeInsets.only(top: 2.0),
                          child: Text(
                            isDescriptionExpanded ? 'Daha Az' : 'Daha Fazlası',
                            style: const TextStyle(
                              fontFamily: 'Euclid Circular A',
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                              height: 1.0,
                              color: Colors.white,
                              decoration: TextDecoration.underline,
                              decorationColor: Colors.white,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
