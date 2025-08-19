// lib/features/movies/presentation/widgets/movie_poster_widget.dart
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/widgets.dart';
import '../../../../core/utils/logger.dart';
import '../../domain/entities/movie_entity.dart';
import 'poster_placeholder_widget.dart';

class MoviePosterWidget extends StatelessWidget {
  final MovieEntity movie;

  const MoviePosterWidget({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    String? posterUrl = _getHighestQualityImage(movie);

    if (posterUrl == null || posterUrl.isEmpty) {
      return PosterPlaceholderWidget(movie: movie);
    }

    return CachedNetworkImage(
      imageUrl: posterUrl,
      fit: BoxFit.fitHeight,
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height,
      alignment: Alignment.center,
      placeholder: (context, url) => PosterPlaceholderWidget(
        movie: movie,
        isLoading: true,
      ),
      errorWidget: (context, url, error) {
        AppLogger.e('❌ Poster image error for ${movie.title}: $error');
        return PosterPlaceholderWidget(movie: movie, hasError: true);
      },
      httpHeaders: _getImageHeaders(posterUrl),
      filterQuality: FilterQuality.high,
      fadeInDuration: const Duration(milliseconds: 300),
      fadeOutDuration: const Duration(milliseconds: 100),
      maxHeightDiskCache: 1000,
      maxWidthDiskCache: 1000,
    );
  }

  String? _getHighestQualityImage(MovieEntity movie) {
    if (movie.posterUrl != null &&
        movie.posterUrl!.isNotEmpty &&
        Uri.tryParse(movie.posterUrl!) != null) {
      
      String httpsUrl = movie.posterUrl!;
      if (httpsUrl.startsWith('http://')) {
        httpsUrl = httpsUrl.replaceFirst('http://', 'https://');
      }
      return httpsUrl;
    }
    return null;
  }

  Map<String, String> _getImageHeaders(String imageUrl) {
    if (imageUrl.contains('ia.media-imdb.com')) {
      return {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'image/webp,image/apng,image/jpeg,image/png,*/*',
        'Referer': 'https://www.imdb.com/',
      };
    }
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'image/webp,image/apng,image/jpeg,image/png,*/*',
    };
  }
}