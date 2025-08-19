// lib/core/network/dio_client.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/api_constants.dart';
import '../errors/exceptions.dart';
import '../utils/logger.dart';

class DioClient {
  static late Dio _dio;
  static const FlutterSecureStorage _storage = FlutterSecureStorage();
  
  // ✅ Initialize Dio client
  static void initialize() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: ApiConstants.connectionTimeout,
        receiveTimeout: ApiConstants.receiveTimeout,
        headers: ApiConstants.defaultHeaders,
      ),
    );
    
    // Add interceptors
    _dio.interceptors.add(_AuthInterceptor());
    _dio.interceptors.add(_LoggingInterceptor());
    _dio.interceptors.add(_ErrorInterceptor());
    
    AppLogger.i('DioClient initialized with base URL: ${ApiConstants.baseUrl}');
  }
  
  // ✅ GET Request
  static Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      AppLogger.apiRequest('GET', path);
      final response = await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      AppLogger.apiResponse(response.statusCode ?? 0, path, data: response.data);
      return response;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  // ✅ POST Request
  static Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      AppLogger.apiRequest('POST', path, data: data);
      final response = await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      AppLogger.apiResponse(response.statusCode ?? 0, path, data: response.data);
      return response;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  // ✅ PUT Request
  static Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      AppLogger.apiRequest('PUT', path, data: data);
      final response = await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      AppLogger.apiResponse(response.statusCode ?? 0, path, data: response.data);
      return response;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  // ✅ DELETE Request
  static Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      AppLogger.apiRequest('DELETE', path);
      final response = await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      AppLogger.apiResponse(response.statusCode ?? 0, path, data: response.data);
      return response;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  // ✅ Upload File (for multipart form data)
  static Future<Response<T>> uploadFile<T>(
    String path, {
    required FormData formData,
    Map<String, dynamic>? queryParameters,
    Options? options,
    ProgressCallback? onSendProgress,
  }) async {
    try {
      AppLogger.apiRequest('POST (UPLOAD)', path);
      final response = await _dio.post<T>(
        path,
        data: formData,
        queryParameters: queryParameters,
        options: options,
        onSendProgress: onSendProgress,
      );
      AppLogger.apiResponse(response.statusCode ?? 0, path);
      return response;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  // ✅ Handle Dio errors and convert to app exceptions
  static AppException _handleDioError(DioException error) {
    AppLogger.e('DioException: ${error.type}', error: error.message);
    
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkException(
          message: ApiConstants.timeoutError,
          statusCode: error.response?.statusCode,
        );
        
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = _extractErrorMessage(error.response?.data);
        
        if (statusCode == ApiConstants.statusUnauthorized) {
          return AuthException(
            message: ApiConstants.unauthorizedError,
            statusCode: statusCode,
          );
        }
        
        return ServerException(
          message: message,
          statusCode: statusCode,
        );
        
      case DioExceptionType.cancel:
        return NetworkException(
          message: 'İstek iptal edildi',
          statusCode: error.response?.statusCode,
        );
        
      case DioExceptionType.unknown:
        return NetworkException(
          message: ApiConstants.networkError,
          statusCode: error.response?.statusCode,
        );
        
      case DioExceptionType.badCertificate:
        return NetworkException(
          message: 'SSL sertifikası geçersiz',
          statusCode: error.response?.statusCode,
        );
        
      case DioExceptionType.connectionError:
        return NetworkException(
          message: ApiConstants.networkError,
          statusCode: error.response?.statusCode,
        );
        
      default:
        return NetworkException(
          message: ApiConstants.unknownError,
          statusCode: error.response?.statusCode,
        );
    }
  }
  
  // ✅ Extract error message from response
  static String _extractErrorMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      return data['message'] ?? 
             data['error'] ?? 
             data['detail'] ?? 
             ApiConstants.serverError;
    }
    return ApiConstants.serverError;
  }
  
  // ✅ Close Dio client
  static void dispose() {
    _dio.close();
    AppLogger.i('DioClient disposed');
  }
}

// ✅ Auth Interceptor
class _AuthInterceptor extends Interceptor {
  static const FlutterSecureStorage _storage = FlutterSecureStorage();
  
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Skip auth for public endpoints
    if (_isPublicEndpoint(options.path)) {
      return handler.next(options);
    }
    
    try {
      final token = await _storage.read(key: ApiConstants.authTokenKey);
      
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
        AppLogger.d('Auth token added to request: ${options.path}');
      } else {
        AppLogger.w('No auth token found for: ${options.path}');
      }
    } catch (e) {
      AppLogger.e('Error adding auth token', error: e);
    }
    
    handler.next(options);
  }
  
  bool _isPublicEndpoint(String path) {
    const publicEndpoints = [
      ApiConstants.loginEndpoint,
      ApiConstants.registerEndpoint,
      ApiConstants.healthEndpoint,
    ];
    
    return publicEndpoints.any((endpoint) => path.contains(endpoint));
  }
}

// ✅ Logging Interceptor
class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    AppLogger.d(
      'REQUEST: ${options.method} ${options.uri}\n'
      'Headers: ${options.headers}\n'
      'Data: ${options.data}',
    );
    handler.next(options);
  }
  
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    AppLogger.d(
      'RESPONSE: ${response.statusCode} ${response.requestOptions.uri}\n'
      'Data: ${response.data}',
    );
    handler.next(response);
  }
  
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppLogger.e(
      'ERROR: ${err.requestOptions.method} ${err.requestOptions.uri}\n'
      'Status: ${err.response?.statusCode}\n'
      'Message: ${err.message}\n'
      'Data: ${err.response?.data}',
      error: err,
    );
    handler.next(err);
  }
}

// ✅ Error Interceptor
class _ErrorInterceptor extends Interceptor {
  static const FlutterSecureStorage _storage = FlutterSecureStorage();
  
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    // Handle 401 unauthorized - clear token
    if (err.response?.statusCode == ApiConstants.statusUnauthorized) {
      await _storage.delete(key: ApiConstants.authTokenKey);
      AppLogger.w('Token cleared due to 401 unauthorized');
    }
    
    handler.next(err);
  }
}