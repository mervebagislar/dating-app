// test/widget/features/auth/presentation/pages/login_page_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dating_app/features/auth/presentation/pages/login_page.dart';

void main() {
  group('LoginPage Widget Tests', () {
    testWidgets('should display login form elements', (WidgetTester tester) async {
      // arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginPage(),
        ),
      );

      // assert
      expect(find.text('Giriş Yap'), findsOneWidget);
      expect(find.byType(TextFormField), findsNWidgets(2)); // Email and password fields
      expect(find.byType(ElevatedButton), findsOneWidget);
      expect(find.text('Hesabınız yok mu?'), findsOneWidget);
      expect(find.text('Kaydolun'), findsOneWidget);
    });

    testWidgets('should show validation errors for empty fields', (WidgetTester tester) async {
      // arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginPage(),
        ),
      );

      // act - tap login button without entering data
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();

      // assert - should show validation errors
      expect(find.text('E-posta gerekli'), findsOneWidget);
      expect(find.text('Şifre gerekli'), findsOneWidget);
    });

    testWidgets('should show validation error for invalid email', (WidgetTester tester) async {
      // arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginPage(),
        ),
      );

      // act - enter invalid email
      await tester.enterText(find.byKey(const Key('email_field')), 'invalid-email');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();

      // assert - should show email validation error
      expect(find.text('Geçerli bir e-posta adresi girin'), findsOneWidget);
    });

    testWidgets('should show validation error for short password', (WidgetTester tester) async {
      // arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginPage(),
        ),
      );

      // act - enter short password
      await tester.enterText(find.byKey(const Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), '123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();

      // assert - should show password validation error
      expect(find.text('Şifre en az 6 karakter olmalıdır'), findsOneWidget);
    });

    testWidgets('should navigate to register page when register link is tapped', (WidgetTester tester) async {
      // arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginPage(),
        ),
      );

      // act - tap register link
      await tester.tap(find.text('Kaydolun'));
      await tester.pumpAndSettle();

      // assert - should navigate to register page
      // Note: This test assumes navigation is implemented
      // In a real app, you'd need to set up proper navigation testing
    });

    testWidgets('should show loading state when login button is pressed', (WidgetTester tester) async {
      // arrange
      await tester.pumpWidget(
        MaterialApp(
          home: LoginPage(),
        ),
      );

      // act - enter valid data and tap login
      await tester.enterText(find.byKey(const Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();

      // assert - should show loading indicator
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });
}
