// lib/features/auth/domain/usecases/logout_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/usecases/usecases.dart';
import '../../../../core/errors/failures.dart';

import '../repositories/auth_repository.dart';

class LogoutUseCase implements UseCaseNoParams<void> {
  final AuthRepository repository;

  LogoutUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call() async {
    return await repository.logout();
  }
}
