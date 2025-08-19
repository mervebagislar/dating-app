// lib/core/extensions/string_extensions.dart

// ✅ String Extensions for common operations
extension StringExtensions on String {
  // ✅ Capitalize first letter
  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }

  // ✅ Capitalize each word
  String get capitalizeWords {
    if (isEmpty) return this;
    return split(' ').map((word) => word.capitalize).join(' ');
  }

  // ✅ Check if string is valid email
  bool get isValidEmail {
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegex.hasMatch(this);
  }

  // ✅ Check if string is valid phone number
  bool get isValidPhone {
    final phoneRegex = RegExp(r'^\+?[\d\s\-\(\)]{10,}$');
    return phoneRegex.hasMatch(this);
  }

  // ✅ Check if string is valid URL
  bool get isValidUrl {
    try {
      final uri = Uri.parse(this);
      return uri.hasScheme && uri.hasAuthority;
    } catch (_) {
      return false;
    }
  }

  // ✅ Truncate string with ellipsis
  String truncate(int maxLength, {String suffix = '...'}) {
    if (length <= maxLength) return this;
    return '${substring(0, maxLength)}$suffix';
  }

  // ✅ Remove extra whitespace
  String get removeExtraWhitespace {
    return replaceAll(RegExp(r'\s+'), ' ').trim();
  }

  // ✅ Convert to title case
  String get toTitleCase {
    if (isEmpty) return this;
    return split(' ').map((word) => word.capitalize).join(' ');
  }

  // ✅ Check if string contains only numbers
  bool get isNumeric {
    return RegExp(r'^[0-9]+$').hasMatch(this);
  }

  // ✅ Check if string contains only letters
  bool get isAlphabetic {
    return RegExp(r'^[a-zA-Z\s]+$').hasMatch(this);
  }

  // ✅ Check if string contains only letters and numbers
  bool get isAlphanumeric {
    return RegExp(r'^[a-zA-Z0-9\s]+$').hasMatch(this);
  }

  // ✅ Get initials from name
  String get initials {
    if (isEmpty) return '';
    final parts = split(' ').where((part) => part.isNotEmpty).toList();
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else if (parts.isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return '';
  }

  // ✅ Convert to slug (URL-friendly)
  String get toSlug {
    return toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9\s-]'), '')
        .replaceAll(RegExp(r'\s+'), '-')
        .replaceAll(RegExp(r'-+'), '-')
        .trim();
  }

  // ✅ Check if string is palindrome
  bool get isPalindrome {
    final clean = toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');
    return clean == clean.split('').reversed.join('');
  }

  // ✅ Count words
  int get wordCount {
    if (isEmpty) return 0;
    return split(RegExp(r'\s+')).where((word) => word.isNotEmpty).length;
  }

  // ✅ Get first N characters
  String first(int n) {
    if (n <= 0) return '';
    if (n >= length) return this;
    return substring(0, n);
  }

  // ✅ Get last N characters
  String last(int n) {
    if (n <= 0) return '';
    if (n >= length) return this;
    return substring(length - n);
  }

  // ✅ Reverse string
  String get reversed {
    return split('').reversed.join('');
  }

  // ✅ Check if string starts with vowel
  bool get startsWithVowel {
    if (isEmpty) return false;
    return RegExp(r'^[aeiouAEIOU]').hasMatch(this);
  }

  // ✅ Check if string ends with vowel
  bool get endsWithVowel {
    if (isEmpty) return false;
    return RegExp(r'[aeiouAEIOU]$').hasMatch(this);
  }
}
