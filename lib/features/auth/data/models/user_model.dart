// lib/features/auth/data/models/user_model.dart
import '../../domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    super.photoUrl,
    super.createdAt,
    super.updatedAt,
    super.isOnline,
    super.lastSeen,
  });

  // ✅ Factory constructor from JSON (API response)
  factory UserModel.fromJson(Map<String, dynamic> json) {
    try {
      // ✅ Handle MongoDB ObjectId to string conversion
      String userId;
      if (json.containsKey('id') && json['id'] != null) {
        userId = json['id'].toString();
      } else if (json.containsKey('_id') && json['_id'] != null) {
        userId = json['_id'].toString();
      } else {
        userId = '0';
      }

      // ✅ Ensure name is never null or empty
      String userName = 'Unknown User';
      if (json.containsKey('name') && json['name'] != null) {
        final nameValue = json['name'].toString().trim();
        if (nameValue.isNotEmpty) {
          userName = nameValue;
        }
      }

      return UserModel(
        id: userId,
        name: userName,
        email: json['email']?.toString() ?? '',
        photoUrl: json['photo_url']?.toString() ?? json['photoUrl']?.toString(),
        createdAt: json['created_at'] != null 
            ? DateTime.tryParse(json['created_at'].toString())
            : null,
        updatedAt: json['updated_at'] != null 
            ? DateTime.tryParse(json['updated_at'].toString())
            : null,
        isOnline: json['is_online'] as bool?,
        lastSeen: json['last_seen'] != null 
            ? DateTime.tryParse(json['last_seen'].toString())
            : null,
      );
    } catch (e) {
      // ✅ Return a safe default user instead of throwing
      return const UserModel(
        id: '0',
        name: 'Unknown User',
        email: '',
      );
    }
  }

  // ✅ Convert to JSON for API requests
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'photo_url': photoUrl,
      'photoUrl': photoUrl, // Include both for compatibility
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'is_online': isOnline,
      'last_seen': lastSeen?.toIso8601String(),
    };
  }

  // ✅ Convert from Entity to Model
  factory UserModel.fromEntity(UserEntity entity) {
    return UserModel(
      id: entity.id,
      name: entity.name,
      email: entity.email,
      photoUrl: entity.photoUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isOnline: entity.isOnline,
      lastSeen: entity.lastSeen,
    );
  }

  // ✅ Convert to Entity
  UserEntity toEntity() {
    return UserEntity(
      id: id,
      name: name,
      email: email,
      photoUrl: photoUrl,
      createdAt: createdAt,
      updatedAt: updatedAt,
      isOnline: isOnline,
      lastSeen: lastSeen,
    );
  }

  // ✅ CopyWith method for immutable updates
  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? photoUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isOnline,
    DateTime? lastSeen,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      photoUrl: photoUrl ?? this.photoUrl,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isOnline: isOnline ?? this.isOnline,
      lastSeen: lastSeen ?? this.lastSeen,
    );
  }

  @override
  String toString() {
    return 'UserModel(id: $id, name: $name, email: $email)';
  }
}