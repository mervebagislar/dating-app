// lib/core/errors/exceptions.dart

// ✅ Base Exception Class
abstract class AppException implements Exception {
  final String message;
  final int? statusCode;
  
  const AppException({
    required this.message,
    this.statusCode,
  });
  
  @override
  String toString() => 'AppException: $message (${statusCode ?? 'No status'})';
}

// ✅ Server Exception
class ServerException extends AppException {
  const ServerException({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'ServerException: $message (${statusCode ?? 'No status'})';
}

// ✅ Cache Exception
class CacheException extends AppException {
  const CacheException({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'CacheException: $message';
}

// ✅ Network Exception
class NetworkException extends AppException {
  const NetworkException({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'NetworkException: $message';
}

// ✅ Authentication Exception
class AuthException extends AppException {
  const AuthException({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'AuthException: $message (${statusCode ?? 'No status'})';
}

// ✅ Validation Exception
class ValidationException extends AppException {
  final Map<String, List<String>>? errors;
  
  const ValidationException({
    required super.message,
    super.statusCode,
    this.errors,
  });
  
  @override
  String toString() => 'ValidationException: $message${errors != null ? ' - Errors: $errors' : ''}';
}

// ✅ File Exception (for image uploads)
class FileException extends AppException {
  const FileException({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'FileException: $message';
}