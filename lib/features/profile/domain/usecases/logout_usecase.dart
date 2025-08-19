import 'package:dartz/dartz.dart';
import 'package:dating_app/core/errors/failures.dart';
import 'package:dating_app/core/usecases/usecases.dart';
import '../repositories/profile_repository.dart';

class ProfileLogoutUseCase implements UseCase<Unit, NoParams> {
  final ProfileRepository repository;

  ProfileLogoutUseCase(this.repository);

  @override
  Future<Either<Failure, Unit>> call(NoParams params) async {
    return await repository.logout();
  }
}
