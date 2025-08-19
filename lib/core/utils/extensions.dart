// lib/core/utils/extensions.dart
import 'package:flutter/material.dart';

// ✅ String Extensions
extension StringExtensions on String {
  // Capitalize first letter
  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }
  
  // Capitalize each word
  String get capitalizeWords {
    if (isEmpty) return this;
    return split(' ')
        .map((word) => word.capitalize)
        .join(' ');
  }
  
  // Check if string is valid email
  bool get isValidEmail {
    const String pattern = r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$';
    return RegExp(pattern).hasMatch(this);
  }
  
  // Check if string is valid Turkish phone
  bool get isValidTurkishPhone {
    final cleanNumber = replaceAll(RegExp(r'[^\d+]'), '');
    const String pattern = r'^(\+90|0)?[1-9][0-9]{9}$';
    return RegExp(pattern).hasMatch(cleanNumber);
  }
  
  // Remove all spaces
  String get removeSpaces => replaceAll(' ', '');
  
  // Check if string is null or empty
  bool get isNullOrEmpty => trim().isEmpty;
  
  // Check if string is not null and not empty
  bool get isNotNullOrEmpty => trim().isNotEmpty;
  
  // Convert to snake_case
  String get toSnakeCase {
    return replaceAllMapped(RegExp(r'[A-Z]'), (match) {
      return '_${match.group(0)!.toLowerCase()}';
    }).replaceFirst(RegExp(r'^_'), '');
  }
  
  // Convert to camelCase
  String get toCamelCase {
    final words = split('_');
    if (words.isEmpty) return this;
    
    return words.first.toLowerCase() + 
           words.skip(1).map((word) => word.capitalize).join();
  }
  
  // Truncate string with ellipsis
  String truncate(int maxLength, {String ellipsis = '...'}) {
    if (length <= maxLength) return this;
    return '${substring(0, maxLength)}$ellipsis';
  }
  
  // Mask email (show only first 2 chars and domain)
  String get maskEmail {
    if (!isValidEmail) return this;
    final parts = split('@');
    final username = parts[0];
    final domain = parts[1];
    
    if (username.length <= 2) return this;
    return '${username.substring(0, 2)}***@$domain';
  }
  
  // Format phone number
  String get formatTurkishPhone {
    final cleanNumber = replaceAll(RegExp(r'[^\d]'), '');
    if (cleanNumber.length == 10) {
      return '${cleanNumber.substring(0, 3)} ${cleanNumber.substring(3, 6)} ${cleanNumber.substring(6, 8)} ${cleanNumber.substring(8, 10)}';
    }
    return this;
  }
}

// ✅ BuildContext Extensions
extension BuildContextExtensions on BuildContext {
  // Theme shortcuts
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
  ColorScheme get colorScheme => Theme.of(this).colorScheme;
  
  // MediaQuery shortcuts
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  Size get screenSize => MediaQuery.of(this).size;
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
  EdgeInsets get padding => MediaQuery.of(this).padding;
  EdgeInsets get viewInsets => MediaQuery.of(this).viewInsets;
  
  // Responsive helpers
  bool get isMobile => screenWidth < 768;
  bool get isTablet => screenWidth >= 768 && screenWidth < 1024;
  bool get isDesktop => screenWidth >= 1024;
  
  // Keyboard helpers
  bool get isKeyboardOpen => viewInsets.bottom > 0;
  double get keyboardHeight => viewInsets.bottom;
  
  // Navigation shortcuts
  void pop<T>([T? result]) => Navigator.of(this).pop(result);
  Future<T?> push<T>(Widget page) => Navigator.of(this).push<T>(
    MaterialPageRoute(builder: (_) => page),
  );
  Future<T?> pushReplacement<T, TO>(Widget page) => Navigator.of(this).pushReplacement<T, TO>(
    MaterialPageRoute(builder: (_) => page),
  );
  void popUntilFirst() => Navigator.of(this).popUntil((route) => route.isFirst);
  
  // SnackBar helpers
  void showSnackBar(String message, {
    Color? backgroundColor,
    Duration duration = const Duration(seconds: 3),
    SnackBarAction? action,
  }) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: backgroundColor,
        duration: duration,
        action: action,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
  
  void showSuccessSnackBar(String message) {
    showSnackBar(message, backgroundColor: Colors.green);
  }
  
  void showErrorSnackBar(String message) {
    showSnackBar(message, backgroundColor: Colors.red);
  }
  
  void showWarningSnackBar(String message) {
    showSnackBar(message, backgroundColor: Colors.orange);
  }
}

// ✅ DateTime Extensions
extension DateTimeExtensions on DateTime {
  // Format as Turkish date
  String get toTurkishDate {
    return '${day.toString().padLeft(2, '0')}.${month.toString().padLeft(2, '0')}.$year';
  }
  
  // Format as Turkish time
  String get toTurkishTime {
    return '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';
  }
  
  // Format as Turkish date and time
  String get toTurkishDateTime {
    return '$toTurkishDate $toTurkishTime';
  }
  
  // Time ago in Turkish
  String get timeAgoInTurkish {
    final now = DateTime.now();
    final difference = now.difference(this);
    
    if (difference.inDays > 7) {
      return toTurkishDate;
    } else if (difference.inDays > 0) {
      return '${difference.inDays} gün önce';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} saat önce';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} dakika önce';
    } else {
      return 'Şimdi';
    }
  }
  
  // Check if date is today
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }
  
  // Check if date is yesterday
  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year && month == yesterday.month && day == yesterday.day;
  }
}

// ✅ List Extensions
extension ListExtensions<T> on List<T> {
  // Get element safely
  T? elementAtOrNull(int index) {
    if (index >= 0 && index < length) {
      return elementAt(index);
    }
    return null;
  }
  
  // Check if list is null or empty
  bool get isNullOrEmpty => isEmpty;
  
  // Check if list is not null and not empty
  bool get isNotNullOrEmpty => isNotEmpty;
  
  // Get random element
  T? get randomElement {
    if (isEmpty) return null;
    return elementAt((length * (DateTime.now().millisecondsSinceEpoch % 1000) / 1000).floor());
  }
  
  // Chunk list into smaller lists
  List<List<T>> chunk(int size) {
    final chunks = <List<T>>[];
    for (int i = 0; i < length; i += size) {
      chunks.add(sublist(i, i + size > length ? length : i + size));
    }
    return chunks;
  }
}

// ✅ Double Extensions
extension DoubleExtensions on double {
  // Format as currency (Turkish Lira)
  String get toTurkishCurrency {
    return '₺${toStringAsFixed(2).replaceAll('.', ',')}';
  }
  
  // Format as percentage
  String get toPercentage {
    return '%${(this * 100).toStringAsFixed(1).replaceAll('.', ',')}';
  }
  
  // Round to decimal places
  double roundToDecimal(int decimalPlaces) {
    final factor = 1.0 * (10 * decimalPlaces);
    return (this * factor).round() / factor;
  }
}