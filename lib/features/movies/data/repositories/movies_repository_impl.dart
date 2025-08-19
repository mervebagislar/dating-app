// lib/features/movies/data/repositories/movies_repository_impl.dart
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/errors/exceptions.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dating_app/core/network/network_info.dart';
import 'package:dating_app/core/utils/logger.dart';

import '../../domain/entities/movie_entity.dart';
import '../../domain/repositories/movies_repository.dart';
import '../datasources/movies_local_datasource.dart';
import '../datasources/movies_remote_datasource.dart';
import '../models/movie_model.dart';

class MoviesRepositoryImpl implements MoviesRepository {
  final MoviesRemoteDataSource remoteDataSource;
  final MoviesLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  MoviesRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<MovieEntity>>> getMovies({
    required int page,
    int limit = 5, // ✅ FIXED: Added limit parameter
  }) async {
    try {
      // ✅ ADDED: Page size validation
      if (limit != 5) {
        return Left(ServerFailure(message: 'Page size must be exactly 5'));
      }

      if (await networkInfo.isConnected) {
        // Try to get from remote
        try {
          final response = await remoteDataSource.getMovies(page: page);
          final movieEntities =
              response.movies.map((model) => model.toEntity()).toList();

          // ✅ ADDED: Page completeness validation
          if (movieEntities.length != 5 && page > 1) {
            AppLogger.w(
              '[MoviesRepo] Incomplete page: ${movieEntities.length}/5 movies',
            );
            // If it's not the first page and we don't have exactly 5 movies, it's an error
            if (movieEntities.length < 5) {
              return Left(
                ServerFailure(message: 'Incomplete page data received'),
              );
            }
          }

          // Cache the movies
          await cacheMovies(movies: movieEntities, page: page);

          AppLogger.i(
            '[MoviesRepo] Fetched ${movieEntities.length} movies from remote',
          );
          return Right(movieEntities);
        } catch (e) {
          AppLogger.e('[MoviesRepo] Remote fetch failed: $e');
          // If remote fails, try to get from cache
          return await getCachedMovies(page: page);
        }
      } else {
        // No internet, get from cache
        AppLogger.w('[MoviesRepo] No internet connection, using cache');
        return await getCachedMovies(page: page);
      }
    } catch (e) {
      AppLogger.e('[MoviesRepo] Error getting movies: $e');
      return Left(ServerFailure(message: 'Failed to get movies: $e'));
    }
  }

  @override
  Future<Either<Failure, List<MovieEntity>>> getFavoriteMovies() async {
    try {
      if (await networkInfo.isConnected) {
        // Try to get from remote
        try {
          final favoriteModels = await remoteDataSource.getFavoriteMovies();
          final favoriteEntities =
              favoriteModels.map((model) => model.toEntity()).toList();

          // Cache the favorites
          await cacheFavoriteMovies(favorites: favoriteEntities);

          AppLogger.i(
            '[MoviesRepo] Fetched ${favoriteEntities.length} favorites from remote',
          );
          return Right(favoriteEntities);
        } catch (e) {
          AppLogger.e('[MoviesRepo] Remote favorites fetch failed: $e');
          // If remote fails, try to get from cache
          return await getCachedFavoriteMovies();
        }
      } else {
        // No internet, get from cache
        AppLogger.w(
          '[MoviesRepo] No internet connection, using cached favorites',
        );
        return await getCachedFavoriteMovies();
      }
    } catch (e) {
      AppLogger.e('[MoviesRepo] Error getting favorites: $e');
      return Left(ServerFailure(message: 'Failed to get favorite movies: $e'));
    }
  }

  @override
  Future<Either<Failure, bool>> toggleFavorite(String movieId) async {
    // ✅ FIXED: Positional parameter
    try {
      if (await networkInfo.isConnected) {
        final success = await remoteDataSource.toggleFavorite(movieId: movieId);

        if (success) {
          // Clear favorites cache so it will be refreshed next time
          try {
            await clearCache();
          } catch (e) {
            AppLogger.w('[MoviesRepo] Failed to clear cache: $e');
          }

          AppLogger.i('[MoviesRepo] Toggled favorite for movie: $movieId');
          return Right(success);
        } else {
          return Left(ServerFailure(message: 'Failed to toggle favorite'));
        }
      } else {
        return Left(NetworkFailure(message: 'No internet connection'));
      }
    } catch (e) {
      AppLogger.e('[MoviesRepo] Error toggling favorite: $e');
      if (e is ServerException) {
        return Left(ServerFailure(message: e.message));
      }
      return Left(ServerFailure(message: 'Failed to toggle favorite: $e'));
    }
  }

  @override
  Future<Either<Failure, List<MovieEntity>>> searchMovies({
    required String query,
    int page = 1, // ✅ FIXED: Added page parameter
    int limit = 20, // ✅ FIXED: Added limit parameter
  }) async {
    try {
      if (await networkInfo.isConnected) {
        final searchResults = await remoteDataSource.searchMovies(query: query);
        final movieEntities =
            searchResults.map((model) => model.toEntity()).toList();

        AppLogger.i(
          '[MoviesRepo] Found ${movieEntities.length} movies for query: $query',
        );
        return Right(movieEntities);
      } else {
        // No internet, try to search in cached movies
        try {
          final cachedMoviesResult = await getCachedMovies(page: page);
          return cachedMoviesResult.fold((failure) => Left(failure), (
            cachedMovies,
          ) {
            final queryLower = query.toLowerCase();

            final filteredMovies =
                cachedMovies.where((movie) {
                  return (movie.title.toLowerCase().contains(queryLower)) ||
                      (movie.plot?.toLowerCase().contains(queryLower) ??
                          false) ||
                      (movie.genre?.toLowerCase().contains(queryLower) ??
                          false);
                }).toList();

            AppLogger.i(
              '[MoviesRepo] Found ${filteredMovies.length} cached movies for query: $query',
            );
            return Right(filteredMovies);
          });
        } catch (e) {
          return Left(
            CacheFailure(message: 'Failed to search in cached movies: $e'),
          );
        }
      }
    } catch (e) {
      AppLogger.e('[MoviesRepo] Error searching movies: $e');
      return Left(ServerFailure(message: 'Failed to search movies: $e'));
    }
  }

  // ✅ FIXED: Implement missing interface methods

  @override
  Future<Either<Failure, MovieEntity>> getMovieById(String movieId) async {
    try {
      if (await networkInfo.isConnected) {
        // For now, search in all movies since we don't have a specific endpoint
        final moviesResult = await getMovies(page: 1);
        return moviesResult.fold((failure) => Left(failure), (movies) {
          try {
            final movie = movies.firstWhere((movie) => movie.id == movieId);
            return Right(movie);
          } catch (e) {
            return Left(ServerFailure(message: 'Movie not found'));
          }
        });
      } else {
        final cachedResult = await getCachedMovies(page: 1);
        return cachedResult.fold((failure) => Left(failure), (movies) {
          try {
            final movie = movies.firstWhere((movie) => movie.id == movieId);
            return Right(movie);
          } catch (e) {
            return Left(CacheFailure(message: 'Movie not found in cache'));
          }
        });
      }
    } catch (e) {
      return Left(ServerFailure(message: 'Failed to get movie: $e'));
    }
  }

  @override
  Future<Either<Failure, void>> cacheMovies({
    required List<MovieEntity> movies,
    required int page,
  }) async {
    try {
      final movieModels =
          movies.map((entity) => MovieModel.fromEntity(entity)).toList();
      await localDataSource.cacheMovies(movieModels);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(message: 'Failed to cache movies: $e'));
    }
  }

  @override
  Future<Either<Failure, List<MovieEntity>>> getCachedMovies({
    required int page,
  }) async {
    try {
      final cachedModels = await localDataSource.getCachedMovies();
      final movieEntities =
          cachedModels.map((model) => model.toEntity()).toList();

      if (movieEntities.isNotEmpty) {
        AppLogger.i(
          '[MoviesRepo] Loaded ${movieEntities.length} movies from cache',
        );
        return Right(movieEntities);
      } else {
        return Left(CacheFailure(message: 'No cached movies available'));
      }
    } catch (e) {
      AppLogger.e('[MoviesRepo] Cache error: $e');
      return Left(CacheFailure(message: 'Failed to load cached movies: $e'));
    }
  }

  @override
  Future<Either<Failure, void>> clearCache() async {
    try {
      await localDataSource.clearCache();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(message: 'Failed to clear cache: $e'));
    }
  }

  @override
  Future<bool> hasMoviesCached({required int page}) async {
    try {
      final cached = await localDataSource.getCachedMovies();
      return cached.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  @override
  Future<Either<Failure, void>> cacheFavoriteMovies({
    required List<MovieEntity> favorites,
  }) async {
    try {
      final favoriteModels =
          favorites.map((entity) => MovieModel.fromEntity(entity)).toList();
      await localDataSource.cacheFavoriteMovies(favoriteModels);
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(message: 'Failed to cache favorites: $e'));
    }
  }

  @override
  Future<Either<Failure, List<MovieEntity>>> getCachedFavoriteMovies() async {
    try {
      final cachedModels = await localDataSource.getCachedFavoriteMovies();
      final favoriteEntities =
          cachedModels.map((model) => model.toEntity()).toList();

      AppLogger.i(
        '[MoviesRepo] Loaded ${favoriteEntities.length} favorites from cache',
      );
      return Right(favoriteEntities);
    } catch (e) {
      AppLogger.e('[MoviesRepo] Cache favorites error: $e');
      return Left(CacheFailure(message: 'Failed to load cached favorites: $e'));
    }
  }

  @override
  Future<bool> hasFavoritesCached() async {
    try {
      final cached = await localDataSource.getCachedFavoriteMovies();
      return cached.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
}
