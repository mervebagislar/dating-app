// lib/features/movies/data/models/movie_response_model.dart
import 'movie_model.dart';

class MovieListResponseModel {
  final List<MovieModel> movies;
  final int totalPages;
  final int currentPage;
  final int totalMovies;
  final bool hasNextPage;
  final bool hasPreviousPage;

  const MovieListResponseModel({
    required this.movies,
    required this.totalPages,
    required this.currentPage,
    required this.totalMovies,
    required this.hasNextPage,
    required this.hasPreviousPage,
  });

  factory MovieListResponseModel.fromJson(Map<String, dynamic> json) {
    try {
      // ✅ API response structure from your new logs: {data: {movies: [...]}}
      final dataWrapper = json['data'] as Map<String, dynamic>? ?? {};
      final moviesList = dataWrapper['movies'] as List<dynamic>? ?? [];
      
      final movies = moviesList
          .map((movieJson) => MovieModel.fromJson(movieJson as Map<String, dynamic>))
          .toList();

      // ✅ Your API sends exactly 5 movies per page based on the logs
      const moviesPerPage = 5;
      final currentPage = _calculateCurrentPage(movies.length);
      
      // ✅ If we got exactly 5 movies, assume there might be more pages
      // If we got less than 5, we've reached the end
      final hasNextPage = movies.length == moviesPerPage;
      
      // ✅ Calculate total pages - for now we don't know the total from API
      // We'll determine this dynamically based on API responses
      final totalPages = hasNextPage ? currentPage + 1 : currentPage;
      
      return MovieListResponseModel(
        movies: movies,
        totalPages: totalPages,
        currentPage: currentPage,
        totalMovies: movies.length, // We don't know total from API
        hasNextPage: hasNextPage,
        hasPreviousPage: currentPage > 1,
      );
    } catch (e) {
      print('❌ Error parsing MovieListResponseModel: $e');
      print('📋 Raw JSON: $json');
      
      // ✅ Return empty response instead of throwing
      return const MovieListResponseModel(
        movies: [],
        totalPages: 1,
        currentPage: 1,
        totalMovies: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      );
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'data': movies.map((movie) => movie.toJson()).toList(),
      'response': {
        'code': 200,
        'message': '',
      },
    };
  }

  /// Calculate current page based on movie count (each page has 5 movies)
  static int _calculateCurrentPage(int movieCount) {
    if (movieCount == 0) return 1;
    return ((movieCount - 1) ~/ 5) + 1;
  }

  /// Check if this is the last page
  bool get isLastPage => !hasNextPage;

  /// Check if this is the first page
  bool get isFirstPage => !hasPreviousPage;

  /// Get page info string for debugging
  String get pageInfo => 'Page $currentPage of $totalPages ($totalMovies total movies)';

  /// Copy with method
  MovieListResponseModel copyWith({
    List<MovieModel>? movies,
    int? totalPages,
    int? currentPage,
    int? totalMovies,
    bool? hasNextPage,
    bool? hasPreviousPage,
  }) {
    return MovieListResponseModel(
      movies: movies ?? this.movies,
      totalPages: totalPages ?? this.totalPages,
      currentPage: currentPage ?? this.currentPage,
      totalMovies: totalMovies ?? this.totalMovies,
      hasNextPage: hasNextPage ?? this.hasNextPage,
      hasPreviousPage: hasPreviousPage ?? this.hasPreviousPage,
    );
  }

  @override
  String toString() {
    return 'MovieListResponseModel(movies: ${movies.length}, currentPage: $currentPage, totalPages: $totalPages, hasNextPage: $hasNextPage)';
  }
}