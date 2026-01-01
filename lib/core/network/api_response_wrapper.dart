// lib/core/network/api_response_wrapper.dart - FIXED & ENHANCED
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../constants/api_constants.dart';


import '../utils/logger.dart';

/// Generic API Response wrapper for type safety
class ApiResponse<T> {
  final T? data;
  final String? message;
  final bool success;
  final int? statusCode;
  final Map<String, dynamic>? errors;
  final Map<String, dynamic>? metadata;

  const ApiResponse({
    this.data,
    this.message,
    this.success = false,
    this.statusCode,
    this.errors,
    this.metadata,
  });

  factory ApiResponse.success({
    T? data,
    String? message,
    int? statusCode,
    Map<String, dynamic>? metadata,
  }) {
    return ApiResponse<T>(
      data: data,
      message: message ?? 'Operation successful',
      success: true,
      statusCode: statusCode ?? 200,
      metadata: metadata,
    );
  }

  factory ApiResponse.error({
    String? message,
    int? statusCode,
    Map<String, dynamic>? errors,
  }) {
    return ApiResponse<T>(
      message: message ?? 'Unknown error occurred',
      success: false,
      statusCode: statusCode ?? 500,
      errors: errors,
    );
  }

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>)? fromJsonT,
  ) {
    try {
      // Handle various API response formats
      final bool success = json['success'] as bool? ?? 
                          (json['response']?['code'] == 200) ?? 
                          true;

      final String? message = json['message'] as String? ?? 
                             json['response']?['message'] as String?;

      final int? statusCode = json['statusCode'] as int? ?? 
                             json['response']?['code'] as int?;

      T? data;
      if (json['data'] != null && fromJsonT != null) {
        if (json['data'] is Map<String, dynamic>) {
          data = fromJsonT(json['data'] as Map<String, dynamic>);
        } else {
          data = json['data'] as T?;
        }
      } else {
        data = json['data'] as T?;
      }

      return ApiResponse<T>(
        data: data,
        message: message,
        success: success,
        statusCode: statusCode,
        errors: json['errors'] as Map<String, dynamic>?,
        metadata: json['metadata'] as Map<String, dynamic>?,
      );
    } catch (e) {
      AppLogger.e('Error parsing ApiResponse: $e');
      return ApiResponse<T>.error(
        message: 'Failed to parse response: $e',
        statusCode: 500,
      );
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data,
      'message': message,
      'success': success,
      'statusCode': statusCode,
      'errors': errors,
      'metadata': metadata,
    };
  }

  bool get isSuccess => success && errors == null;
  bool get hasError => !success || errors != null;
  bool get hasData => data != null;

  @override
  String toString() {
    return 'ApiResponse(success: $success, statusCode: $statusCode, message: $message, hasData: $hasData)';
  }
}

/// Enhanced Dio Client with proper error handling and auth
class EnhancedDioClient {
  static late Dio _dio;
  static const FlutterSecureStorage _storage = FlutterSecureStorage();
  static bool _isInitialized = false;

  static Dio get dio => _dio;

  static void initialize({
    String? baseUrl,
    Duration? connectionTimeout,
    Duration? receiveTimeout,
  }) {
    if (_isInitialized) return;

    _dio = Dio(BaseOptions(
      baseUrl: baseUrl ?? ApiConstants.baseUrl,
      connectTimeout: connectionTimeout ?? ApiConstants.connectionTimeout,
      receiveTimeout: receiveTimeout ?? ApiConstants.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptors
    _dio.interceptors.add(_AuthInterceptor());
    _dio.interceptors.add(_LoggingInterceptor());
    _dio.interceptors.add(_ErrorInterceptor());

    _isInitialized = true;
    AppLogger.i('✅ EnhancedDioClient initialized');
  }

  /// Generic method for API calls with Either return type
  static Future<Either<Failure, ApiResponse<T>>> request<T>({
    required String path,
    required String method,
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
    Options? options,
    bool requiresAuth = true,
  }) async {
    try {
      if (!_isInitialized) {
        initialize();
      }

      AppLogger.d('🌐 API Request: $method $path');

      // Skip auth for certain endpoints
      final finalOptions = options ?? Options();
      if (!requiresAuth) {
        finalOptions.extra ??= {};
        finalOptions.extra!['skipAuth'] = true;
      }

      late Response response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await _dio.get(
            path,
            queryParameters: queryParameters,
            options: finalOptions,
          );
          break;
        case 'POST':
          response = await _dio.post(
            path,
            data: data,
            queryParameters: queryParameters,
            options: finalOptions,
          );
          break;
        case 'PUT':
          response = await _dio.put(
            path,
            data: data,
            queryParameters: queryParameters,
            options: finalOptions,
          );
          break;
        case 'DELETE':
          response = await _dio.delete(
            path,
            data: data,
            queryParameters: queryParameters,
            options: finalOptions,
          );
          break;
        default:
          return Left(ServerFailure(message: 'Unsupported HTTP method: $method'));
      }

      if (response.data is Map<String, dynamic>) {
        final apiResponse = ApiResponse.fromJson(
          response.data as Map<String, dynamic>,
          fromJson,
        );
        
        AppLogger.d('✅ API Success: ${apiResponse.message}');
        return Right(apiResponse);
      } else {
        // Handle non-JSON responses
        final apiResponse = ApiResponse<T>.success(
          data: response.data as T?,
          statusCode: response.statusCode,
        );
        return Right(apiResponse);
      }

    } on DioException catch (e) {
      AppLogger.e('❌ API DioException: ${e.message}');
      final failure = _handleDioError(e);
      return Left(failure);
    } catch (e) {
      AppLogger.e('❌ API Unexpected Error: $e');
      return Left(ServerFailure(message: 'Unexpected error: $e'));
    }
  }

  // ✅ CONVENIENCE METHODS WITH Either RETURN TYPE

  static Future<Either<Failure, ApiResponse<T>>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
    Options? options,
    bool requiresAuth = true,
  }) async {
    return request<T>(
      path: path,
      method: 'GET',
      queryParameters: queryParameters,
      fromJson: fromJson,
      options: options,
      requiresAuth: requiresAuth,
    );
  }

  static Future<Either<Failure, ApiResponse<T>>> post<T>(
    String path, {
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
    Options? options,
    bool requiresAuth = true,
  }) async {
    return request<T>(
      path: path,
      method: 'POST',
      data: data,
      queryParameters: queryParameters,
      fromJson: fromJson,
      options: options,
      requiresAuth: requiresAuth,
    );
  }

  static Future<Either<Failure, ApiResponse<T>>> put<T>(
    String path, {
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
    Options? options,
    bool requiresAuth = true,
  }) async {
    return request<T>(
      path: path,
      method: 'PUT',
      data: data,
      queryParameters: queryParameters,
      fromJson: fromJson,
      options: options,
      requiresAuth: requiresAuth,
    );
  }

  static Future<Either<Failure, ApiResponse<T>>> delete<T>(
    String path, {
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
    Options? options,
    bool requiresAuth = true,
  }) async {
    return request<T>(
      path: path,
      method: 'DELETE',
      data: data,
      queryParameters: queryParameters,
      fromJson: fromJson,
      options: options,
      requiresAuth: requiresAuth,
    );
  }

  // ✅ ERROR HANDLING
  static Failure _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkFailure(message: ApiConstants.timeoutError);
      
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = _extractErrorMessage(error.response?.data);
        
        switch (statusCode) {
          case 400:
            return ValidationFailure(message: message);
          case 401:
            return AuthFailure(message: ApiConstants.unauthorizedError);  
          case 403:
            return AuthFailure(message: 'Erişim reddedildi');
          case 404:
            return ServerFailure(message: ApiConstants.notFoundError);
          case 500:
          case 502:
          case 503:
            return ServerFailure(message: ApiConstants.serverError);
          default:
            return ServerFailure(message: message);
        }
      
      case DioExceptionType.connectionError:
      case DioExceptionType.unknown:
        if (error.message?.contains('SocketException') == true) {
          return NetworkFailure(message: ApiConstants.networkError);
        }
        return const ServerFailure(message: ApiConstants.unknownError);
      
      case DioExceptionType.cancel:
        return const ServerFailure(message: 'İstek iptal edildi');
      
      case DioExceptionType.badCertificate:
        return const NetworkFailure(message: 'SSL sertifikası geçersiz');
      
      default:
        return const ServerFailure(message: ApiConstants.unknownError);
    }
  }

  static String _extractErrorMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      // Try different error message fields
      return data['message'] as String? ?? 
             data['error'] as String? ?? 
             data['response']?['message'] as String? ??
             data['errors']?.toString() ??
             'Sunucu hatası oluştu';
    }
    return 'Bilinmeyen sunucu hatası';
  }

  static void dispose() {
    if (_isInitialized) {
      _dio.close();
      _isInitialized = false;
      AppLogger.i('🔄 EnhancedDioClient disposed');
    }
  }
}

// ✅ INTERCEPTORS

class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Skip auth for certain endpoints
    if (options.extra['skipAuth'] == true ||
        options.path.contains('/login') ||
        options.path.contains('/register') ||
        options.path.contains('/health')) {
      return handler.next(options);
    }

    try {
      const storage = FlutterSecureStorage();
      final token = await storage.read(key: 'auth_token');

      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
        AppLogger.d('🔑 Auth token added to request');
      } else {
        AppLogger.w('⚠️ No auth token found for protected endpoint');
      }
    } catch (e) {
      AppLogger.e('❌ Auth interceptor error: $e');
    }

    handler.next(options);
  }
}

class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    AppLogger.d('🌐 ${options.method} ${options.uri}');
    if (options.data != null) {
      AppLogger.d('📤 Request Data: ${options.data}');
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    AppLogger.d('✅ ${response.statusCode} ${response.requestOptions.uri}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppLogger.e('❌ ${err.response?.statusCode} ${err.requestOptions.uri} - ${err.message}');
    handler.next(err);
  }
}

class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Handle 401 errors by clearing tokens
    if (err.response?.statusCode == 401) {
      _handleUnauthorized();
    }
    
    handler.next(err);
  }

  void _handleUnauthorized() async {
    try {
      const storage = FlutterSecureStorage();
      await storage.delete(key: 'auth_token');
      AppLogger.w('🔒 Unauthorized - token cleared');
    } catch (e) {
      AppLogger.e('❌ Error clearing token: $e');
    }
  }
}