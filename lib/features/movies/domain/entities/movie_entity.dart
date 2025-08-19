// lib/features/movies/domain/entities/movie_entity.dart
import 'package:equatable/equatable.dart';

class MovieEntity extends Equatable {
  final String id;
  final String title;
  final String? year;
  final String? rated;
  final String? released;
  final String? runtime;
  final String? genre;
  final String? director;
  final String? writer;
  final String? actors;
  final String? plot;
  final String? language;
  final String? country;
  final String? awards;
  final String? posterUrl;
  final String? metascore;
  final String? imdbRating;
  final String? imdbVotes;
  final String? imdbID;
  final String? type;
  final List<String>? images;
  final bool? comingSoon;
  final bool isFavorite;

  const MovieEntity({
    required this.id,
    required this.title,
    this.year,
    this.rated,
    this.released,
    this.runtime,
    this.genre,
    this.director,
    this.writer,
    this.actors,
    this.plot,
    this.language,
    this.country,
    this.awards,
    this.posterUrl,
    this.metascore,
    this.imdbRating,
    this.imdbVotes,
    this.imdbID,
    this.type,
    this.images,
    this.comingSoon,
    this.isFavorite = false,
  });

  @override
  List<Object?> get props => [
    id,
    title,
    year,
    rated,
    released,
    runtime,
    genre,
    director,
    writer,
    actors,
    plot,
    language,
    country,
    awards,
    posterUrl,
    metascore,
    imdbRating,
    imdbVotes,
    imdbID,
    type,
    images,
    comingSoon,
    isFavorite,
  ];

  /// Copy with method for creating modified instances
  MovieEntity copyWith({
    String? id,
    String? title,
    String? year,
    String? rated,
    String? released,
    String? runtime,
    String? genre,
    String? director,
    String? writer,
    String? actors,
    String? plot,
    String? language,
    String? country,
    String? awards,
    String? posterUrl,
    String? metascore,
    String? imdbRating,
    String? imdbVotes,
    String? imdbID,
    String? type,
    List<String>? images,
    bool? comingSoon,
    bool? isFavorite,
  }) {
    return MovieEntity(
      id: id ?? this.id,
      title: title ?? this.title,
      year: year ?? this.year,
      rated: rated ?? this.rated,
      released: released ?? this.released,
      runtime: runtime ?? this.runtime,
      genre: genre ?? this.genre,
      director: director ?? this.director,
      writer: writer ?? this.writer,
      actors: actors ?? this.actors,
      plot: plot ?? this.plot,
      language: language ?? this.language,
      country: country ?? this.country,
      awards: awards ?? this.awards,
      posterUrl: posterUrl ?? this.posterUrl,
      metascore: metascore ?? this.metascore,
      imdbRating: imdbRating ?? this.imdbRating,
      imdbVotes: imdbVotes ?? this.imdbVotes,
      imdbID: imdbID ?? this.imdbID,
      type: type ?? this.type,
      images: images ?? this.images,
      comingSoon: comingSoon ?? this.comingSoon,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }

  /// Helper method to get best image
  String? getBestImage() {
    if (images != null && images!.isNotEmpty) {
      // Try to find the largest image
      for (final image in images!) {
        if (image.contains('SX1500') || image.contains('SX1777')) {
          return image;
        }
      }
      // Return first image if no high-res found
      return images!.first;
    }
    // Fallback to poster
    return posterUrl;
  }

  /// Helper method to get thumbnail image
  String? getThumbnailImage() {
    if (posterUrl != null && posterUrl!.isNotEmpty) {
      return posterUrl;
    }
    if (images != null && images!.isNotEmpty) {
      return images!.first;
    }
    return null;
  }

  /// Check if movie has valid poster
  bool get hasPoster => posterUrl != null && posterUrl!.isNotEmpty;

  /// Check if movie has images
  bool get hasImages => images != null && images!.isNotEmpty;

  /// Get formatted runtime (e.g., "2h 30m")
  String get formattedRuntime {
    if (runtime == null || runtime!.isEmpty) return 'Bilinmiyor';
    
    final runtimeStr = runtime!.replaceAll(RegExp(r'[^\d]'), '');
    final minutes = int.tryParse(runtimeStr);
    
    if (minutes == null) return runtime!;
    
    final hours = minutes ~/ 60;
    final remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return remainingMinutes > 0 ? '${hours}s ${remainingMinutes}d' : '${hours}s';
    }
    
    return '${remainingMinutes}d';
  }

  /// Get release year as integer
  int? get releaseYear {
    if (year == null || year!.isEmpty) return null;
    return int.tryParse(year!);
  }

  /// Get IMDB rating as double
  double? get numericImdbRating {
    if (imdbRating == null || imdbRating!.isEmpty) return null;
    return double.tryParse(imdbRating!);
  }

  /// Check if movie is recent (released in last 3 years)
  bool get isRecent {
    final yearNum = releaseYear;
    if (yearNum == null) return false;
    
    final currentYear = DateTime.now().year;
    return currentYear - yearNum <= 3;
  }

  /// Get main genre (first genre from comma-separated list)
  String get mainGenre {
    if (genre == null || genre!.isEmpty) return 'Drama';
    
    final genres = genre!.split(',');
    return genres.first.trim();
  }

  /// Get all genres as list
  List<String> get genreList {
    if (genre == null || genre!.isEmpty) return [];
    
    return genre!.split(',').map((g) => g.trim()).toList();
  }

  @override
  String toString() {
    return 'MovieEntity(id: $id, title: $title, year: $year, isFavorite: $isFavorite)';
  }
}