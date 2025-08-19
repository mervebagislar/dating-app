// lib/features/movies/data/datasources/movies_remote_datasource.dart
import 'package:dating_app/core/constants/api_constants.dart';
import 'package:dating_app/core/errors/exceptions.dart';
import 'package:dating_app/core/network/api_response_wrapper.dart';
import 'package:dating_app/core/utils/logger.dart';
import '../models/movie_model.dart';
import '../models/movie_response_model.dart';

abstract class MoviesRemoteDataSource {
  Future<MovieListResponseModel> getMovies({required int page});
  Future<List<MovieModel>> getFavoriteMovies();
  Future<bool> toggleFavorite({required String movieId});
  Future<List<MovieModel>> searchMovies({required String query});
}

class MoviesRemoteDataSourceImpl implements MoviesRemoteDataSource {
  MoviesRemoteDataSourceImpl();

  @override
  Future<MovieListResponseModel> getMovies({required int page}) async {
    try {
      AppLogger.i('[Movies] Loading movies page: $page');

      // ✅ Use EnhancedDioClient
      final result = await EnhancedDioClient.get(
        ApiConstants.movieListEndpoint,
        queryParameters: {'page': page},
        requiresAuth: true, // Movies endpoint doesn't need auth
      );

      return result.fold(
        (failure) {
          AppLogger.e('[Movies] API failure: ${failure.message}');
          throw ServerException(message: failure.message);
        },
        (apiResponse) {
          AppLogger.i('[Movies] Movies API Response: ${apiResponse.statusCode}');
          
          // ✅ apiResponse.data should contain your movie list
          if (apiResponse.data != null) {
            // Create response structure that matches your API
            final responseData = {
              'data': apiResponse.data,
              'response': {
                'code': apiResponse.statusCode ?? 200,
                'message': apiResponse.message ?? '',
              }
            };
            
            return MovieListResponseModel.fromJson(responseData);
          } else {
            throw ServerException(message: 'No data received from API');
          }
        },
      );
    } catch (e) {
      AppLogger.e('[Movies] Error loading movies: $e');

      if (e is AppException) {
        rethrow;
      } else {
        throw ServerException(message: 'Failed to fetch movies: $e');
      }
    }
  }

  @override
  Future<List<MovieModel>> getFavoriteMovies() async {
    try {
      AppLogger.i('[Movies] Loading favorite movies');

      final result = await EnhancedDioClient.get(
        ApiConstants.favoritesEndpoint,
        requiresAuth: true, // Favorites might need auth
      );

      return result.fold(
        (failure) {
          AppLogger.e('[Movies] Favorites API failure: ${failure.message}');
          throw ServerException(message: failure.message);
        },
        (apiResponse) {
          AppLogger.i('[Movies] Favorites response: ${apiResponse.statusCode}');

          if (apiResponse.data == null) {
            return [];
          }

          final responseData = apiResponse.data;

          // ✅ Handle different response structures
          if (responseData is List) {
            return responseData
                .map((json) => MovieModel.fromJson(json as Map<String, dynamic>))
                .toList();
          } else if (responseData is Map<String, dynamic>) {
            // Check for nested data structure
            final data = responseData['data'];
            
            if (data is List) {
              return data
                  .map((json) => MovieModel.fromJson(json as Map<String, dynamic>))
                  .toList();
            } else if (data is Map<String, dynamic> && data.containsKey('movies')) {
              final movieList = data['movies'] as List<dynamic>;
              return movieList
                  .map((json) => MovieModel.fromJson(json as Map<String, dynamic>))
                  .toList();
            } else if (responseData.containsKey('movies')) {
              final movieList = responseData['movies'] as List<dynamic>;
              return movieList
                  .map((json) => MovieModel.fromJson(json as Map<String, dynamic>))
                  .toList();
            }
          }
          
          return [];
        },
      );
    } catch (e) {
      AppLogger.e('[Movies] Error loading favorites: $e');

      if (e is AppException) {
        rethrow;
      } else {
        throw ServerException(message: 'Failed to fetch favorite movies: $e');
      }
    }
  }

  @override
  Future<bool> toggleFavorite({required String movieId}) async {
    try {
      AppLogger.i('[Movies] Toggling favorite for movie ID: $movieId');

      // Validate MongoDB ObjectId format
      if (movieId.isEmpty || movieId == '0' || movieId.length != 24) {
        throw ServerException(
          message: 'Invalid MongoDB ObjectId format: $movieId',
        );
      }

      final result = await EnhancedDioClient.post(
        '${ApiConstants.toggleFavoriteEndpoint}/$movieId',
        requiresAuth: true, // Toggle favorite needs auth
      );

      return result.fold(
        (failure) {
          AppLogger.e('[Movies] Toggle favorite failure: ${failure.message}');
          throw ServerException(message: failure.message);
        },
        (apiResponse) {
          AppLogger.i('[Movies] Favorite toggle response: ${apiResponse.statusCode}');
          
          // ✅ Check if the operation was successful
          return apiResponse.isSuccess && 
                 (apiResponse.statusCode == 200 || apiResponse.statusCode == 201);
        },
      );
    } catch (e) {
      AppLogger.e('[Movies] Error toggling favorite: $e');

      if (e is AppException) {
        rethrow;
      } else {
        throw ServerException(message: 'Failed to toggle favorite: $e');
      }
    }
  }

  @override
  Future<List<MovieModel>> searchMovies({required String query}) async {
    try {
      if (query.isEmpty) return [];

      AppLogger.i('[Movies] Searching movies with query: $query');

      // ✅ Search through multiple pages
      final List<MovieModel> allMovies = [];
      int currentPage = 1;
      const maxPages = 3; // Limit search to first 3 pages

      while (currentPage <= maxPages) {
        try {
          final response = await getMovies(page: currentPage);
          allMovies.addAll(response.movies);

          // ✅ Stop if we've reached the end or no more movies
          if (!response.hasNextPage || response.movies.isEmpty) {
            break;
          }
          
          currentPage++;
        } catch (e) {
          AppLogger.w('[Movies] Error loading page $currentPage for search: $e');
          break;
        }
      }

      // ✅ Filter movies based on search query
      final queryLower = query.toLowerCase();
      final filteredMovies = allMovies.where((movie) {
        return (movie.title.toLowerCase().contains(queryLower)) ||
            (movie.plot?.toLowerCase().contains(queryLower) ?? false) ||
            (movie.genre?.toLowerCase().contains(queryLower) ?? false) ||
            (movie.director?.toLowerCase().contains(queryLower) ?? false) ||
            (movie.actors?.toLowerCase().contains(queryLower) ?? false);
      }).toList();

      AppLogger.i('[Movies] Search found ${filteredMovies.length} results for "$query"');
      return filteredMovies;
    } catch (e) {
      AppLogger.e('[Movies] Error searching movies: $e');

      if (e is AppException) {
        rethrow;
      } else {
        throw ServerException(message: 'Search failed: $e');
      }
    }
  }
}