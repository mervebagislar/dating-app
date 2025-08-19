import 'dart:io';
import '../../../../core/errors/exceptions.dart';
import '../../../auth/data/models/user_model.dart';
import '../models/profile_model.dart';
import '../models/photo_upload_model.dart';

abstract class ProfileRemoteDataSource {
  Future<ProfileModel> getProfile();
  Future<ProfileModel> updateProfile(ProfileModel profile);
  Future<PhotoUploadModel> uploadPhoto(File imageFile);
}