// lib/features/movies/domain/repositories/movies_repository.dart
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/movie_entity.dart';

abstract class MoviesRepository {
  
  Future<Either<Failure, List<MovieEntity>>> getMovies({
    required int page,
    int limit = 5,
  });

  Future<Either<Failure, List<MovieEntity>>> getFavoriteMovies();


  
  /// [movieId] - The ID of the movie to toggle

  Future<Either<Failure, bool>> toggleFavorite(String movieId);


  /// [query] - Search term
  /// [page] - Page number for pagination
  /// [limit] - Number of results per page
  
  Future<Either<Failure, List<MovieEntity>>> searchMovies({
    required String query,
    int page = 1,
    int limit = 20,
  });

  /// [movieId] - The ID of the movie

  Future<Either<Failure, MovieEntity>> getMovieById(String movieId);

 
  /// [movies] - List of movies to cache
  /// [page] - Page number for cache key
  
  Future<Either<Failure, void>> cacheMovies({
    required List<MovieEntity> movies,
    required int page,
  });

 
  /// [page] - Page number to retrieve from cache
 
  Future<Either<Failure, List<MovieEntity>>> getCachedMovies({
    required int page,
  });

  Future<Either<Failure, void>> clearCache();

  
 
  /// [page] - Page number to check

  Future<bool> hasMoviesCached({required int page});


  /// [favorites] - List of favorite movies to cache

  Future<Either<Failure, void>> cacheFavoriteMovies({
    required List<MovieEntity> favorites,
  });

  Future<Either<Failure, List<MovieEntity>>> getCachedFavoriteMovies();

  Future<bool> hasFavoritesCached();
}