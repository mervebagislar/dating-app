// lib/features/movies/data/datasources/movies_local_datasource.dart
import 'dart:convert';
import 'package:dating_app/core/errors/exceptions.dart';
import 'package:dating_app/core/utils/logger.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/movie_model.dart';

abstract class MoviesLocalDataSource {
  Future<List<MovieModel>> getCachedMovies();
  Future<void> cacheMovies(List<MovieModel> movies);
  Future<List<MovieModel>> getCachedFavoriteMovies();
  Future<void> cacheFavoriteMovies(List<MovieModel> movies);
  Future<void> clearCache();
}

class MoviesLocalDataSourceImpl implements MoviesLocalDataSource {
  final FlutterSecureStorage storage;
  
  static const String _moviesKey = 'cached_movies';
  static const String _favoritesKey = 'cached_favorites';

  MoviesLocalDataSourceImpl({required this.storage});

  @override
  Future<List<MovieModel>> getCachedMovies() async {
    try {
      final cachedData = await storage.read(key: _moviesKey);
      if (cachedData != null) {
        final List<dynamic> jsonList = json.decode(cachedData);
        return jsonList
            .map((json) => MovieModel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      AppLogger.e('[Movies] Error getting cached movies: $e');
      return [];
    }
  }

  @override
  Future<void> cacheMovies(List<MovieModel> movies) async {
    try {
      final jsonList = movies.map((movie) => movie.toJson()).toList();
      await storage.write(key: _moviesKey, value: json.encode(jsonList));
      AppLogger.i('[Movies] Cached ${movies.length} movies');
    } catch (e) {
      AppLogger.e('[Movies] Error caching movies: $e');
      throw CacheException(message: 'Failed to cache movies: $e');
    }
  }

  @override
  Future<List<MovieModel>> getCachedFavoriteMovies() async {
    try {
      final cachedData = await storage.read(key: _favoritesKey);
      if (cachedData != null) {
        final List<dynamic> jsonList = json.decode(cachedData);
        return jsonList
            .map((json) => MovieModel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      AppLogger.e('[Movies] Error getting cached favorites: $e');
      return [];
    }
  }

  @override
  Future<void> cacheFavoriteMovies(List<MovieModel> movies) async {
    try {
      final jsonList = movies.map((movie) => movie.toJson()).toList();
      await storage.write(key: _favoritesKey, value: json.encode(jsonList));
      AppLogger.i('[Movies] Cached ${movies.length} favorite movies');
    } catch (e) {
      AppLogger.e('[Movies] Error caching favorite movies: $e');
      throw CacheException(message: 'Failed to cache favorite movies: $e');
    }
  }

  @override
  Future<void> clearCache() async {
    try {
      await storage.delete(key: _moviesKey);
      await storage.delete(key: _favoritesKey);
      AppLogger.i('[Movies] Cache cleared');
    } catch (e) {
      AppLogger.e('[Movies] Error clearing cache: $e');
      throw CacheException(message: 'Failed to clear cache: $e');
    }
  }
}