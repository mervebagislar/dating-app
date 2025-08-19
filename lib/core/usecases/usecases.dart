// lib/core/usecases/usecase.dart
import 'package:dartz/dartz.dart';
import '../errors/failures.dart';

// ✅ Base UseCase interface
abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

// ✅ UseCase without parameters
abstract class UseCaseNoParams<Type> {
  Future<Either<Failure, Type>> call();
}

// ✅ No parameters class
class NoParams {
  const NoParams();
}
