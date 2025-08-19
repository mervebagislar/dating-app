import 'package:equatable/equatable.dart';
import '../../../movies/domain/entities/movie_entity.dart';

abstract class FavoriteMoviesState extends Equatable {
  const FavoriteMoviesState();

  @override
  List<Object?> get props => [];
}

class FavoriteMoviesInitial extends FavoriteMoviesState {
  const FavoriteMoviesInitial();
}

class FavoriteMoviesLoading extends FavoriteMoviesState {
  const FavoriteMoviesLoading();
}

class FavoriteMoviesLoaded extends FavoriteMoviesState {
  final List<MovieEntity> movies;

  const FavoriteMoviesLoaded({required this.movies});

  @override
  List<Object> get props => [movies];
}

class FavoriteMoviesRefreshing extends FavoriteMoviesState {
  final List<MovieEntity> movies; // Keep current movies while refreshing

  const FavoriteMoviesRefreshing({required this.movies});

  @override
  List<Object> get props => [movies];
}

class FavoriteMoviesError extends FavoriteMoviesState {
  final String message;
  final List<MovieEntity>? movies; // Keep current movies if available

  const FavoriteMoviesError({
    required this.message,
    this.movies,
  });

  @override
  List<Object?> get props => [message, movies];
}
