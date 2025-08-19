// lib/features/movies/data/models/movie_model.dart
import '../../domain/entities/movie_entity.dart';

class MovieModel extends MovieEntity {
  const MovieModel({
    required super.id,
    required super.title, // ✅ FIXED: Keep as required String
    super.year,
    super.rated,
    super.released,
    super.runtime,
    super.genre,
    super.director,
    super.writer,
    super.actors,
    super.plot,
    super.language,
    super.country,
    super.awards,
    super.posterUrl,
    super.metascore,
    super.imdbRating,
    super.imdbVotes,
    super.imdbID,
    super.type,
    super.images,
    super.comingSoon,
    super.isFavorite = false,
  });

  factory MovieModel.fromJson(Map<String, dynamic> json) {
    // ✅ FIXED: MongoDB ObjectId'den tutarlı ID oluştur
    final mongoId = json['_id']?.toString() ?? json['id']?.toString() ?? '';
    
    // ✅ FIXED: Title için null kontrolü ve varsayılan değer
    final title = json['Title']?.toString() ?? 'Bilinmeyen Film';
    
    // ✅ FIXED: ID boş olursa hash'den oluştur
    final finalId = mongoId.isNotEmpty ? mongoId : title.hashCode.toString();
    
    // Images array'ini güvenli şekilde parse et
    List<String>? imageList;
    if (json['Images'] != null && json['Images'] is List) {
      imageList = (json['Images'] as List)
          .map((e) => e?.toString() ?? '')
          .where((url) => url.isNotEmpty)
          .toList();
    }

    return MovieModel(
      id: finalId, // ✅ FIXED: Non-null ID
      title: title, // ✅ FIXED: Non-null title
      year: json['Year']?.toString(),
      rated: json['Rated']?.toString(),
      released: json['Released']?.toString(),
      runtime: json['Runtime']?.toString(),
      genre: json['Genre']?.toString(),
      director: json['Director']?.toString(),
      writer: json['Writer']?.toString(),
      actors: json['Actors']?.toString(),
      plot: json['Plot']?.toString(),
      language: json['Language']?.toString(),
      country: json['Country']?.toString(),
      awards: json['Awards']?.toString(),
      posterUrl: json['Poster']?.toString(),
      metascore: json['Metascore']?.toString(),
      imdbRating: json['imdbRating']?.toString(),
      imdbVotes: json['imdbVotes']?.toString(),
      imdbID: json['imdbID']?.toString(),
      type: json['Type']?.toString(),
      images: imageList,
      comingSoon: json['ComingSoon'] as bool?,
      isFavorite: json['isFavorite'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      '_id': id,
      'Title': title,
      'Year': year,
      'Rated': rated,
      'Released': released,
      'Runtime': runtime,
      'Genre': genre,
      'Director': director,
      'Writer': writer,
      'Actors': actors,
      'Plot': plot,
      'Language': language,
      'Country': country,
      'Awards': awards,
      'Poster': posterUrl,
      'Metascore': metascore,
      'imdbRating': imdbRating,
      'imdbVotes': imdbVotes,
      'imdbID': imdbID,
      'Type': type,
      'Images': images,
      'ComingSoon': comingSoon,
      'isFavorite': isFavorite,
    };
  }

  /// Convert to Entity
  MovieEntity toEntity() {
    return MovieEntity(
      id: id,
      title: title,
      year: year,
      rated: rated,
      released: released,
      runtime: runtime,
      genre: genre,
      director: director,
      writer: writer,
      actors: actors,
      plot: plot,
      language: language,
      country: country,
      awards: awards,
      posterUrl: posterUrl,
      metascore: metascore,
      imdbRating: imdbRating,
      imdbVotes: imdbVotes,
      imdbID: imdbID,
      type: type,
      images: images,
      comingSoon: comingSoon,
      isFavorite: isFavorite,
    );
  }

  /// Create MovieModel from Entity
  factory MovieModel.fromEntity(MovieEntity entity) {
    return MovieModel(
      id: entity.id,
      title: entity.title,
      year: entity.year,
      rated: entity.rated,
      released: entity.released,
      runtime: entity.runtime,
      genre: entity.genre,
      director: entity.director,
      writer: entity.writer,
      actors: entity.actors,
      plot: entity.plot,
      language: entity.language,
      country: entity.country,
      awards: entity.awards,
      posterUrl: entity.posterUrl,
      metascore: entity.metascore,
      imdbRating: entity.imdbRating,
      imdbVotes: entity.imdbVotes,
      imdbID: entity.imdbID,
      type: entity.type,
      images: entity.images,
      comingSoon: entity.comingSoon,
      isFavorite: entity.isFavorite,
    );
  }

  /// Copy with method for MovieModel
  MovieModel copyWith({
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
    return MovieModel(
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

  @override
  String toString() {
    return 'MovieModel(id: $id, title: $title, year: $year, isFavorite: $isFavorite)';
  }
}