import 'package:dating_app/core/usecases/usecases.dart';
import 'package:dating_app/features/movies/domain/entities/movie_entity.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../movies/domain/usecases/get_favorite_movies_usecase.dart';
import 'favorite_movies_event.dart';
import 'favorite_movies_state.dart';

class FavoriteMoviesBloc extends Bloc<FavoriteMoviesEvent, FavoriteMoviesState> {
  final GetFavoriteMoviesUseCase getFavoriteMoviesUseCase;

  FavoriteMoviesBloc({
    required this.getFavoriteMoviesUseCase,
  }) : super(const FavoriteMoviesInitial()) {
    on<LoadFavoriteMoviesEvent>(_onLoadFavoriteMovies);
    on<RefreshFavoriteMoviesEvent>(_onRefreshFavoriteMovies);
  }

  Future<void> _onLoadFavoriteMovies(
    LoadFavoriteMoviesEvent event,
    Emitter<FavoriteMoviesState> emit,
  ) async {
    print('🎯 FavoriteMoviesBloc: LoadFavoriteMoviesEvent received');
    
    emit(const FavoriteMoviesLoading());

    final result = await getFavoriteMoviesUseCase(NoParams());

    result.fold(
      (failure) {
        print('❌ FavoriteMoviesBloc: Load failed - ${failure.message}');
        emit(FavoriteMoviesError(message: failure.message));
      },
      (movies) {
        print('✅ FavoriteMoviesBloc: Favorite movies loaded - ${movies.length} movies');
        emit(FavoriteMoviesLoaded(movies: movies));
      },
    );
  }

  Future<void> _onRefreshFavoriteMovies(
    RefreshFavoriteMoviesEvent event,
    Emitter<FavoriteMoviesState> emit,
  ) async {
    print('🔄 FavoriteMoviesBloc: RefreshFavoriteMoviesEvent received');

    // Keep current movies during refresh if available
    if (state is FavoriteMoviesLoaded) {
      final currentMovies = (state as FavoriteMoviesLoaded).movies;
      emit(FavoriteMoviesRefreshing(movies: currentMovies));
    } else {
      emit(const FavoriteMoviesLoading());
    }

    final result = await getFavoriteMoviesUseCase(NoParams());

    result.fold(
      (failure) {
        print('❌ FavoriteMoviesBloc: Refresh failed - ${failure.message}');
        // If we had movies before, show error but keep the movies
        if (state is FavoriteMoviesRefreshing) {
          final currentMovies = (state as FavoriteMoviesRefreshing).movies;
          emit(FavoriteMoviesError(message: failure.message, movies: currentMovies));
        } else {
          emit(FavoriteMoviesError(message: failure.message));
        }
      },
      (movies) {
        print('✅ FavoriteMoviesBloc: Favorite movies refreshed - ${movies.length} movies');
        emit(FavoriteMoviesLoaded(movies: movies));
      },
    );
  }

  // ✅ HELPER METHODS
  
  List<MovieEntity> get currentMovies {
    final currentState = state;
    
    if (currentState is FavoriteMoviesLoaded) {
      return currentState.movies;
    } else if (currentState is FavoriteMoviesRefreshing) {
      return currentState.movies;
    } else if (currentState is FavoriteMoviesError && currentState.movies != null) {
      return currentState.movies!;
    }
    
    return [];
  }

  bool get isLoading {
    return state is FavoriteMoviesLoading || state is FavoriteMoviesRefreshing;
  }

  bool get hasMovies {
    return currentMovies.isNotEmpty;
  }
}