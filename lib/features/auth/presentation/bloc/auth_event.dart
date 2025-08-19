// lib/features/auth/presentation/bloc/auth_event.dart
import 'dart:io';
import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

// ✅ Login Event
class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  const LoginRequested({
    required this.email,
    required this.password,
  });

  @override
  List<Object> get props => [email, password];
}

// ✅ Register Event
class RegisterRequested extends AuthEvent {
  final String name;
  final String email;
  final String password;
  final String confirmPassword;

  const RegisterRequested({
    required this.name,
    required this.email,
    required this.password,
    required this.confirmPassword,
  });

  @override
  List<Object> get props => [name, email, password, confirmPassword];
}

// ✅ Logout Event
class LogoutRequested extends AuthEvent {
  const LogoutRequested();
}

// ✅ Check Authentication Status Event
class AuthStatusRequested extends AuthEvent {
  const AuthStatusRequested();
}

// ✅ Get Current User Event
class CurrentUserRequested extends AuthEvent {
  const CurrentUserRequested();
}

// ✅ Refresh User Profile Event
class UserProfileRefreshRequested extends AuthEvent {
  const UserProfileRefreshRequested();
}

// ✅ Upload Profile Photo Event
class ProfilePhotoUploadRequested extends AuthEvent {
  final File photo;

  const ProfilePhotoUploadRequested({
    required this.photo,
  });

  @override
  List<Object> get props => [photo];
}

// ✅ Clear Auth Data Event
class AuthDataClearRequested extends AuthEvent {
  const AuthDataClearRequested();
}

// ✅ Validate Token Event
class TokenValidationRequested extends AuthEvent {
  const TokenValidationRequested();
}

// ✅ Reset Auth State Event (for navigation)
class AuthStateReset extends AuthEvent {
  const AuthStateReset();
}