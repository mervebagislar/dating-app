// lib/features/movies/domain/usecases/search_movies_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/errors/failures.dart';

import 'package:dating_app/core/usecases/usecases.dart';

import '../entities/movie_entity.dart';
import '../repositories/movies_repository.dart';

class SearchMoviesUseCase extends UseCase<List<MovieEntity>, SearchMoviesParams> {
  final MoviesRepository repository;

  SearchMoviesUseCase(this.repository);

  @override
  Future<Either<Failure, List<MovieEntity>>> call(SearchMoviesParams params) async {
    return await repository.searchMovies(query: params.query); // ✅ FIXED: named parameter 'query'
  }
}

class SearchMoviesParams {
  final String query;

  const SearchMoviesParams({required this.query});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is SearchMoviesParams && other.query == query;
  }

  @override
  int get hashCode => query.hashCode;
}