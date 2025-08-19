// lib/features/movies/presentation/pages/home/home_page.dart - FIXED FAVORITE TOGGLE
import 'package:dating_app/core/constants/app_colors.dart';
import 'package:dating_app/core/utils/logger.dart';
import 'package:dating_app/features/movies/domain/entities/movie_entity.dart';
import 'package:dating_app/features/movies/presentation/bloc/movies_bloc.dart';
import 'package:dating_app/features/movies/presentation/bloc/movies_event.dart';
import 'package:dating_app/features/movies/presentation/bloc/movies_state.dart' 
    hide MoviesState, MoviesLoading, MoviesLoaded, MoviesError;
import 'package:dating_app/features/movies/presentation/widgets/loading_widget.dart';
import 'package:dating_app/features/movies/presentation/widgets/movie_card_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const HomePageView();
  }
}

class HomePageView extends StatefulWidget {
  const HomePageView({super.key});

  @override
  State<HomePageView> createState() => _HomePageViewState();
}

class _HomePageViewState extends State<HomePageView> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;
  bool _isNearEnd = false;

  @override
  void initState() {
    super.initState();
    AppLogger.i('🏠 HomePage: Initializing');
    // ✅ REMOVED: Event call moved to router for better control
    // context.read<MoviesBloc>().add(const MoviesLoadRequested(page: 1));
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090909), // Netflix-style dark background
      body: BlocConsumer<MoviesBloc, OptimizedMoviesState>(
        listener: (context, state) {
          if (state is OptimizedMoviesError) {
            AppLogger.e('❌ HomePage: Error - ${state.message}');
            _showErrorSnackBar(context, state.message);
          } else if (state is OptimizedMoviesLoaded) {
            AppLogger.i(
              '✅ HomePage: Loaded ${state.movies.length} movies (page ${state.currentPage})',
            );
          } else if (state is OptimizedMovieFavoriteToggled) {
            // ✅ FIXED: Handle favorite toggle state properly
            AppLogger.i(
              '💖 HomePage: Favorite toggled for ${state.movieId} - now ${state.isNowFavorite ? "favorited" : "unfavorited"}',
            );
            
            // Show feedback to user
            _showFavoriteToggleFeedback(context, state.isNowFavorite, state.movieId);
          }
        },
        builder: (context, state) {
          return _buildContent(context, state);
        },
      ),
    );
  }

  Widget _buildContent(BuildContext context, OptimizedMoviesState state) {
    // ✅ Initial loading state
    if (state is OptimizedMoviesLoading) {
      return const MovieLoadingWidget();
    }

    // ✅ Error state with retry option
    if (state is OptimizedMoviesError) {
      return _buildErrorWidget(context, state.message);
    }

    // ✅ FIXED: Handle favorite toggle state - show movies with updated favorite status
    if (state is OptimizedMovieFavoriteToggled) {
      if (state.movies.isEmpty) {
        return _buildEmptyWidget();
      }
      
      return _buildMovieScroller(
        OptimizedMoviesLoaded(
          movies: state.movies,
          currentPage: 1, // Use a reasonable default
          hasNextPage: true, // Maintain scroll functionality
          isFromCache: false,
        ),
      );
    }

    // ✅ Movies loaded - build infinite scroll UI
    if (state is OptimizedMoviesLoaded) {
      if (state.movies.isEmpty) {
        return _buildEmptyWidget();
      }

      return _buildMovieScroller(state);
    }

    // ✅ Loading more state - show current movies with loading overlay
    if (state is OptimizedMoviesLoadingMore) {
      return _buildMovieScroller(
        OptimizedMoviesLoaded(
          movies: state.currentMovies,
          currentPage: 1,
          hasNextPage: true,
          isFromCache: false,
        ),
      );
    }

    // ✅ Refreshing state - show current movies with refresh indicator
    if (state is OptimizedMoviesRefreshing) {
      return _buildMovieScroller(
        OptimizedMoviesLoaded(
          movies: state.currentMovies,
          currentPage: 1,
          hasNextPage: true,
          isFromCache: false,
        ),
      );
    }

    // ✅ Fallback for unknown states
    return const SizedBox.shrink();
  }

  Widget _buildMovieScroller(OptimizedMoviesLoaded state) {
    final movies = state.movies;

    return RefreshIndicator(
      onRefresh: () async {
        AppLogger.i('🔄 HomePage: Pull to refresh triggered');
        context.read<MoviesBloc>().add(const MoviesRefreshRequested());
      },
      color: const Color(0xFFE50914), // Netflix red
      backgroundColor: const Color(0xFF090909),
      child: Stack(
        children: [
          // ✅ TikTok-style vertical PageView
          PageView.builder(
            controller: _pageController,
            scrollDirection: Axis.vertical,
            onPageChanged: (index) => _onPageChanged(index, state),
            itemCount: _getItemCount(state),
            itemBuilder: (context, index) => _buildPageItem(index, movies, state),
          ),

          // ✅ Loading overlay - sadece hasNextPage olduğunda göster
          if (state.hasNextPage && _isNearEnd) _buildLoadingMoreOverlay(),
        ],
      ),
    );
  }

  Widget _buildPageItem(
    int index,
    List<MovieEntity> movies,
    OptimizedMoviesLoaded state,
  ) {
    // ✅ Loading placeholder for next batch
    if (index >= movies.length) {
      return _buildLoadingPage(state.currentPage + 1);
    }

    // ✅ Individual movie card
    return MovieCardWidget(
      movie: movies[index],
      index: index,
      onFavoriteToggle: (movie) {
        AppLogger.i('💖 HomePage: Toggling favorite for ${movie.title}');
        context.read<MoviesBloc>().add(MovieFavoriteToggled(movieId: movie.id));
      },
    );
  }

  void _onPageChanged(int index, OptimizedMoviesLoaded state) {
    setState(() {
      _currentIndex = index;
    });

    final movie = index < state.movies.length ? state.movies[index] : null;
    if (movie != null) {
      AppLogger.d(
        '🎬 HomePage: Viewing movie ${index + 1}: ${movie.title} (${movie.id})',
      );
    }

    // ✅ Trigger load more when approaching end
    final shouldLoadMore =
        index >= state.movies.length - 2 && // Near end
        state.hasNextPage && // Has more pages
        !_isNearEnd; // Prevent multiple triggers

    if (shouldLoadMore) {
      setState(() {
        _isNearEnd = true;
      });

      AppLogger.i(
        '🔄 HomePage: Loading next batch (approaching end at index $index)',
      );
      context.read<MoviesBloc>().add(const MoviesLoadMoreRequested());

      // Reset flag after a delay
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _isNearEnd = false;
          });
        }
      });
    }
  }

  int _getItemCount(OptimizedMoviesLoaded state) {
    // Sonraki sayfanın yüklenmekte olduğunu göstermek için itemCount'a 1 ekle
    return state.movies.length + (state.hasNextPage ? 1 : 0);
  }

  Widget _buildLoadingPage(int nextPage) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: const Color(0xFF090909),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
              strokeWidth: 3,
            ),
            const SizedBox(height: 20),
            Text(
              'Yeni filmler yükleniyor...',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 18,
                fontFamily: 'Euclid Circular A',
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Sayfa $nextPage',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 14,
                fontFamily: 'Euclid Circular A',
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingMoreOverlay() {
    return Positioned(
      bottom: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.8),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
                strokeWidth: 2,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'Yükleniyor...',
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 12,
                fontFamily: 'Euclid Circular A',
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorWidget(BuildContext context, String message) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: const Color(0xFF090909),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFE50914).withOpacity(0.1),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFFE50914).withOpacity(0.3),
                    width: 2,
                  ),
                ),
                child: const Icon(
                  Icons.error_outline,
                  size: 64,
                  color: Color(0xFFE50914),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Bir hata oluştu',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  fontFamily: 'Euclid Circular A',
                ),
              ),
              const SizedBox(height: 8),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  color: Colors.white70,
                  fontFamily: 'Euclid Circular A',
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () {
                  AppLogger.i('🔄 HomePage: Retrying after error');
                  context.read<MoviesBloc>().add(
                    const MoviesRefreshRequested(),
                  );
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Yeniden Dene'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE50914),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyWidget() {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: const Color(0xFF090909),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.movie_outlined,
              size: 80,
              color: Colors.white.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'Henüz film yüklenmedi',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 18,
                fontFamily: 'Euclid Circular A',
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Filmleri yüklemek için yenileyin',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 14,
                fontFamily: 'Euclid Circular A',
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ✅ ADDED: Show favorite toggle feedback to user
  void _showFavoriteToggleFeedback(BuildContext context, bool isNowFavorite, String movieId) {
    // Don't show snackbar, use a subtle toast instead
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    
    // Clear any existing snackbars
    scaffoldMessenger.clearSnackBars();
    
    // Show feedback for a short duration
    scaffoldMessenger.showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isNowFavorite ? Icons.favorite : Icons.favorite_border,
              color: isNowFavorite ? const Color(0xFFE50914) : Colors.white,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text(
              isNowFavorite ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı',
              style: const TextStyle(
                fontFamily: 'Euclid Circular A',
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        backgroundColor: Colors.black.withOpacity(0.8),
        duration: const Duration(milliseconds: 1000), // Short duration
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        margin: const EdgeInsets.only(
          bottom: 100, // Position higher so it doesn't interfere with UI
          left: 16,
          right: 16,
        ),
      ),
    );
  }

  void _showErrorSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.error,
        duration: const Duration(seconds: 3),
        action: SnackBarAction(
          label: 'Yeniden Dene',
          textColor: Colors.white,
          onPressed: () {
            context.read<MoviesBloc>().add(const MoviesRefreshRequested());
          },
        ),
      ),
    );
  }
}