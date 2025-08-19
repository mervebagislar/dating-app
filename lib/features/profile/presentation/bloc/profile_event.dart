import 'dart:io';
import 'package:equatable/equatable.dart';
import '../../domain/entities/profile_entity.dart';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();

  @override
  List<Object?> get props => [];
}

class LoadProfileEvent extends ProfileEvent {
  const LoadProfileEvent();
}

class RefreshProfileEvent extends ProfileEvent {
  const RefreshProfileEvent();
}

class UpdateProfileEvent extends ProfileEvent {
  final ProfileEntity profile;

  const UpdateProfileEvent({required this.profile});

  @override
  List<Object> get props => [profile];
}

class UploadPhotoEvent extends ProfileEvent {
  final File imageFile;

  const UploadPhotoEvent({required this.imageFile});

  @override
  List<Object> get props => [imageFile];
}

class LogoutEvent extends ProfileEvent {
  const LogoutEvent();
}