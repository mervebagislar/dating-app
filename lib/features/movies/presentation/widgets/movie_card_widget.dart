// lib/features/movies/presentation/widgets/movie_card_widget.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../domain/entities/movie_entity.dart';
import 'app_logo_widget.dart';
import 'bottom_gradient_widget.dart';
import 'favorite_button_widget.dart';
import 'movie_info_widget.dart';
import 'movie_poster_widget.dart';

class MovieCardWidget extends StatefulWidget {
  final MovieEntity movie;
  final int index;
  final Function(MovieEntity) onFavoriteToggle;

  const MovieCardWidget({
    super.key,
    required this.movie,
    required this.index,
    required this.onFavoriteToggle,
  });

  @override
  State<MovieCardWidget> createState() => _MovieCardWidgetState();
}

class _MovieCardWidgetState extends State<MovieCardWidget> {
  bool _isDescriptionExpanded = false;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      child: Stack(
        children: [
          // âœ… MODULAR: Background Movie Poster
          MoviePosterWidget(movie: widget.movie),
          
          // âœ… MODULAR: App Logo (Bottom Left)
          const AppLogoWidget(),
          
          // âœ… MODULAR: Favorite Button (Top Right)
          FavoriteButtonWidget(
            movie: widget.movie,
            onToggle: () => widget.onFavoriteToggle(widget.movie),
          ),
          
          // âœ… MODULAR: Bottom Gradient
          const BottomGradientWidget(),
          
          // âœ… MODULAR: Movie Info (Bottom)
          MovieInfoWidget(
            movie: widget.movie,
            isDescriptionExpanded: _isDescriptionExpanded,
            onToggleDescription: () {
              setState(() {
                _isDescriptionExpanded = !_isDescriptionExpanded;
              });
              HapticFeedback.lightImpact();
            },
          ),
        ],
      ),
    );
  }
}