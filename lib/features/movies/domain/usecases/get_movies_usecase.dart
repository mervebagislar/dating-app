import 'package:dartz/dartz.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dating_app/core/usecases/usecases.dart';

import '../entities/movie_entity.dart';
import '../repositories/movies_repository.dart';

class GetMoviesUseCase extends UseCase<List<MovieEntity>, GetMoviesParams> {
  final MoviesRepository repository;

  GetMoviesUseCase(this.repository);

  @override
  Future<Either<Failure, List<MovieEntity>>> call(GetMoviesParams params) async {
    return await repository.getMovies(page: params.page);
  }
}

class GetMoviesParams {
  final int page;

  const GetMoviesParams({required this.page});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is GetMoviesParams && other.page == page;
  }

  @override
  int get hashCode => page.hashCode;
}


