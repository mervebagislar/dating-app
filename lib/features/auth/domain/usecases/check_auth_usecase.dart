// lib/features/auth/domain/usecases/check_auth_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/usecases/usecases.dart';
import '../../../../core/errors/failures.dart';

import '../repositories/auth_repository.dart';

class CheckAuthUseCase implements UseCaseNoParams<bool> {
  final AuthRepository repository;

  CheckAuthUseCase(this.repository);

  @override
  Future<Either<Failure, bool>> call() async {
    return await repository.isAuthenticated();
  }
}
