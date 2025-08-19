// lib/features/movies/presentation/bloc/optimized_movies_bloc.dart - PERSISTENT FAVORITES
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:rxdart/rxdart.dart';
import '../../../../core/utils/logger.dart';
import '../../domain/entities/movie_entity.dart';
import '../../domain/usecases/get_movies_usecase.dart';
import '../../domain/usecases/toggle_favorite_usecase.dart';
import '../../domain/usecases/get_favorite_movies_usecase.dart';
import '../../domain/usecases/search_movies_usecase.dart';
import '../../../../core/usecases/usecases.dart'; // NoParams için
// ✅ IMPORT EVENTS FROM SEPARATE FILE
import 'movies_event.dart';

// ✅ STATES - Fixed naming to avoid conflicts
abstract class OptimizedMoviesState extends Equatable {
  const OptimizedMoviesState();
  @override
  List<Object?> get props => [];
}

class OptimizedMoviesInitial extends OptimizedMoviesState {
  const OptimizedMoviesInitial();
}

class OptimizedMoviesLoading extends OptimizedMoviesState {
  const OptimizedMoviesLoading();
}

class OptimizedMoviesLoaded extends OptimizedMoviesState {
  final List<MovieEntity> movies;
  final int currentPage;
  final bool hasNextPage;
  final bool isFromCache;
  final DateTime? lastUpdated;

  const OptimizedMoviesLoaded({
    required this.movies,
    required this.currentPage,
    required this.hasNextPage,
    this.isFromCache = false,
    this.lastUpdated,
  });

  @override
  List<Object?> get props => [
    movies,
    currentPage,
    hasNextPage,
    isFromCache,
    lastUpdated,
  ];

  OptimizedMoviesLoaded copyWith({
    List<MovieEntity>? movies,
    int? currentPage,
    bool? hasNextPage,
    bool? isFromCache,
    DateTime? lastUpdated,
  }) {
    return OptimizedMoviesLoaded(
      movies: movies ?? this.movies,
      currentPage: currentPage ?? this.currentPage,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      isFromCache: isFromCache ?? this.isFromCache,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}

class OptimizedMoviesLoadingMore extends OptimizedMoviesState {
  final List<MovieEntity> currentMovies;
  final double? progress;

  const OptimizedMoviesLoadingMore({
    required this.currentMovies,
    this.progress,
  });

  @override
  List<Object?> get props => [currentMovies, progress];
}

class OptimizedMoviesRefreshing extends OptimizedMoviesState {
  final List<MovieEntity> currentMovies;

  const OptimizedMoviesRefreshing({required this.currentMovies});

  @override
  List<Object?> get props => [currentMovies];
}

class OptimizedMovieFavoriteToggled extends OptimizedMoviesState {
  final List<MovieEntity> movies;
  final String movieId;
  final bool isNowFavorite;
  final DateTime timestamp;
  final int currentPage;
  final bool hasNextPage;

  OptimizedMovieFavoriteToggled({
    required this.movies,
    required this.movieId,
    required this.isNowFavorite,
    required this.currentPage,
    required this.hasNextPage,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  @override
  List<Object> get props => [movies, movieId, isNowFavorite, timestamp, currentPage, hasNextPage];
}

class OptimizedMoviesError extends OptimizedMoviesState {
  final String message;
  final List<MovieEntity>? previousMovies;
  final bool canRetry;

  const OptimizedMoviesError({
    required this.message,
    this.previousMovies,
    this.canRetry = true,
  });

  @override
  List<Object?> get props => [message, previousMovies, canRetry];
}

// ✅ OPTIMIZED BLOC WITH PERSISTENT FAVORITES
class OptimizedMoviesBloc extends Bloc<MoviesEvent, OptimizedMoviesState> {
  final GetMoviesUseCase getMoviesUseCase;
  final ToggleFavoriteUseCase toggleFavoriteUseCase;
  final GetFavoriteMoviesUseCase? getFavoriteMoviesUseCase;
  final SearchMoviesUseCase? searchMoviesUseCase;

  // ✅ INTERNAL STATE MANAGEMENT
  final List<MovieEntity> _allMovies = [];
  final Set<String> _loadedMovieIds = {};
  final Set<String> _favoriteMovieIds = {};
  int _currentPage = 0;
  bool _hasNextPage = true;
  DateTime? _lastFetchTime;
  bool _favoritesLoaded = false; // ✅ NEW: Track if favorites are loaded
  
  // ✅ DEBOUNCING FOR RAPID ACTIONS
  Timer? _debounceTimer;
  static const Duration _debounceDuration = Duration(milliseconds: 300);

  // ✅ ADDED: Performance optimization constants
  static const int _maxCacheSize = 100;
  static const Duration _cacheCleanupInterval = Duration(minutes: 10);

  OptimizedMoviesBloc({
    required this.getMoviesUseCase,
    required this.toggleFavoriteUseCase,
    this.getFavoriteMoviesUseCase,
    this.searchMoviesUseCase,
  }) : super(const OptimizedMoviesInitial()) {
    on<MoviesLoadRequested>(_onMoviesLoadRequested);
    on<MoviesLoadMoreRequested>(
      _onMoviesLoadMoreRequested,
      transformer: _debounceTransformer(),
    );
    on<MovieFavoriteToggled>(
      _onMovieFavoriteToggled,
      transformer: _debounceTransformer(),
    );
    on<MoviesRefreshRequested>(_onMoviesRefreshRequested);

    // ✅ NEW EVENT HANDLERS
    on<FavoriteMoviesLoadRequested>(_onFavoriteMoviesLoadRequested);
    on<MoviesSearchRequested>(
      _onMoviesSearchRequested,
      transformer: _debounceTransformer(),
    );
    on<MoviesSearchCleared>(_onMoviesSearchCleared);
  }

  // ✅ DEBOUNCE TRANSFORMER
  EventTransformer<T> _debounceTransformer<T>() {
    return (events, mapper) =>
        events.debounceTime(_debounceDuration).switchMap(mapper);
  }

  Future<void> _onMoviesLoadRequested(
    MoviesLoadRequested event,
    Emitter<OptimizedMoviesState> emit,
  ) async {
    if (state is OptimizedMoviesLoading || state is OptimizedMoviesLoadingMore || state is OptimizedMoviesRefreshing) {
      AppLogger.w('[MoviesBloc] Ignoring MoviesLoadRequested - a fetch is already in progress.');
      return;
    }

    if (event.page == 1 && _allMovies.isNotEmpty && !event.isRefresh) {
      AppLogger.i('[MoviesBloc] Page 1 already loaded, skipping duplicate call');
      return;
    }

    // ✅ LOAD FAVORITES FIRST - Only on first load or refresh
    if (!_favoritesLoaded || event.isRefresh) {
      await _loadUserFavorites();
    }

    if (_shouldUseCachedData(event.page)) {
      final cachedMovies = _getMoviesForPage(event.page);
      emit(
        OptimizedMoviesLoaded(
          movies: cachedMovies,
          currentPage: event.page,
          hasNextPage: _hasNextPage,
          isFromCache: true,
        ),
      );
      return;
    }

    if (!event.isRefresh && _allMovies.isEmpty) {
      emit(const OptimizedMoviesLoading());
    } else if (event.isRefresh) {
      emit(OptimizedMoviesRefreshing(currentMovies: _allMovies));
    }

    await _fetchMovies(event.page, emit, isRefresh: event.isRefresh);
  }

  Future<void> _onMoviesLoadMoreRequested(
    MoviesLoadMoreRequested event,
    Emitter<OptimizedMoviesState> emit,
  ) async {
    if (!_hasNextPage || state is OptimizedMoviesLoadingMore) {
      AppLogger.w('[MoviesBloc] Cannot load more - hasNext: $_hasNextPage, state: ${state.runtimeType}');
      return;
    }

    AppLogger.i('[MoviesBloc] Loading more movies - next page: ${_currentPage + 1}');
    emit(OptimizedMoviesLoadingMore(currentMovies: _allMovies));
    await _fetchMovies(_currentPage + 1, emit, isLoadMore: true);
  }

  Future<void> _onMoviesRefreshRequested(
    MoviesRefreshRequested event,
    Emitter<OptimizedMoviesState> emit,
  ) async {
    _clearCache();
    add(const MoviesLoadRequested(page: 1, isRefresh: true));
  }

  Future<void> _onMovieFavoriteToggled(
    MovieFavoriteToggled event,
    Emitter<OptimizedMoviesState> emit,
  ) async {
    // ✅ OPTIMISTIC UPDATE - Immediate UI feedback
    final wasAlreadyFavorite = _favoriteMovieIds.contains(event.movieId);

    if (wasAlreadyFavorite) {
      _favoriteMovieIds.remove(event.movieId);
    } else {
      _favoriteMovieIds.add(event.movieId);
    }

    final updatedMovies = _updateMoviesWithFavoriteStatus();

    // ✅ FIXED: Emit OptimizedMoviesLoaded instead of OptimizedMovieFavoriteToggled
    emit(
      OptimizedMoviesLoaded(
        movies: updatedMovies,
        currentPage: _currentPage,
        hasNextPage: _hasNextPage,
        isFromCache: false,
        lastUpdated: DateTime.now(),
      ),
    );

    // ✅ Show quick feedback in logs
    AppLogger.i('💖 [MoviesBloc] Favorite ${wasAlreadyFavorite ? "removed" : "added"} for ${event.movieId}');

    // ✅ BACKGROUND API CALL
    final result = await toggleFavoriteUseCase(
      ToggleFavoriteParams(movieId: event.movieId),
    );

    result.fold(
      (failure) {
        // ✅ REVERT OPTIMISTIC UPDATE ON FAILURE
        if (wasAlreadyFavorite) {
          _favoriteMovieIds.add(event.movieId);
        } else {
          _favoriteMovieIds.remove(event.movieId);
        }

        // Re-emit the corrected state
        final revertedMovies = _updateMoviesWithFavoriteStatus();
        emit(
          OptimizedMoviesLoaded(
            movies: revertedMovies,
            currentPage: _currentPage,
            hasNextPage: _hasNextPage,
            isFromCache: false,
            lastUpdated: DateTime.now(),
          ),
        );

        // Show error
        emit(
          OptimizedMoviesError(
            message: 'Favori durumu güncellenemedi: ${failure.message}',
            previousMovies: _allMovies,
          ),
        );
      },
      (_) {
        // ✅ SUCCESS - State already updated optimistically
        AppLogger.i('✅ Favorite toggled successfully for ${event.movieId}');
      },
    );
  }

  // ✅ NEW: Load user's favorite movies from API
  Future<void> _loadUserFavorites() async {
    if (getFavoriteMoviesUseCase == null) {
      AppLogger.w('[MoviesBloc] GetFavoriteMoviesUseCase not available');
      return;
    }

    try {
      AppLogger.i('[MoviesBloc] Loading user favorites...');
     final result = await getFavoriteMoviesUseCase!(NoParams());
      
      result.fold(
        (failure) {
          AppLogger.e('[MoviesBloc] Failed to load favorites: ${failure.message}');
          // Don't block the main flow, just log the error
        },
        (favoriteMovies) {
          // ✅ POPULATE FAVORITE IDS FROM API
          _favoriteMovieIds.clear();
          for (final movie in favoriteMovies) {
            _favoriteMovieIds.add(movie.id);
          }
          
          _favoritesLoaded = true;
          AppLogger.i('[MoviesBloc] Loaded ${favoriteMovies.length} favorite movies: ${_favoriteMovieIds.toList()}');
        },
      );
    } catch (e) {
      AppLogger.e('[MoviesBloc] Exception loading favorites: $e');
    }
  }

  // ✅ HELPER METHODS

  bool _shouldUseCachedData(int page) {
    if (_lastFetchTime == null) return false;

    final timeSinceLastFetch = DateTime.now().difference(_lastFetchTime!);
    const cacheValidDuration = Duration(minutes: 5);

    return timeSinceLastFetch < cacheValidDuration &&
        _allMovies.isNotEmpty &&
        page <= _currentPage &&
        _isValidCache(page);
  }

  bool _isValidCache(int page) {
    final startIndex = (page - 1) * 5;
    final endIndex = startIndex + 5;

    if (_allMovies.length < endIndex) return false;

    for (int i = 1; i <= page; i++) {
      final pageStartIndex = (i - 1) * 5;
      final pageEndIndex = pageStartIndex + 5;

      if (pageEndIndex > _allMovies.length) return false;
      if (i < page && (pageEndIndex - pageStartIndex) != 5) return false;
    }

    return true;
  }

  List<MovieEntity> _getMoviesForPage(int page) {
    const moviesPerPage = 5;
    final startIndex = (page - 1) * moviesPerPage;
    final endIndex = (startIndex + moviesPerPage).clamp(0, _allMovies.length);

    return _allMovies.sublist(0, endIndex);
  }

  Future<void> _fetchMovies(
    int page,
    Emitter<OptimizedMoviesState> emit, {
    bool isRefresh = false,
    bool isLoadMore = false,
  }) async {
    try {
      final result = await getMoviesUseCase(GetMoviesParams(page: page));

      result.fold(
        (failure) {
          // ✅ DÜZELTME: API'nin 'incomplete page' hatasını özel olarak ele al
          if (failure.message == 'Incomplete page data received') {
            AppLogger.w('[MoviesBloc] Reached end of list. API returned an incomplete page.');
            _hasNextPage = false;
            // Mevcut filmleri son durumla göstererek bir hata mesajı gösterme
            emit(
              OptimizedMoviesLoaded(
                movies: _updateMoviesWithFavoriteStatus(),
                currentPage: _currentPage,
                hasNextPage: false,
                isFromCache: false,
              ),
            );
          } else {
            // Diğer tüm hatalar için hata durumu yay
            emit(
              OptimizedMoviesError(
                message: _mapFailureToMessage(failure),
                previousMovies: isRefresh ? null : _allMovies,
              ),
            );
          }
        },
        (movies) async {
          AppLogger.i('[MoviesBloc] Processing ${movies.length} movies for page $page');

          // UPDATE INTERNAL STATE
          if (isRefresh) {
            _allMovies.clear();
            _loadedMovieIds.clear();
            _currentPage = 0;
            AppLogger.i('[MoviesBloc] Cache cleared for refresh');
          }

          // Filter out duplicates based on movie ID
          final uniqueNewMovies = <MovieEntity>[];
          for (final movie in movies) {
            if (!_loadedMovieIds.contains(movie.id)) {
              uniqueNewMovies.add(movie);
              _loadedMovieIds.add(movie.id);
              AppLogger.d('[MoviesBloc] Added new movie: ${movie.title} (${movie.id})');
            } else {
              AppLogger.w('[MoviesBloc] Duplicate movie filtered: ${movie.title} (${movie.id})');
            }
          }

          // Eğer hiç yeni film yoksa ve sayfa 1'den büyükse, daha fazla sayfa yok demektir
          if (uniqueNewMovies.isEmpty && page > 1) {
            AppLogger.w('[MoviesBloc] No new unique movies found, reached end');
            _hasNextPage = false;
            
            emit(OptimizedMoviesLoaded(
              movies: _updateMoviesWithFavoriteStatus(),
              currentPage: _currentPage,
              hasNextPage: false,
              isFromCache: false,
            ));
            return;
          }

          // Eğer ilk sayfa için bile yeni film yoksa (mükerrer çağrı), sayfa 2'yi yükle ve mevcut işlemi DURDUR
          if (uniqueNewMovies.isEmpty && page == 1 && !isRefresh) {
            AppLogger.w('[MoviesBloc] Page 1 duplicate detected - likely from cache, trying page 2');
            await _fetchMovies(page + 1, emit, isLoadMore: true);
            return;
          }

          // Add unique movies to internal list
          _allMovies.addAll(uniqueNewMovies);
          _currentPage = page;

          // Determine if there are more pages
          _hasNextPage = movies.length == 5 && uniqueNewMovies.isNotEmpty;
          _lastFetchTime = DateTime.now();

          AppLogger.i('[MoviesBloc] Page $page processed. Total unique movies: ${_allMovies.length}, Has next: $_hasNextPage');

          // ADDED: Cache cleanup after adding new movies
          _cleanupCache();

          final updatedMovies = _updateMoviesWithFavoriteStatus();

          emit(
            OptimizedMoviesLoaded(
              movies: updatedMovies,
              currentPage: _currentPage,
              hasNextPage: _hasNextPage,
              isFromCache: false,
            ),
          );
        },
      );
    } catch (e) {
      emit(
        OptimizedMoviesError(
          message: 'Beklenmeyen hata: $e',
          previousMovies: _allMovies,
        ),
      );
    }
  }

  List<MovieEntity> _updateMoviesWithFavoriteStatus() {
    return _allMovies.map((movie) {
      final isFavorite = _favoriteMovieIds.contains(movie.id);
      // ✅ LOG FAVORITE STATUS FOR DEBUGGING
      if (isFavorite) {
        AppLogger.d('[MoviesBloc] Movie ${movie.title} (${movie.id}) is marked as favorite');
      }
      return movie.copyWith(isFavorite: isFavorite);
    }).toList();
  }

  void _clearCache() {
    _allMovies.clear();
    _loadedMovieIds.clear();
    _favoriteMovieIds.clear();
    _currentPage = 0;
    _hasNextPage = true;
    _lastFetchTime = null;
    _favoritesLoaded = false; // ✅ Reset favorites loaded flag
    AppLogger.i('[MoviesBloc] All cache cleared');
  }

  // ✅ ADDED: Smart cache cleanup to prevent memory issues
  void _cleanupCache() {
    if (_allMovies.length > _maxCacheSize) {
      // Keep only the most recent movies
      final moviesToKeep = _maxCacheSize;
      _allMovies.removeRange(0, _allMovies.length - moviesToKeep);

      // Adjust current page accordingly
      _currentPage = (_allMovies.length / 5).ceil();

      AppLogger.i(
        '[MoviesBloc] Cache cleaned up. Kept $moviesToKeep most recent movies',
      );
    }
  }

  String _mapFailureToMessage(failure) {
    // ✅ IMPROVED: Better error message mapping
    if (failure == null) return 'Bilinmeyen hata oluştu';

    // Map specific failure types to user-friendly messages
    switch (failure.runtimeType.toString()) {
      case 'ServerFailure':
        return 'Sunucu hatası: ${failure.message}';
      case 'NetworkFailure':
        return 'İnternet bağlantısı hatası: ${failure.message}';
      case 'CacheFailure':
        return 'Önbellek hatası: ${failure.message}';
      default:
        return failure.message ?? 'Bir hata oluştu';
    }
  }

  @override
  Future<void> close() {
    _debounceTimer?.cancel();
    return super.close();
  }

  // ✅ HELPER GETTERS
  List<MovieEntity> get currentMovies => _allMovies;
  bool get hasNextPage => _hasNextPage;
  int get currentPage => _currentPage;
  Set<String> get favoriteMovieIds => Set.from(_favoriteMovieIds); // ✅ NEW: Expose favorites for debugging

  // ✅ NEW EVENT HANDLERS

  Future<void> _onFavoriteMoviesLoadRequested(
    FavoriteMoviesLoadRequested event,
    Emitter<OptimizedMoviesState> emit,
  ) async {
    // For now, filter current movies to show only favorites
    final favoriteMovies =
        _allMovies
            .where((movie) => _favoriteMovieIds.contains(movie.id))
            .toList();

    emit(
      OptimizedMoviesLoaded(
        movies: favoriteMovies,
        currentPage: 1,
        hasNextPage: false,
        isFromCache: true,
      ),
    );
  }

  Future<void> _onMoviesSearchRequested(
    MoviesSearchRequested event,
    Emitter<OptimizedMoviesState> emit,
  ) async {
    if (event.query.isEmpty) {
      // Return all movies if search is empty
      emit(
        OptimizedMoviesLoaded(
          movies: _allMovies,
          currentPage: _currentPage,
          hasNextPage: _hasNextPage,
          isFromCache: true,
        ),
      );
      return;
    }

    // Filter current movies based on search query
    final queryLower = event.query.toLowerCase();
    final filteredMovies =
        _allMovies.where((movie) {
          return movie.title.toLowerCase().contains(queryLower) ||
              (movie.plot?.toLowerCase().contains(queryLower) ?? false) ||
              (movie.genre?.toLowerCase().contains(queryLower) ?? false);
        }).toList();

    emit(
      OptimizedMoviesLoaded(
        movies: filteredMovies,
        currentPage: 1,
        hasNextPage: false,
        isFromCache: true,
      ),
    );
  }

  Future<void> _onMoviesSearchCleared(
    MoviesSearchCleared event,
    Emitter<OptimizedMoviesState> emit,
  ) async {
    // Return all movies when search is cleared
    emit(
      OptimizedMoviesLoaded(
        movies: _allMovies,
        currentPage: _currentPage,
        hasNextPage: _hasNextPage,
        isFromCache: true,
      ),
    );
  }
}