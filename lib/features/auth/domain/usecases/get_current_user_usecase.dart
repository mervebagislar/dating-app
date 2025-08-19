// lib/features/auth/domain/usecases/get_current_user_usecase.dart
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/usecases/usecases.dart';
import '../../../../core/errors/failures.dart';

import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

class GetCurrentUserUseCase implements UseCaseNoParams<UserEntity> {
  final AuthRepository repository;

  GetCurrentUserUseCase(this.repository);

  @override
  Future<Either<Failure, UserEntity>> call() async {
    return await repository.getCurrentUser();
  }
}