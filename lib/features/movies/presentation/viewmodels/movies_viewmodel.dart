// lib/features/movies/presentation/viewmodels/movies_viewmodel.dart
import 'package:flutter/foundation.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dating_app/core/utils/logger.dart';
import '../../domain/entities/movie_entity.dart';
import '../../domain/repositories/movies_repository.dart';

// ✅ MVVM: ViewModel for Movies feature
class MoviesViewModel extends ChangeNotifier {
  final MoviesRepository _moviesRepository;
  
  MoviesViewModel(this._moviesRepository);
  
  // ✅ State variables
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _isRefreshing = false;
  bool _hasNextPage = true;
  String? _errorMessage;
  String? _searchQuery;
  
  // ✅ Data
  List<MovieEntity> _movies = [];
  List<MovieEntity> _favoriteMovies = [];
  Set<String> _favoriteMovieIds = {};
  
  // ✅ Getters
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get isRefreshing => _isRefreshing;
  bool get hasNextPage => _hasNextPage;
  String? get errorMessage => _errorMessage;
  String? get searchQuery => _searchQuery;
  List<MovieEntity> get movies => _movies;
  List<MovieEntity> get favoriteMovies => _favoriteMovies;
  Set<String> get favoriteMovieIds => _favoriteMovieIds;
  
  // ✅ Load movies
  Future<void> loadMovies({bool refresh = false}) async {
    try {
      if (refresh) {
        _setRefreshing(true);
        _movies.clear();
        _hasNextPage = true;
      } else {
        _setLoading(true);
      }
      
      _clearError();
      
      AppLogger.i('[MoviesViewModel] Loading movies (refresh: $refresh)');
      
      final result = await _moviesRepository.getMovies(page: 1);
      
      result.fold(
        (failure) => _handleFailure(failure),
        (movies) => _handleMoviesLoaded(movies, isRefresh: refresh),
      );
    } catch (e) {
      AppLogger.e('[MoviesViewModel] Load movies error: $e');
      _setError('Filmler yüklenirken hata oluştu: $e');
    } finally {
      if (refresh) {
        _setRefreshing(false);
      } else {
        _setLoading(false);
      }
    }
  }
  
  // ✅ Load more movies
  Future<void> loadMoreMovies() async {
    if (_isLoadingMore || !_hasNextPage) return;
    
    try {
      _setLoadingMore(true);
      
      final nextPage = (_movies.length / 5).ceil() + 1;
      AppLogger.i('[MoviesViewModel] Loading more movies - page $nextPage');
      
      final result = await _moviesRepository.getMovies(page: nextPage);
      
      result.fold(
        (failure) => _handleFailure(failure),
        (movies) => _handleMoreMoviesLoaded(movies),
      );
    } catch (e) {
      AppLogger.e('[MoviesViewModel] Load more movies error: $e');
      _setError('Daha fazla film yüklenirken hata oluştu: $e');
    } finally {
      _setLoadingMore(false);
    }
  }
  
  // ✅ Search movies
  Future<void> searchMovies(String query) async {
    if (query.isEmpty) {
      _searchQuery = null;
      await loadMovies(refresh: true);
      return;
    }
    
    try {
      _setLoading(true);
      _searchQuery = query;
      _clearError();
      
      AppLogger.i('[MoviesViewModel] Searching movies: $query');
      
      final result = await _moviesRepository.searchMovies(query: query);
      
      result.fold(
        (failure) => _handleFailure(failure),
        (movies) => _handleSearchResults(movies),
      );
    } catch (e) {
      AppLogger.e('[MoviesViewModel] Search movies error: $e');
      _setError('Film arama hatası: $e');
    } finally {
      _setLoading(false);
    }
  }
  
  // ✅ Toggle favorite
  Future<void> toggleFavorite(MovieEntity movie) async {
    try {
      final result = await _moviesRepository.toggleFavorite(movie.id);
      
      result.fold(
        (failure) => _handleFailure(failure),
        (isFavorite) => _handleFavoriteToggled(movie.id, isFavorite),
      );
    } catch (e) {
      AppLogger.e('[MoviesViewModel] Toggle favorite error: $e');
      _setError('Favori işlemi başarısız: $e');
    }
  }
  
  // ✅ Load favorite movies
  Future<void> loadFavoriteMovies() async {
    try {
      _setLoading(true);
      _clearError();
      
      AppLogger.i('[MoviesViewModel] Loading favorite movies');
      
      final result = await _moviesRepository.getFavoriteMovies();
      
      result.fold(
        (failure) => _handleFailure(failure),
        (movies) => _handleFavoriteMoviesLoaded(movies),
      );
    } catch (e) {
      AppLogger.e('[MoviesViewModel] Load favorite movies error: $e');
      _setError('Favori filmler yüklenirken hata oluştu: $e');
    } finally {
      _setLoading(false);
    }
  }
  
  // ✅ Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _setLoadingMore(bool loading) {
    _isLoadingMore = loading;
    notifyListeners();
  }
  
  void _setRefreshing(bool refreshing) {
    _isRefreshing = refreshing;
    notifyListeners();
  }
  
  void _setError(String message) {
    _errorMessage = message;
    notifyListeners();
  }
  
  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }
  
  void _handleFailure(Failure failure) {
    _setError(failure.message);
    AppLogger.e('[MoviesViewModel] Failure: ${failure.message}');
  }
  
  void _handleMoviesLoaded(List<MovieEntity> movies, {bool isRefresh = false}) {
    if (isRefresh) {
      _movies = movies;
    } else {
      _movies.addAll(movies);
    }
    
    _hasNextPage = movies.length >= 5;
    _updateFavoriteStatus();
    
    AppLogger.s('[MoviesViewModel] Movies loaded: ${movies.length} movies');
    notifyListeners();
  }
  
  void _handleMoreMoviesLoaded(List<MovieEntity> movies) {
    _movies.addAll(movies);
    _hasNextPage = movies.length >= 5;
    _updateFavoriteStatus();
    
    AppLogger.s('[MoviesViewModel] More movies loaded: ${movies.length} movies');
    notifyListeners();
  }
  
  void _handleSearchResults(List<MovieEntity> movies) {
    _movies = movies;
    _hasNextPage = false; // Search results don't have pagination
    _updateFavoriteStatus();
    
    AppLogger.s('[MoviesViewModel] Search results: ${movies.length} movies');
    notifyListeners();
  }
  
  void _handleFavoriteToggled(String movieId, bool isFavorite) {
    if (isFavorite) {
      _favoriteMovieIds.add(movieId);
    } else {
      _favoriteMovieIds.remove(movieId);
    }
    
    // Update movie favorite status
    final movieIndex = _movies.indexWhere((m) => m.id == movieId);
    if (movieIndex != -1) {
      // Note: This would require MovieEntity to have a favorite field
      // For now, we'll just update the set
    }
    
    AppLogger.s('[MoviesViewModel] Favorite toggled: $movieId -> $isFavorite');
    notifyListeners();
  }
  
  void _handleFavoriteMoviesLoaded(List<MovieEntity> movies) {
    _favoriteMovies = movies;
    _favoriteMovieIds = movies.map((m) => m.id).toSet();
    
    AppLogger.s('[MoviesViewModel] Favorite movies loaded: ${movies.length} movies');
    notifyListeners();
  }
  
  void _updateFavoriteStatus() {
    // Update favorite status for all movies based on favoriteMovieIds
    // This would require MovieEntity to have a favorite field
    // For now, we'll just use the set for checking
  }
  
  // ✅ Check if movie is favorite
  bool isFavorite(String movieId) {
    return _favoriteMovieIds.contains(movieId);
  }
  
  // ✅ Clear search
  void clearSearch() {
    _searchQuery = null;
    loadMovies(refresh: true);
  }
  
  // ✅ Dispose method
  @override
  void dispose() {
    AppLogger.i('[MoviesViewModel] Disposed');
    super.dispose();
  }
}
