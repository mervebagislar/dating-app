// lib/core/utils/validators.dart

class Validators {
  // ✅ Email Validation
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'E-posta adresi gerekli';
    }
    
    // Email regex pattern
    const String pattern = r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$';
    final RegExp regex = RegExp(pattern);
    
    if (!regex.hasMatch(value)) {
      return 'Geçerli bir e-posta adresi girin';
    }
    
    return null;
  }

  // ✅ Password Validation
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Şifre gerekli';
    }
    
    if (value.length < 6) {
      return 'Şifre en az 6 karakter olmalı';
    }
    
    if (value.length > 50) {
      return 'Şifre en fazla 50 karakter olabilir';
    }
    
    return null;
  }

  // ✅ Name Validation
  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Ad Soyad gereklidir';
    }
    
    final trimmedValue = value.trim();
    
    if (trimmedValue.length < 2) {
      return 'Ad en az 2 karakter olmalı';
    }
    
    if (trimmedValue.length > 50) {
      return 'Ad en fazla 50 karakter olabilir';
    }
    
    // Check if name has at least first name and last name
    final nameParts = trimmedValue.split(' ').where((part) => part.isNotEmpty).toList();
    if (nameParts.length < 2) {
      return 'Lütfen ad ve soyadınızı giriniz';
    }
    
    return null;
  }

  // ✅ Confirm Password Validation
  static String? validateConfirmPassword(String? value, String? originalPassword) {
    if (value == null || value.isEmpty) {
      return 'Şifre tekrarı gereklidir';
    }
    
    if (value != originalPassword) {
      return 'Şifreler eşleşmiyor';
    }
    
    return null;
  }

  // ✅ Required Field Validation
  static String? validateRequired(String? value, {String fieldName = 'Bu alan'}) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName gereklidir';
    }
    return null;
  }

  // ✅ Phone Number Validation (Turkish format)
  static String? validatePhoneNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Telefon numarası gerekli';
    }
    
    // Remove spaces and special characters
    final cleanNumber = value.replaceAll(RegExp(r'[^\d+]'), '');
    
    // Turkish phone number patterns
    const String pattern = r'^(\+90|0)?[1-9][0-9]{9}$';
    final RegExp regex = RegExp(pattern);
    
    if (!regex.hasMatch(cleanNumber)) {
      return 'Geçerli bir telefon numarası girin';
    }
    
    return null;
  }

  // ✅ URL Validation
  static String? validateUrl(String? value) {
    if (value == null || value.isEmpty) {
      return null; // URL is optional
    }
    
    try {
      final uri = Uri.parse(value);
      if (!uri.hasScheme || (!uri.isScheme('http') && !uri.isScheme('https'))) {
        return 'Geçerli bir URL girin (http:// veya https://)';
      }
    } catch (e) {
      return 'Geçerli bir URL girin';
    }
    
    return null;
  }

  // ✅ Age Validation
  static String? validateAge(String? value) {
    if (value == null || value.isEmpty) {
      return 'Yaş gerekli';
    }
    
    final age = int.tryParse(value);
    if (age == null) {
      return 'Geçerli bir yaş girin';
    }
    
    if (age < 18) {
      return 'En az 18 yaşında olmalısınız';
    }
    
    if (age > 100) {
      return 'Geçerli bir yaş girin';
    }
    
    return null;
  }

  // ✅ File Size Validation (for image uploads)
  static String? validateFileSize(int fileSizeBytes, {int maxSizeMB = 10}) {
    const int bytesInMB = 1024 * 1024;
    final int maxSizeBytes = maxSizeMB * bytesInMB;
    
    if (fileSizeBytes > maxSizeBytes) {
      return 'Dosya boyutu ${maxSizeMB}MB\'dan küçük olmalı';
    }
    
    return null;
  }

  // ✅ Image Format Validation
  static String? validateImageFormat(String fileName) {
    const List<String> allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    final String extension = fileName.split('.').last.toLowerCase();
    
    if (!allowedFormats.contains(extension)) {
      return 'Sadece JPG, PNG, WEBP formatları destekleniyor';
    }
    
    return null;
  }

  // ✅ Helper Methods
  static bool isValidEmail(String email) {
    return validateEmail(email) == null;
  }
  
  static bool isValidPassword(String password) {
    return validatePassword(password) == null;
  }
  
  static bool isValidName(String name) {
    return validateName(name) == null;
  }
}