import 'dart:io';
import 'package:dartz/dartz.dart';
import 'package:dating_app/core/usecases/usecases.dart';
import 'package:dating_app/features/profile/domain/entities/profile_entity.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/errors/failures.dart';

import '../repositories/profile_repository.dart';

class UploadPhotoUseCase implements UseCase<PhotoUploadEntity, UploadPhotoParams> {
  final ProfileRepository repository;

  UploadPhotoUseCase(this.repository);

  @override
  Future<Either<Failure, PhotoUploadEntity>> call(UploadPhotoParams params) async {
    return await repository.uploadPhoto(params.imageFile);
  }
}

class UploadPhotoParams extends Equatable {
  final File imageFile;

  const UploadPhotoParams({required this.imageFile});

  @override
  List<Object> get props => [imageFile];
}