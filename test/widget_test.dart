// test/widget_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dating_app/main.dart';

void main() {
  group('Dating App Widget Tests', () {
    testWidgets('App should start and show splash screen', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const DatingApp());

      // Wait for splash screen to appear
      await tester.pump();

      // Verify that splash screen elements are present
      expect(find.text('Dating App'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('App navigation should work', (WidgetTester tester) async {
      // Build our app
      await tester.pumpWidget(const DatingApp());

      // Wait for splash screen
      await tester.pump();

      // Wait for navigation to login (since no token exists)
      await tester.pump(const Duration(seconds: 4));
      
      // Should navigate to login page
      expect(find.text('Merhabalar'), findsOneWidget);
      expect(find.text('Giriş Yap'), findsOneWidget);
    });

    testWidgets('Login form validation should work', (WidgetTester tester) async {
      // Build our app
      await tester.pumpWidget(const DatingApp());
      
      // Wait for navigation to login
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Find and tap the login button without filling forms
      final loginButton = find.text('Giriş Yap');
      await tester.tap(loginButton);
      await tester.pump();

      // Should show validation errors
      expect(find.text('E-posta adresi gerekli'), findsOneWidget);
      expect(find.text('Şifre gerekli'), findsOneWidget);
    });
  });

  group('Form Validation Tests', () {
    testWidgets('Email validation should work correctly', (WidgetTester tester) async {
      await tester.pumpWidget(const DatingApp());
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Find email field and enter invalid email
      final emailField = find.byType(TextField).first;
      await tester.enterText(emailField, 'invalid-email');
      
      // Tap login button to trigger validation
      await tester.tap(find.text('Giriş Yap'));
      await tester.pump();

      // Should show email validation error
      expect(find.text('Geçerli bir e-posta adresi girin'), findsOneWidget);
    });

    testWidgets('Password validation should work correctly', (WidgetTester tester) async {
      await tester.pumpWidget(const DatingApp());
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Find password field and enter short password
      final passwordField = find.byType(TextField).last;
      await tester.enterText(passwordField, '123');
      
      // Tap login button to trigger validation
      await tester.tap(find.text('Giriş Yap'));
      await tester.pump();

      // Should show password validation error
      expect(find.text('Şifre en az 6 karakter olmalı'), findsOneWidget);
    });
  });

  group('Navigation Tests', () {
    testWidgets('Should navigate to register page', (WidgetTester tester) async {
      await tester.pumpWidget(const DatingApp());
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Find and tap register link
      await tester.tap(find.text('Kayıt Ol!'));
      await tester.pump();

      // Should navigate to register page
      expect(find.text('Hoşgeldiniz'), findsOneWidget);
      expect(find.text('Şimdi Kaydol'), findsOneWidget);
    });

    testWidgets('Should navigate back to login from register', (WidgetTester tester) async {
      await tester.pumpWidget(const DatingApp());
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Navigate to register
      await tester.tap(find.text('Kayıt Ol!'));
      await tester.pump();

      // Navigate back to login
      await tester.tap(find.text('Giriş Yap!'));
      await tester.pump();

      // Should be back to login page
      expect(find.text('Merhabalar'), findsOneWidget);
      expect(find.text('Giriş Yap'), findsOneWidget);
    });
  });

  group('UI Component Tests', () {
    testWidgets('Password visibility toggle should work', (WidgetTester tester) async {
      await tester.pumpWidget(const DatingApp());
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Find password visibility toggle button
      final visibilityToggle = find.byIcon(Icons.visibility_off_outlined);
      expect(visibilityToggle, findsOneWidget);

      // Tap to toggle visibility
      await tester.tap(visibilityToggle);
      await tester.pump();

      // Should show visibility_outlined icon
      expect(find.byIcon(Icons.visibility_outlined), findsOneWidget);
    });

    testWidgets('Social login buttons should be present', (WidgetTester tester) async {
      await tester.pumpWidget(const DatingApp());
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Should find social login buttons
      expect(find.text('G'), findsOneWidget); // Google
      expect(find.byIcon(Icons.apple), findsOneWidget); // Apple
      expect(find.text('f'), findsOneWidget); // Facebook
    });
  });

  group('Error Handling Tests', () {
    testWidgets('Should handle network errors gracefully', (WidgetTester tester) async {
      await tester.pumpWidget(const DatingApp());
      await tester.pump();
      await tester.pump(const Duration(seconds: 4));

      // Fill form with valid data
      await tester.enterText(find.byType(TextField).first, 'test@example.com');
      await tester.enterText(find.byType(TextField).last, 'password123');
      
      // Tap login button
      await tester.tap(find.text('Giriş Yap'));
      await tester.pump();

      // Should show loading state initially
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });
}

// ==================== INTEGRATION TEST EXAMPLE ====================

/*
// test/integration_test/app_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:dating_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Dating App Integration Tests', () {
    testWidgets('Full user flow test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Wait for splash
      await tester.pump(const Duration(seconds: 4));

      // Should be on login page
      expect(find.text('Merhabalar'), findsOneWidget);

      // Navigate to register
      await tester.tap(find.text('Kayıt Ol!'));
      await tester.pumpAndSettle();

      // Fill register form
      await tester.enterText(
        find.widgetWithText(TextField, 'Ad Soyad'), 
        'Test User'
      );
      await tester.enterText(
        find.widgetWithText(TextField, 'E-Posta'), 
        'test@example.com'
      );
      await tester.enterText(
        find.widgetWithText(TextField, 'Şifre'), 
        'password123'
      );
      await tester.enterText(
        find.widgetWithText(TextField, 'Şifre Tekrar'), 
        'password123'
      );

      // Accept terms
      await tester.tap(find.byType(Checkbox));
      await tester.pumpAndSettle();

      // Submit registration
      await tester.tap(find.text('Şimdi Kaydol'));
      await tester.pumpAndSettle(const Duration(seconds: 5));

      // Should navigate to home or show error
      // (depends on API response)
    });
  });
}
*/

// ==================== UNIT TEST EXAMPLES ====================

/*
// test/unit_test/models_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:dating_app/data/models/user/user_model.dart';
import 'package:dating_app/data/models/movie/movie_model.dart';

void main() {
  group('UserModel Tests', () {
    test('should create UserModel from JSON', () {
      final json = {
        'id': 1,
        'name': 'Test User',
        'email': 'test@example.com',
      };

      final user = UserModel.fromJson(json);

      expect(user.id, 1);
      expect(user.name, 'Test User');
      expect(user.email, 'test@example.com');
    });

    test('should generate correct initials', () {
      final user = UserModel(id: 1, name: 'John Doe');
      expect(user.initial, 'JD');
    });
  });

  group('MovieModel Tests', () {
    test('should create MovieModel from JSON', () {
      final json = {
        'id': 1,
        'title': 'Test Movie',
        'description': 'Test Description',
        'poster_url': 'https://example.com/poster.jpg',
        'rating': 4.5,
        'year': 2023,
      };

      final movie = MovieModel.fromJson(json);

      expect(movie.id, 1);
      expect(movie.title, 'Test Movie');
      expect(movie.rating, 4.5);
      expect(movie.displayRating, '4.5');
    });
  });
}
*/

// ==================== API SERVICE TESTS ====================

/*
// test/unit_test/api_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;
import 'package:dating_app/data/services/api_service.dart';

class MockHttpClient extends Mock implements http.Client {}

void main() {
  group('ApiService Tests', () {
    late MockHttpClient mockHttpClient;

    setUp(() {
      mockHttpClient = MockHttpClient();
    });

    test('should perform successful login', () async {
      // Mock successful response
      when(mockHttpClient.post(any, headers: anyNamed('headers'), body: anyNamed('body')))
          .thenAnswer((_) async => http.Response(
              '{"token": "test_token", "user": {"id": 1, "name": "Test User"}}', 
              200));

      // This would require dependency injection setup
      // final result = await ApiService.login(email: 'test@example.com', password: 'password');
      
      // expect(result.success, true);
      // expect(result.token, 'test_token');
    });
  });
}
*/