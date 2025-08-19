// lib/features/movies/presentation/bloc/movies_bloc.dart - ALIAS FILE
// ✅ BACKWARD COMPATIBILITY ALIASES

import 'package:dating_app/features/movies/presentation/bloc/optimized_movies_bloc.dart';

export 'optimized_movies_bloc.dart';

// ✅ TYPE ALIASES for easier import and backward compatibility
typedef MoviesBloc = OptimizedMoviesBloc;
typedef MoviesState = OptimizedMoviesState;

// ✅ STATE ALIASES
typedef MoviesInitial = OptimizedMoviesInitial;
typedef MoviesLoading = OptimizedMoviesLoading;
typedef MoviesLoaded = OptimizedMoviesLoaded;
typedef MoviesLoadingMore = OptimizedMoviesLoadingMore;
typedef MoviesRefreshing = OptimizedMoviesRefreshing;
typedef MovieFavoriteToggledState = OptimizedMovieFavoriteToggled;
typedef MoviesError = OptimizedMoviesError;