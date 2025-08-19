// lib/features/auth/domain/entities/user_entity.dart
import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  final String id;
  final String name;
  final String email;
  final String? photoUrl;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final bool? isOnline;
  final DateTime? lastSeen;

  const UserEntity({
    required this.id,
    required this.name,
    required this.email,
    this.photoUrl,
    this.createdAt,
    this.updatedAt,
    this.isOnline,
    this.lastSeen,
  });

  // ✅ Helper getters
  String get displayName => name.isNotEmpty ? name : 'Anonim Kullanıcı';
  
  bool get hasPhoto => photoUrl != null && photoUrl!.isNotEmpty;
  
  String get initials {
    if (name.isEmpty) return 'U';
    final parts = name.split(' ').where((part) => part.isNotEmpty).toList();
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else if (parts.isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return 'U';
  }
  
  String get onlineStatus {
    if (isOnline == true) return 'Çevrimiçi';
    if (lastSeen != null) {
      final diff = DateTime.now().difference(lastSeen!);
      if (diff.inMinutes < 60) return '${diff.inMinutes} dakika önce';
      if (diff.inHours < 24) return '${diff.inHours} saat önce';
      return '${diff.inDays} gün önce';
    }
    return 'Çevrimdışı';
  }

  @override
  List<Object?> get props => [
        id,
        name,
        email,
        photoUrl,
        createdAt,
        updatedAt,
        isOnline,
        lastSeen,
      ];

  @override
  String toString() {
    return 'UserEntity(id: $id, name: $name, email: $email)';
  }

  // ✅ ADDED: Copy with method for MVVM support
  UserEntity copyWith({
    String? id,
    String? name,
    String? email,
    String? photoUrl,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isOnline,
    DateTime? lastSeen,
  }) {
    return UserEntity(
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
}