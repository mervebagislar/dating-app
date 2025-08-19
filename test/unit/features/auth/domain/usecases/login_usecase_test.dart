// test/unit/features/auth/domain/usecases/login_usecase_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:dating_app/features/auth/domain/usecases/login_usecase.dart';

void main() {
  group('LoginUseCase', () {
    test('should create LoginParams with correct values', () {
      // arrange
      const email = 'test@example.com';
      const password = 'password123';

      // act
      const params = LoginParams(email: email, password: password);

      // assert
      expect(params.email, equals(email));
      expect(params.password, equals(password));
    });

    test('should have correct props for LoginParams', () {
      // arrange
      const params1 = LoginParams(
        email: 'test1@example.com',
        password: 'password1',
      );
      const params2 = LoginParams(
        email: 'test1@example.com',
        password: 'password1',
      );
      const params3 = LoginParams(
        email: 'test2@example.com',
        password: 'password2',
      );

      // assert
      expect(params1, equals(params2));
      expect(params1, isNot(equals(params3)));
    });

    test('should validate email format', () {
      // arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
      ];

      // assert
      for (final email in validEmails) {
        expect(_isValidEmail(email), isTrue, reason: '$email should be valid');
      }

      for (final email in invalidEmails) {
        expect(
          _isValidEmail(email),
          isFalse,
          reason: '$email should be invalid',
        );
      }
    });

    test('should validate password length', () {
      // arrange
      const validPasswords = ['password123', '1234567890', 'abcdefghij'];

      const invalidPasswords = ['123', 'abc', ''];

      // assert
      for (final password in validPasswords) {
        expect(
          _isValidPassword(password),
          isTrue,
          reason: '$password should be valid',
        );
      }

      for (final password in invalidPasswords) {
        expect(
          _isValidPassword(password),
          isFalse,
          reason: '$password should be invalid',
        );
      }
    });
  });
}

// Helper functions for validation testing
bool _isValidEmail(String email) {
  final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
  return emailRegex.hasMatch(email);
}

bool _isValidPassword(String password) {
  return password.length >= 6;
}
