// android/app/build.gradle.kts (SDK 35 güncellemesi)

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.mervebagislar.dating_app"
    compileSdk = 35  // ← DÜZELTME: 34'ten 35'e güncelledik
    ndkVersion = "27.0.12077973"

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.mervebagislar.dating_app"
        minSdk = flutter.minSdkVersion  // Bu genelde 21, değiştirmeyin
        targetSdk = 34  // Bu 34'te kalabilir, compileSdk'dan farklı
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    source = "../.."
}