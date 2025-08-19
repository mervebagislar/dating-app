// lib/features/movies/domain/usecases/toggle_favorite_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/errors/failures.dart';

import 'package:dating_app/core/usecases/usecases.dart';

import '../repositories/movies_repository.dart';

class ToggleFavoriteUseCase extends UseCase<bool, ToggleFavoriteParams> {
  final MoviesRepository repository;

  ToggleFavoriteUseCase(this.repository);

  @override
  Future<Either<Failure, bool>> call(ToggleFavoriteParams params) async {
    return await repository.toggleFavorite(params.movieId); // ✅ FIXED: positional parameter
  }
}

class ToggleFavoriteParams {
  final String movieId;

  const ToggleFavoriteParams({required this.movieId});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ToggleFavoriteParams && other.movieId == movieId;
  }

  @override
  int get hashCode => movieId.hashCode;
}