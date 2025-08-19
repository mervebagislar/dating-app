// lib/core/validators/input_validators.dart
import 'package:flutter/material.dart';

// ✅ Input Validation Utilities
class InputValidators {
  // ✅ Email validation
  static String? validateEmail(String? email) {
    if (email == null || email.isEmpty) {
      return 'E-posta gerekli';
    }
    
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(email)) {
      return 'Geçerli bir e-posta adresi girin';
    }
    
    return null;
  }

  // ✅ Password validation
  static String? validatePassword(String? password) {
    if (password == null || password.isEmpty) {
      return 'Şifre gerekli';
    }
    
    if (password.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır';
    }
    
    if (password.length > 50) {
      return 'Şifre en fazla 50 karakter olmalıdır';
    }
    
    return null;
  }

  // ✅ Confirm password validation
  static String? validateConfirmPassword(String? confirmPassword, String password) {
    if (confirmPassword == null || confirmPassword.isEmpty) {
      return 'Şifre tekrarı gerekli';
    }
    
    if (confirmPassword != password) {
      return 'Şifreler eşleşmiyor';
    }
    
    return null;
  }

  // ✅ Name validation
  static String? validateName(String? name) {
    if (name == null || name.isEmpty) {
      return 'Ad soyad gerekli';
    }
    
    if (name.length < 2) {
      return 'Ad soyad en az 2 karakter olmalıdır';
    }
    
    if (name.length > 50) {
      return 'Ad soyad en fazla 50 karakter olmalıdır';
    }
    
    final nameRegex = RegExp(r'^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$');
    if (!nameRegex.hasMatch(name)) {
      return 'Ad soyad sadece harf içermelidir';
    }
    
    return null;
  }

  // ✅ Phone number validation
  static String? validatePhone(String? phone) {
    if (phone == null || phone.isEmpty) {
      return 'Telefon numarası gerekli';
    }
    
    final phoneRegex = RegExp(r'^\+?[\d\s\-\(\)]{10,}$');
    if (!phoneRegex.hasMatch(phone)) {
      return 'Geçerli bir telefon numarası girin';
    }
    
    return null;
  }

  // ✅ Required field validation
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName gerekli';
    }
    
    return null;
  }

  // ✅ Min length validation
  static String? validateMinLength(String? value, int minLength, String fieldName) {
    if (value == null || value.length < minLength) {
      return '$fieldName en az $minLength karakter olmalıdır';
    }
    
    return null;
  }

  // ✅ Max length validation
  static String? validateMaxLength(String? value, int maxLength, String fieldName) {
    if (value != null && value.length > maxLength) {
      return '$fieldName en fazla $maxLength karakter olmalıdır';
    }
    
    return null;
  }

  // ✅ URL validation
  static String? validateUrl(String? url) {
    if (url == null || url.isEmpty) {
      return null; // URL is optional
    }
    
    try {
      final uri = Uri.parse(url);
      if (!uri.hasScheme || !uri.hasAuthority) {
        return 'Geçerli bir URL girin';
      }
    } catch (_) {
      return 'Geçerli bir URL girin';
    }
    
    return null;
  }

  // ✅ Age validation
  static String? validateAge(int? age) {
    if (age == null) {
      return 'Yaş gerekli';
    }
    
    if (age < 18) {
      return 'Yaş en az 18 olmalıdır';
    }
    
    if (age > 120) {
      return 'Geçerli bir yaş girin';
    }
    
    return null;
  }

  // ✅ File size validation (in MB)
  static String? validateFileSize(int fileSizeBytes, double maxSizeMB) {
    final fileSizeMB = fileSizeBytes / (1024 * 1024);
    
    if (fileSizeMB > maxSizeMB) {
      return 'Dosya boyutu en fazla ${maxSizeMB.toStringAsFixed(1)}MB olmalıdır';
    }
    
    return null;
  }

  // ✅ File type validation
  static String? validateFileType(String fileName, List<String> allowedExtensions) {
    if (fileName.isEmpty) return 'Dosya adı boş olamaz';
    
    final extension = fileName.split('.').last.toLowerCase();
    if (!allowedExtensions.contains(extension)) {
      return 'Sadece ${allowedExtensions.join(', ')} formatları desteklenir';
    }
    
    return null;
  }

  // ✅ Credit card number validation (Luhn algorithm)
  static String? validateCreditCard(String? cardNumber) {
    if (cardNumber == null || cardNumber.isEmpty) {
      return 'Kart numarası gerekli';
    }
    
    // Remove spaces and dashes
    final cleanNumber = cardNumber.replaceAll(RegExp(r'[\s\-]'), '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return 'Geçerli bir kart numarası girin';
    }
    
    // Luhn algorithm
    int sum = 0;
    bool alternate = false;
    
    for (int i = cleanNumber.length - 1; i >= 0; i--) {
      int n = int.parse(cleanNumber[i]);
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      sum += n;
      alternate = !alternate;
    }
    
    if (sum % 10 != 0) {
      return 'Geçersiz kart numarası';
    }
    
    return null;
  }

  // ✅ Turkish ID number validation
  static String? validateTurkishId(String? idNumber) {
    if (idNumber == null || idNumber.isEmpty) {
      return 'TC Kimlik No gerekli';
    }
    
    if (idNumber.length != 11) {
      return 'TC Kimlik No 11 haneli olmalıdır';
    }
    
    if (!RegExp(r'^[0-9]+$').hasMatch(idNumber)) {
      return 'TC Kimlik No sadece rakam içermelidir';
    }
    
    // First digit cannot be 0
    if (idNumber[0] == '0') {
      return 'Geçersiz TC Kimlik No';
    }
    
    // Algorithm validation
    int oddSum = 0;
    int evenSum = 0;
    
    for (int i = 0; i < 9; i++) {
      if (i % 2 == 0) {
        oddSum += int.parse(idNumber[i]);
      } else {
        evenSum += int.parse(idNumber[i]);
      }
    }
    
    int digit10 = ((oddSum * 7) - evenSum) % 10;
    int digit11 = (oddSum + evenSum + digit10) % 10;
    
    if (int.parse(idNumber[9]) != digit10 || int.parse(idNumber[10]) != digit11) {
      return 'Geçersiz TC Kimlik No';
    }
    
    return null;
  }
}
