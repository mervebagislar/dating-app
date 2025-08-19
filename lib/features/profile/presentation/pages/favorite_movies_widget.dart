// lib/features/profile/presentation/pages/favorite_movies_widget.dart - STATISTICS REMOVED
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/navigation/app_routes.dart';
import '../bloc/favorite_movies_bloc.dart';
import '../bloc/favorite_movies_event.dart';
import '../bloc/favorite_movies_state.dart';
import '../../../movies/domain/entities/movie_entity.dart';

class FavoriteMoviesWidget extends StatelessWidget {
  const FavoriteMoviesWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FavoriteMoviesBloc, FavoriteMoviesState>(
      builder: (context, state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Title (kept as is)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Beğendiğim Filmler',
                style: TextStyle(
                  fontFamily: 'Euclid Circular A',
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.white,
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Movies Content (statistics section removed)
            if (state is FavoriteMoviesLoading)
              const _LoadingWidget()
            else if (state is FavoriteMoviesError &&
                (state.movies == null || state.movies!.isEmpty))
              _ErrorWidget(message: state.message)
            else if (state is FavoriteMoviesLoaded && state.movies.isEmpty)
              const _EmptyFavoritesWidget()
            else
              _MoviesGridWidget(
                movies: _getMoviesFromState(state),
                isRefreshing: state is FavoriteMoviesRefreshing,
              ),
          ],
        );
      },
    );
  }

  List<MovieEntity> _getMoviesFromState(FavoriteMoviesState state) {
    if (state is FavoriteMoviesLoaded) {
      return state.movies;
    } else if (state is FavoriteMoviesRefreshing) {
      return state.movies;
    } else if (state is FavoriteMoviesError && state.movies != null) {
      return state.movies!;
    }
    return [];
  }

  // ❌ REMOVED: Statistics methods (_buildStatisticsRow and _buildStatItem)
  // These methods have been completely removed as requested
}

class _LoadingWidget extends StatelessWidget {
  const _LoadingWidget();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
        ),
      ),
    );
  }
}

class _ErrorWidget extends StatelessWidget {
  final String message;

  const _ErrorWidget({required this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(
              Icons.error_outline,
              size: 48,
              color: AppColors.error.withOpacity(0.7),
            ),
            const SizedBox(height: 16),
            Text(
              'Favoriler yüklenemedi',
              style: TextStyle(
                color: AppColors.white.withOpacity(0.8),
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: TextStyle(
                color: AppColors.white.withOpacity(0.6),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                context.read<FavoriteMoviesBloc>().add(
                  const LoadFavoriteMoviesEvent(),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.white,
              ),
              child: const Text('Tekrar Dene'),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyFavoritesWidget extends StatelessWidget {
  const _EmptyFavoritesWidget();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(
              Icons.favorite_border,
              size: 64,
              color: AppColors.white.withOpacity(0.3),
            ),
            const SizedBox(height: 16),
            Text(
              'Henüz beğendiğiniz film yok',
              style: TextStyle(
                color: AppColors.white.withOpacity(0.7),
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Ana sayfadan filmleri beğenmeye başlayın',
              style: TextStyle(
                color: AppColors.white.withOpacity(0.5),
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Navigate to home
                Navigator.pushReplacementNamed(context, AppRoutes.home);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                'Filmleri Keşfet',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MoviesGridWidget extends StatelessWidget {
  final List<MovieEntity> movies;
  final bool isRefreshing;

  const _MoviesGridWidget({required this.movies, required this.isRefreshing});

  @override
  Widget build(BuildContext context) {
    print(
      '🎬 Profile: Building grid for ${movies.length} movies',
    ); // ✅ DEBUG LOG

    return Padding(
      padding: const EdgeInsets.only(left: 40.04),
      child: Column(
        children: [
          if (isRefreshing)
            const Padding(
              padding: EdgeInsets.only(bottom: 16),
              child: LinearProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                backgroundColor: AppColors.grey600,
              ),
            ),

          // Movies Grid
          ...List.generate((movies.length / 2).ceil(), (rowIndex) {
            final startIndex = rowIndex * 2;
            final endIndex = (startIndex + 2).clamp(0, movies.length);

            return Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // First movie
                    if (startIndex < movies.length)
                      _MovieCard(movie: movies[startIndex]),

                    const SizedBox(width: 15.71),

                    // Second movie
                    if (startIndex + 1 < movies.length)
                      _MovieCard(movie: movies[startIndex + 1])
                    else
                      Container(width: 153.12716674804688),
                  ],
                ),

                if (rowIndex < (movies.length / 2).ceil() - 1)
                  const SizedBox(height: 30.42),
              ],
            );
          }),
        ],
      ),
    );
  }
}

class _MovieCard extends StatelessWidget {
  final MovieEntity movie;

  const _MovieCard({required this.movie});

  @override
  Widget build(BuildContext context) {
    // ✅ DEBUG: Log each movie being built
    print('🎬 Profile: Building movie card for: ${movie.title}');
    print('🎬 Profile: Movie poster URL: ${movie.posterUrl}');

    return GestureDetector(
      onTap: () {
        // Navigate to movie details
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${movie.title ?? "Film"} detayları yakında...'),
            backgroundColor: AppColors.grey600,
          ),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Movie Poster - ✅ FIXED POSTER LOADING
          Container(
            width: 153.12716674804688,
            height: 213.82337951660156,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(2),
              color: AppColors.grey600,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: _buildMoviePoster(movie),
            ),
          ),

          const SizedBox(height: 16),

          // Movie Title
          SizedBox(
            width: 119,
            height: 15,
            child: Text(
              movie.title ?? 'Bilinmeyen Film',
              style: const TextStyle(
                fontFamily: 'Euclid Circular A',
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.white,
                height: 1.0,
                letterSpacing: 0,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          // Movie Year
          SizedBox(
            width: 73,
            height: 18,
            child: Text(
              movie.year ?? 'Bilinmeyen',
              style: const TextStyle(
                fontFamily: 'Euclid Circular A',
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: Color(0x80FFFFFF),
                height: 1.5,
                letterSpacing: 0,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  // ✅ FIXED: Proper poster loading with HTTP to HTTPS conversion
  Widget _buildMoviePoster(MovieEntity movie) {
    // ✅ Use posterUrl with HTTP to HTTPS conversion
    String? imageUrl = movie.posterUrl;

    if (imageUrl != null && imageUrl.isNotEmpty) {
      // ✅ HTTP TO HTTPS conversion (IMDB images require HTTPS)
      if (imageUrl.startsWith('http://')) {
        imageUrl = imageUrl.replaceFirst('http://', 'https://');
        print('🔒 Converted HTTP to HTTPS: $imageUrl');
      }

      return CachedNetworkImage(
        imageUrl: imageUrl,
        fit: BoxFit.cover,
        placeholder:
            (context, url) => const _MoviePosterPlaceholder(isLoading: true),
        errorWidget: (context, url, error) {
          print('❌ Poster image error for ${movie.title}: $error');
          print('❌ Failed poster URL: $url');
          return const _MoviePosterPlaceholder(hasError: true);
        },
        httpHeaders: _getImageHeaders(imageUrl),
        filterQuality: FilterQuality.high,
        fadeInDuration: const Duration(milliseconds: 300),
        fadeOutDuration: const Duration(milliseconds: 100),
        maxHeightDiskCache: 1000,
        maxWidthDiskCache: 1000,
      );
    } else {
      print('❌ No poster URL available for: ${movie.title}');
      return const _MoviePosterPlaceholder();
    }
  }

  // ✅ DYNAMIC HEADERS: Different headers for different domains
  Map<String, String> _getImageHeaders(String imageUrl) {
    if (imageUrl.contains('ia.media-imdb.com')) {
      // ✅ IMDB SPECIFIC HEADERS: Try to bypass 403
      return {
        'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
        'Accept': 'image/webp,image/apng,image/jpeg,image/png,*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.imdb.com/',
        'Origin': 'https://www.imdb.com',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Dest': 'image',
        'Cache-Control': 'max-age=3600',
        'Connection': 'keep-alive',
      };
    } else if (imageUrl.contains('media-amazon.com')) {
      // ✅ AMAZON SPECIFIC HEADERS
      return {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept':
            'image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.amazon.com/',
        'Cache-Control': 'no-cache',
      };
    } else {
      // ✅ GENERIC HEADERS
      return {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/jpeg,image/png,*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
      };
    }
  }
}

class _MoviePosterPlaceholder extends StatelessWidget {
  final bool isLoading;
  final bool hasError;

  const _MoviePosterPlaceholder({
    this.isLoading = false,
    this.hasError = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.grey600,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isLoading) ...[
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                strokeWidth: 2,
              ),
              const SizedBox(height: 8),
              Text(
                'Yükleniyor...',
                style: TextStyle(
                  color: AppColors.white.withOpacity(0.7),
                  fontSize: 10,
                ),
              ),
            ] else ...[
              Icon(
                hasError ? Icons.wifi_off : Icons.movie_outlined,
                size: 32,
                color: hasError ? Colors.orange : AppColors.white,
              ),
              if (hasError) ...[
                const SizedBox(height: 8),
                Text(
                  'Resim yüklenemedi',
                  style: TextStyle(
                    color: Colors.orange.withOpacity(0.8),
                    fontSize: 10,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}