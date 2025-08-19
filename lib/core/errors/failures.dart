// lib/core/errors/failures.dart
import 'package:equatable/equatable.dart';

// ✅ Base Failure Class
abstract class Failure extends Equatable {
  final String message;
  final int? statusCode;
  
  const Failure({
    required this.message,
    this.statusCode,
  });
  
  @override
  List<Object?> get props => [message, statusCode];
  
  @override
  String toString() => 'Failure: $message (${statusCode ?? 'No status'})';
}

// ✅ Server Failure
class ServerFailure extends Failure {
  const ServerFailure({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'ServerFailure: $message (${statusCode ?? 'No status'})';
}

// ✅ Cache Failure
class CacheFailure extends Failure {
  const CacheFailure({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'CacheFailure: $message';
}

// ✅ Network Failure
class NetworkFailure extends Failure {
  const NetworkFailure({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'NetworkFailure: $message';
}

// ✅ Authentication Failure
class AuthFailure extends Failure {
  const AuthFailure({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'AuthFailure: $message (${statusCode ?? 'No status'})';
}

// ✅ Validation Failure
class ValidationFailure extends Failure {
  final Map<String, List<String>>? errors;
  
  const ValidationFailure({
    required super.message,
    super.statusCode,
    this.errors,
  });
  
  @override
  List<Object?> get props => [message, statusCode, errors];
  
  @override
  String toString() => 'ValidationFailure: $message${errors != null ? ' - Errors: $errors' : ''}';
}

// ✅ File Failure (for image uploads)
class FileFailure extends Failure {
  const FileFailure({
    required super.message,
    super.statusCode,
  });
  
  @override
  String toString() => 'FileFailure: $message';
}