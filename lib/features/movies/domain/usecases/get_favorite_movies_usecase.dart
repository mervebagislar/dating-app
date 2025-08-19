import 'package:dartz/dartz.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dating_app/core/usecases/usecases.dart';

import '../entities/movie_entity.dart';
import '../repositories/movies_repository.dart';

class GetFavoriteMoviesUseCase extends UseCase<List<MovieEntity>, NoParams> {
  final MoviesRepository repository;

  GetFavoriteMoviesUseCase(this.repository);

  @override
  Future<Either<Failure, List<MovieEntity>>> call(NoParams params) async {
    return await repository.getFavoriteMovies();
  }
}