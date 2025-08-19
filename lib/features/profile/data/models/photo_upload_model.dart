import 'package:dating_app/features/profile/domain/entities/profile_entity.dart';


class PhotoUploadModel extends PhotoUploadEntity {
  const PhotoUploadModel({
    required super.photoUrl,
    required super.uploadedAt,
  });

  factory PhotoUploadModel.fromJson(Map<String, dynamic> json) {
    return PhotoUploadModel(
      photoUrl: json['photoUrl'] ?? json['photo_url'] ?? '',
      uploadedAt: DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'photoUrl': photoUrl,
      'photo_url': photoUrl,
      'uploaded_at': uploadedAt.toIso8601String(),
    };
  }
}
