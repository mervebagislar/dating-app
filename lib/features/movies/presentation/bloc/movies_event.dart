// lib/features/movies/presentation/bloc/movies_event.dart - FIXED
import 'package:equatable/equatable.dart';

abstract class MoviesEvent extends Equatable {
  const MoviesEvent();
  
  @override
  List<Object?> get props => [];
}

class MoviesLoadRequested extends MoviesEvent {
  final int page;
  final bool isRefresh;
  
  const MoviesLoadRequested({
    required this.page,
    this.isRefresh = false,
  });
  
  @override
  List<Object?> get props => [page, isRefresh];
}

class MoviesLoadMoreRequested extends MoviesEvent {
  const MoviesLoadMoreRequested();
}

class MoviesRefreshRequested extends MoviesEvent {
  const MoviesRefreshRequested();
}

class MovieFavoriteToggled extends MoviesEvent {
  final String movieId;
  
  const MovieFavoriteToggled({required this.movieId});
  
  @override
  List<Object?> get props => [movieId];
}

class FavoriteMoviesLoadRequested extends MoviesEvent {
  const FavoriteMoviesLoadRequested();
}

class MoviesSearchRequested extends MoviesEvent {
  final String query;
  
  const MoviesSearchRequested({required this.query});
  
  @override
  List<Object?> get props => [query];
}

class MoviesSearchCleared extends MoviesEvent {
  const MoviesSearchCleared();
}