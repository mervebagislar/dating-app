

import 'package:equatable/equatable.dart';

abstract class FavoriteMoviesEvent extends Equatable {
  const FavoriteMoviesEvent();

  @override
  List<Object?> get props => [];
}

class LoadFavoriteMoviesEvent extends FavoriteMoviesEvent {
  const LoadFavoriteMoviesEvent();
}

class RefreshFavoriteMoviesEvent extends FavoriteMoviesEvent {
  const RefreshFavoriteMoviesEvent();
}
