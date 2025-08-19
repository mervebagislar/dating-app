// lib/features/auth/domain/usecases/register_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/usecases/usecases.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/errors/failures.dart';

import '../../../../core/utils/validators.dart';
import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase implements UseCase<UserEntity, RegisterParams> {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  @override
  Future<Either<Failure, UserEntity>> call(RegisterParams params) async {
    // ✅ Validate input parameters
    final nameValidation = Validators.validateName(params.name);
    if (nameValidation != null) {
      return Left(ValidationFailure(message: nameValidation));
    }
    
    final emailValidation = Validators.validateEmail(params.email);
    if (emailValidation != null) {
      return Left(ValidationFailure(message: emailValidation));
    }
    
    final passwordValidation = Validators.validatePassword(params.password);
    if (passwordValidation != null) {
      return Left(ValidationFailure(message: passwordValidation));
    }
    
    final confirmPasswordValidation = Validators.validateConfirmPassword(
      params.confirmPassword, 
      params.password,
    );
    if (confirmPasswordValidation != null) {
      return Left(ValidationFailure(message: confirmPasswordValidation));
    }
    
    // ✅ Call repository
    return await repository.register(
      name: params.name,
      email: params.email,
      password: params.password,
    );
  }
}

class RegisterParams extends Equatable {
  final String name;
  final String email;
  final String password;
  final String confirmPassword;

  const RegisterParams({
    required this.name,
    required this.email,
    required this.password,
    required this.confirmPassword,
  });

  @override
  List<Object> get props => [name, email, password, confirmPassword];
}