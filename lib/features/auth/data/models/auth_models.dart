// lib/features/auth/data/models/auth_models.dart
// Export user model
import 'package:dating_app/features/auth/data/models/user_model.dart';

export 'user_model.dart';

// ===== REQUEST MODELS =====

class LoginRequestModel {
  final String email;
  final String password;

  const LoginRequestModel({
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }

  @override
  String toString() => 'LoginRequestModel(email: $email)';
}

class RegisterRequestModel {
  final String name;
  final String email;
  final String password;

  const RegisterRequestModel({
    required this.name,
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'password': password,
    };
  }

  @override
  String toString() => 'RegisterRequestModel(name: $name, email: $email)';
}

// ===== RESPONSE MODELS =====

class LoginResponseModel {
  final String? token;
  final UserModel? user;
  final String? message;

  const LoginResponseModel({
    this.token,
    this.user,
    this.message,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    try {
      final token = json['token'] as String?;
      
      UserModel? user;
      if (json.containsKey('user') && json['user'] != null) {
        user = UserModel.fromJson(json['user'] as Map<String, dynamic>);
      } else {
        // If user data is mixed with token, create user from json (excluding token)
        final userJson = Map<String, dynamic>.from(json);
        userJson.remove('token');
        userJson.remove('message');
        
        if (userJson.isNotEmpty) {
          user = UserModel.fromJson(userJson);
        }
      }

      return LoginResponseModel(
        token: token,
        user: user,
        message: json['message'] as String?,
      );
    } catch (e) {
      throw Exception('Failed to parse LoginResponseModel: $e');
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'user': user?.toJson(),
      'message': message,
    };
  }

  bool get isValid => token != null && user != null;

  @override
  String toString() => 'LoginResponseModel(token: ${token != null ? "***" : null}, user: ${user?.name})';
}

class RegisterResponseModel {
  final String? token;
  final UserModel? user;
  final String? message;

  const RegisterResponseModel({
    this.token,
    this.user,
    this.message,
  });

  factory RegisterResponseModel.fromJson(Map<String, dynamic> json) {
    try {
      final token = json['token'] as String?;
      
      UserModel? user;
      if (json.containsKey('user') && json['user'] != null) {
        user = UserModel.fromJson(json['user'] as Map<String, dynamic>);
      } else {
        final userJson = Map<String, dynamic>.from(json);
        userJson.remove('token');
        userJson.remove('message');
        
        if (userJson.isNotEmpty) {
          user = UserModel.fromJson(userJson);
        }
      }

      return RegisterResponseModel(
        token: token,
        user: user,
        message: json['message'] as String?,
      );
    } catch (e) {
      throw Exception('Failed to parse RegisterResponseModel: $e');
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'user': user?.toJson(),
      'message': message,
    };
  }

  bool get isValid => token != null && user != null;

  @override
  String toString() => 'RegisterResponseModel(token: ${token != null ? "***" : null}, user: ${user?.name})';
}

class PhotoUploadResponseModel {
  final String? photoUrl;
  final String? message;

  const PhotoUploadResponseModel({
    this.photoUrl,
    this.message,
  });

  factory PhotoUploadResponseModel.fromJson(Map<String, dynamic> json) {
    return PhotoUploadResponseModel(
      photoUrl: json['photoUrl'] as String? ?? json['photo_url'] as String?,
      message: json['message'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'photoUrl': photoUrl,
      'message': message,
    };
  }

  bool get isValid => photoUrl != null && photoUrl!.isNotEmpty;

  @override
  String toString() => 'PhotoUploadResponseModel(photoUrl: $photoUrl)';
}