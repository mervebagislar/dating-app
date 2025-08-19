// lib/features/movies/presentation/bloc/movies_state.dart
import 'package:equatable/equatable.dart';
import '../../domain/entities/movie_entity.dart';

abstract class MoviesState extends Equatable {
  const MoviesState();

  @override
  List<Object?> get props => [];
}

// Initial state
class MoviesInitial extends MoviesState {
  const MoviesInitial();
}

// Loading state (first time loading)
class MoviesLoading extends MoviesState {
  const MoviesLoading();
}

// Movies loaded successfully
class MoviesLoaded extends MoviesState {
  final List<MovieEntity> movies;
  final int currentPage;
  final bool hasNextPage;
  final bool isLoadingMore;

  const MoviesLoaded({
    required this.movies,
    required this.currentPage,
    required this.hasNextPage,
    this.isLoadingMore = false,
  });

  @override
  List<Object?> get props => [
        movies,
        currentPage,
        hasNextPage,
        isLoadingMore,
      ];

  // Copy with method for easy state updates
  MoviesLoaded copyWith({
    List<MovieEntity>? movies,
    int? currentPage,
    bool? hasNextPage,
    bool? isLoadingMore,
  }) {
    return MoviesLoaded(
      movies: movies ?? this.movies,
      currentPage: currentPage ?? this.currentPage,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }

  // Helper getters
  bool get isEmpty => movies.isEmpty;
  bool get isNotEmpty => movies.isNotEmpty;
  int get totalMovies => movies.length;

  // Check if we're at the last page
  bool get isLastPage => !hasNextPage;

  // Get unique movie count (for debugging)
  int get uniqueMovieCount {
    final uniqueIds = <String>{};
    for (final movie in movies) {
      uniqueIds.add(movie.id);
    }
    return uniqueIds.length;
  }

  @override
  String toString() {
    return 'MoviesLoaded(movies: ${movies.length}, page: $currentPage, hasNext: $hasNextPage, loadingMore: $isLoadingMore)';
  }
}

// Error state
class MoviesError extends MoviesState {
  final String message;
  final int? statusCode;

  const MoviesError({
    required this.message,
    this.statusCode,
  });

  @override
  List<Object?> get props => [message, statusCode];

  @override
  String toString() => 'MoviesError(message: $message, statusCode: $statusCode)';
}

// Favorites states
class FavoritesLoading extends MoviesState {
  const FavoritesLoading();
}

class FavoritesLoaded extends MoviesState {
  final List<MovieEntity> favoriteMovies;

  const FavoritesLoaded({required this.favoriteMovies});

  @override
  List<Object?> get props => [favoriteMovies];

  bool get isEmpty => favoriteMovies.isEmpty;
  bool get isNotEmpty => favoriteMovies.isNotEmpty;
  int get totalFavorites => favoriteMovies.length;

  @override
  String toString() => 'FavoritesLoaded(favorites: ${favoriteMovies.length})';
}

class FavoritesError extends MoviesState {
  final String message;

  const FavoritesError({required this.message});

  @override
  List<Object?> get props => [message];

  @override
  String toString() => 'FavoritesError(message: $message)';
}

// Search states
class MoviesSearchLoading extends MoviesState {
  const MoviesSearchLoading();
}

class MoviesSearchLoaded extends MoviesState {
  final List<MovieEntity> searchResults;
  final String query;

  const MoviesSearchLoaded({
    required this.searchResults,
    required this.query,
  });

  @override
  List<Object?> get props => [searchResults, query];

  bool get isEmpty => searchResults.isEmpty;
  bool get isNotEmpty => searchResults.isNotEmpty;
  int get totalResults => searchResults.length;

  @override
  String toString() => 'MoviesSearchLoaded(results: ${searchResults.length}, query: $query)';
}

class MoviesSearchError extends MoviesState {
  final String message;
  final String query;

  const MoviesSearchError({
    required this.message,
    required this.query,
  });

  @override
  List<Object?> get props => [message, query];

  @override
  String toString() => 'MoviesSearchError(message: $message, query: $query)';
}