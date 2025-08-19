// lib/core/services/language_service.dart - FIXED IMPORT ORDER
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../localization/app_localizations.dart';

class LanguageService {
  static const String _languageKey = 'selected_language';
  static const String _defaultLanguage = 'tr';

  // ✅ SUPPORTED LANGUAGES
  static const Map<String, Map<String, String>> supportedLanguages = {
    'tr': {
      'name': 'Türkçe',
      'nativeName': 'Türkçe',
      'flag': '🇹🇷',
      'code': 'tr',
      'countryCode': 'TR',
    },
    'en': {
      'name': 'English',
      'nativeName': 'English',
      'flag': '🇺🇸',
      'code': 'en',
      'countryCode': 'US',
    },
  };

  // ✅ GET CURRENT LANGUAGE
  static Future<String> getCurrentLanguage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_languageKey) ?? _defaultLanguage;
    } catch (e) {
      print('❌ Error getting current language: $e');
      return _defaultLanguage;
    }
  }

  // ✅ SET LANGUAGE
  static Future<bool> setLanguage(String languageCode) async {
    try {
      if (!supportedLanguages.containsKey(languageCode)) {
        print('❌ Unsupported language: $languageCode');
        return false;
      }

      final prefs = await SharedPreferences.getInstance();
      final success = await prefs.setString(_languageKey, languageCode);
      
      if (success) {
        print('✅ Language set to: $languageCode');
      } else {
        print('❌ Failed to set language: $languageCode');
      }
      
      return success;
    } catch (e) {
      print('❌ Error setting language: $e');
      return false;
    }
  }

  // ✅ GET CURRENT LOCALE
  static Future<Locale> getCurrentLocale() async {
    final languageCode = await getCurrentLanguage();
    final languageData = supportedLanguages[languageCode]!;
    return Locale(languageData['code']!, languageData['countryCode']!);
  }

  // ✅ GET LANGUAGE NAME
  static String getLanguageName(String languageCode) {
    return supportedLanguages[languageCode]?['name'] ?? 'Unknown';
  }

  // ✅ GET NATIVE LANGUAGE NAME
  static String getNativeLanguageName(String languageCode) {
    return supportedLanguages[languageCode]?['nativeName'] ?? 'Unknown';
  }

  // ✅ GET LANGUAGE FLAG
  static String getLanguageFlag(String languageCode) {
    return supportedLanguages[languageCode]?['flag'] ?? '🌐';
  }

  // ✅ GET ALL SUPPORTED LANGUAGES
  static List<Map<String, String>> getAllSupportedLanguages() {
    return supportedLanguages.values.toList();
  }

  // ✅ IS LANGUAGE SUPPORTED
  static bool isLanguageSupported(String languageCode) {
    return supportedLanguages.containsKey(languageCode);
  }

  // ✅ GET SYSTEM LOCALE OR DEFAULT
  static Future<Locale> getSystemLocaleOrDefault() async {
    try {
      // Try to get system locale
      final systemLocale = PlatformDispatcher.instance.locale;
      if (isLanguageSupported(systemLocale.languageCode)) {
        return systemLocale;
      }
      
      // Fallback to default
      return await getCurrentLocale();
    } catch (e) {
      print('❌ Error getting system locale: $e');
      return await getCurrentLocale();
    }
  }

  // ✅ CLEAR LANGUAGE PREFERENCE
  static Future<bool> clearLanguagePreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_languageKey);
    } catch (e) {
      print('❌ Error clearing language preference: $e');
      return false;
    }
  }
}

// ✅ LANGUAGE CUBIT FOR STATE MANAGEMENT
class LanguageCubit extends Cubit<Locale> {
  LanguageCubit() : super(const Locale('tr', 'TR')) {
    _loadSavedLanguage();
  }

  // ✅ LOAD SAVED LANGUAGE
  Future<void> _loadSavedLanguage() async {
    try {
      final locale = await LanguageService.getCurrentLocale();
      emit(locale);
      print('✅ Language loaded: ${locale.languageCode}');
    } catch (e) {
      print('❌ Error loading saved language: $e');
      emit(const Locale('tr', 'TR')); // Default fallback
    }
  }

  // ✅ CHANGE LANGUAGE
  Future<void> changeLanguage(String languageCode) async {
    try {
      if (!LanguageService.isLanguageSupported(languageCode)) {
        print('❌ Unsupported language: $languageCode');
        return;
      }

      final success = await LanguageService.setLanguage(languageCode);
      if (success) {
        final locale = await LanguageService.getCurrentLocale();
        emit(locale);
        print('✅ Language changed to: ${locale.languageCode}');
      } else {
        print('❌ Failed to change language to: $languageCode');
      }
    } catch (e) {
      print('❌ Error changing language: $e');
    }
  }

  // ✅ GET CURRENT LANGUAGE CODE
  String get currentLanguageCode => state.languageCode;

  // ✅ GET CURRENT LANGUAGE NAME
  String get currentLanguageName => 
      LanguageService.getLanguageName(currentLanguageCode);

  // ✅ GET CURRENT LANGUAGE FLAG
  String get currentLanguageFlag => 
      LanguageService.getLanguageFlag(currentLanguageCode);

  // ✅ IS TURKISH
  bool get isTurkish => currentLanguageCode == 'tr';

  // ✅ IS ENGLISH
  bool get isEnglish => currentLanguageCode == 'en';
}

// ✅ LANGUAGE SELECTION WIDGET
class LanguageSelectionWidget extends StatelessWidget {
  final Function(String)? onLanguageChanged;
  final bool showFlags;

  const LanguageSelectionWidget({
    super.key,
    this.onLanguageChanged,
    this.showFlags = true,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LanguageCubit, Locale>(
      builder: (context, currentLocale) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              context.l10n.language,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            ...LanguageService.getAllSupportedLanguages().map((language) {
              final isSelected = language['code'] == currentLocale.languageCode;
              
              return GestureDetector(
                onTap: () {
                  final languageCode = language['code']!;
                  context.read<LanguageCubit>().changeLanguage(languageCode);
                  onLanguageChanged?.call(languageCode);
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isSelected 
                        ? const Color(0xFFE50914).withOpacity(0.2)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isSelected 
                          ? const Color(0xFFE50914)
                          : Colors.white.withOpacity(0.2),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      if (showFlags) ...[
                        Text(
                          language['flag']!,
                          style: const TextStyle(fontSize: 24),
                        ),
                        const SizedBox(width: 12),
                      ],
                      Expanded(
                        child: Text(
                          language['nativeName']!,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                            color: isSelected ? Colors.white : Colors.white.withOpacity(0.8),
                          ),
                        ),
                      ),
                      if (isSelected)
                        const Icon(
                          Icons.check_circle,
                          color: Color(0xFFE50914),
                          size: 20,
                        ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ],
        );
      },
    );
  }
}