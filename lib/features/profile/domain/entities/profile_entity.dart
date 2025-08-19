class ProfileEntity {
  final String id;
  final String name;
  final String email;
  final String? photoUrl;
  final DateTime? createdAt;
  final int favoriteMoviesCount;

  const ProfileEntity({
    required this.id,
    required this.name,
    required this.email,
    this.photoUrl,
    this.createdAt,
    this.favoriteMoviesCount = 0,
  });

  ProfileEntity copyWith({
    String? id,
    String? name,
    String? email,
    String? photoUrl,
    DateTime? createdAt,
    int? favoriteMoviesCount,
  }) {
    return ProfileEntity(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      photoUrl: photoUrl ?? this.photoUrl,
      createdAt: createdAt ?? this.createdAt,
      favoriteMoviesCount: favoriteMoviesCount ?? this.favoriteMoviesCount,
    );
  }
}

// lib/features/profile/domain/entities/photo_upload_entity.dart
class PhotoUploadEntity {
  final String photoUrl;
  final DateTime uploadedAt;

  const PhotoUploadEntity({
    required this.photoUrl,
    required this.uploadedAt,
  });
}