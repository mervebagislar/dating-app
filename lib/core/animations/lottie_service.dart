// lib/core/animations/lottie_service.dart
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class LottieService {
  // ✅ ANIMATION PATHS
  static const String _basePath = 'assets/animations/';
  
  static const Map<String, String> animations = {
    'loading': '${_basePath}loading.json',
    'heart': '${_basePath}heart.json',
    'success': '${_basePath}success.json',
    'error': '${_basePath}error.json',
    'empty': '${_basePath}empty.json',
    'premium': '${_basePath}premium.json',
    'photo_upload': '${_basePath}photo_upload.json',
    'movie_loading': '${_basePath}movie_loading.json',
    'splash': '${_basePath}splash.json',
    'confetti': '${_basePath}confetti.json',
  };

  // ✅ PRELOAD ANIMATIONS
  static Future<void> preloadAnimations(BuildContext context) async {
    try {
      print('🎬 Preloading Lottie animations...');
      
      for (final animationPath in animations.values) {
        try {
          await AssetLottie(animationPath).load();
          print('✅ Preloaded: $animationPath');
        } catch (e) {
          print('⚠️ Failed to preload $animationPath: $e');
        }
      }
      
      print('✅ Lottie animations preloaded');
    } catch (e) {
      print('❌ Error preloading animations: $e');
    }
  }

  // ✅ GET ANIMATION PATH
  static String getAnimationPath(String key) {
    return animations[key] ?? animations['loading']!;
  }

  // ✅ CHECK IF ANIMATION EXISTS
  static bool hasAnimation(String key) {
    return animations.containsKey(key);
  }
}

// ✅ ANIMATED LOADING WIDGET
class LottieLoadingWidget extends StatelessWidget {
  final double? width;
  final double? height;
  final String? text;
  final Color? textColor;

  const LottieLoadingWidget({
    super.key,
    this.width = 80,
    this.height = 80,
    this.text,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: width,
          height: height,
          child: Lottie.asset(
            LottieService.getAnimationPath('loading'),
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
              );
            },
          ),
        ),
        if (text != null) ...[
          const SizedBox(height: 16),
          Text(
            text!,
            style: TextStyle(
              color: textColor ?? Colors.white.withOpacity(0.7),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }
}

// ✅ ANIMATED HEART WIDGET
class LottieHeartWidget extends StatefulWidget {
  final double size;
  final bool isLiked;
  final VoidCallback? onTap;

  const LottieHeartWidget({
    super.key,
    this.size = 32,
    required this.isLiked,
    this.onTap,
  });

  @override
  State<LottieHeartWidget> createState() => _LottieHeartWidgetState();
}

class _LottieHeartWidgetState extends State<LottieHeartWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
  }

  @override
  void didUpdateWidget(LottieHeartWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isLiked != oldWidget.isLiked) {
      if (widget.isLiked) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: SizedBox(
        width: widget.size,
        height: widget.size,
        child: Lottie.asset(
          LottieService.getAnimationPath('heart'),
          controller: _controller,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            return Icon(
              widget.isLiked ? Icons.favorite : Icons.favorite_border,
              size: widget.size * 0.7,
              color: widget.isLiked ? const Color(0xFFE50914) : Colors.white,
            );
          },
        ),
      ),
    );
  }
}

// ✅ SUCCESS ANIMATION WIDGET
class LottieSuccessWidget extends StatelessWidget {
  final double size;
  final String? message;
  final VoidCallback? onComplete;

  const LottieSuccessWidget({
    super.key,
    this.size = 100,
    this.message,
    this.onComplete,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: Lottie.asset(
            LottieService.getAnimationPath('success'),
            fit: BoxFit.contain,
            repeat: false,
            onLoaded: (composition) {
              Future.delayed(composition.duration, () {
                onComplete?.call();
              });
            },
            errorBuilder: (context, error, stackTrace) {
              return Container(
                width: size,
                height: size,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFF4CAF50),
                ),
                child: const Icon(
                  Icons.check,
                  color: Colors.white,
                  size: 40,
                ),
              );
            },
          ),
        ),
        if (message != null) ...[
          const SizedBox(height: 16),
          Text(
            message!,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );
  }
}

// ✅ ERROR ANIMATION WIDGET
class LottieErrorWidget extends StatelessWidget {
  final double size;
  final String? message;
  final VoidCallback? onRetry;

  const LottieErrorWidget({
    super.key,
    this.size = 100,
    this.message,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: Lottie.asset(
            LottieService.getAnimationPath('error'),
            fit: BoxFit.contain,
            repeat: false,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                width: size,
                height: size,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFFE50914),
                ),
                child: const Icon(
                  Icons.error_outline,
                  color: Colors.white,
                  size: 40,
                ),
              );
            },
          ),
        ),
        if (message != null) ...[
          const SizedBox(height: 16),
          Text(
            message!,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
        if (onRetry != null) ...[
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: onRetry,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE50914),
              foregroundColor: Colors.white,
            ),
            child: const Text('Tekrar Dene'),
          ),
        ],
      ],
    );
  }
}

// ✅ EMPTY STATE WIDGET
class LottieEmptyWidget extends StatelessWidget {
  final double size;
  final String? message;
  final String? actionText;
  final VoidCallback? onAction;

  const LottieEmptyWidget({
    super.key,
    this.size = 120,
    this.message,
    this.actionText,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: Lottie.asset(
            LottieService.getAnimationPath('empty'),
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return Icon(
                Icons.inbox_outlined,
                size: size * 0.6,
                color: Colors.white.withOpacity(0.3),
              );
            },
          ),
        ),
        if (message != null) ...[
          const SizedBox(height: 16),
          Text(
            message!,
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
        ],
        if (actionText != null && onAction != null) ...[
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: onAction,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE50914),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Text(
              actionText!,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ],
    );
  }
}

// ✅ PREMIUM ANIMATION WIDGET
class LottiePremiumWidget extends StatelessWidget {
  final double size;
  final bool autoPlay;

  const LottiePremiumWidget({
    super.key,
    this.size = 60,
    this.autoPlay = true,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Lottie.asset(
        LottieService.getAnimationPath('premium'),
        fit: BoxFit.contain,
        repeat: autoPlay,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFFFD700),
                  const Color(0xFFFF8C00),
                ],
              ),
            ),
            child: const Icon(
              Icons.diamond,
              color: Colors.white,
              size: 24,
            ),
          );
        },
      ),
    );
  }
}

// ✅ PHOTO UPLOAD ANIMATION WIDGET
class LottiePhotoUploadWidget extends StatelessWidget {
  final double size;
  final bool isUploading;

  const LottiePhotoUploadWidget({
    super.key,
    this.size = 80,
    required this.isUploading,
  });

  @override
  Widget build(BuildContext context) {
    if (!isUploading) return const SizedBox.shrink();

    return SizedBox(
      width: size,
      height: size,
      child: Lottie.asset(
        LottieService.getAnimationPath('photo_upload'),
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) {
          return const CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
            strokeWidth: 3,
          );
        },
      ),
    );
  }
}

// ✅ CONFETTI CELEBRATION WIDGET
class LottieConfettiWidget extends StatefulWidget {
  final double? width;
  final double? height;
  final bool trigger;
  final VoidCallback? onComplete;

  const LottieConfettiWidget({
    super.key,
    this.width,
    this.height,
    required this.trigger,
    this.onComplete,
  });

  @override
  State<LottieConfettiWidget> createState() => _LottieConfettiWidgetState();
}

class _LottieConfettiWidgetState extends State<LottieConfettiWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
  }

  @override
  void didUpdateWidget(LottieConfettiWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.trigger && !oldWidget.trigger) {
      _controller.reset();
      _controller.forward().then((_) {
        widget.onComplete?.call();
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.width ?? MediaQuery.of(context).size.width,
      height: widget.height ?? MediaQuery.of(context).size.height,
      child: Lottie.asset(
        LottieService.getAnimationPath('confetti'),
        controller: _controller,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return const SizedBox.shrink();
        },
      ),
    );
  }
}

// ✅ SPLASH SCREEN LOTTIE WIDGET
class LottieSplashWidget extends StatelessWidget {
  final double size;
  final VoidCallback? onComplete;

  const LottieSplashWidget({
    super.key,
    this.size = 200,
    this.onComplete,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Lottie.asset(
        LottieService.getAnimationPath('splash'),
        fit: BoxFit.contain,
        repeat: false,
        onLoaded: (composition) {
          Future.delayed(composition.duration, () {
            onComplete?.call();
          });
        },
        errorBuilder: (context, error, stackTrace) {
          // Fallback to custom animation
          return TweenAnimationBuilder<double>(
            duration: const Duration(seconds: 2),
            tween: Tween(begin: 0.0, end: 1.0),
            builder: (context, value, child) {
              return Transform.scale(
                scale: 0.5 + (0.5 * value),
                child: Opacity(
                  opacity: value,
                  child: Container(
                    width: size,
                    height: size,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          const Color(0xFFE50914),
                          const Color(0xFF8B0000),
                        ],
                      ),
                    ),
                    child: const Icon(
                      Icons.favorite,
                      size: 80,
                      color: Colors.white,
                    ),
                  ),
                ),
              );
            },
            onEnd: () => onComplete?.call(),
          );
        },
      ),
    );
  }
}

// ✅ MOVIE LOADING SHIMMER WITH LOTTIE
class LottieMovieLoadingWidget extends StatelessWidget {
  const LottieMovieLoadingWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 200,
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Lottie.asset(
          LottieService.getAnimationPath('movie_loading'),
          width: 100,
          height: 100,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            return const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE50914)),
            );
          },
        ),
      ),
    );
  }
}

// ✅ LOTTIE TRANSITION WIDGET
class LottieTransitionWidget extends StatefulWidget {
  final Widget child;
  final String animationType;
  final Duration duration;

  const LottieTransitionWidget({
    super.key,
    required this.child,
    this.animationType = 'fade',
    this.duration = const Duration(milliseconds: 300),
  });

  @override
  State<LottieTransitionWidget> createState() => _LottieTransitionWidgetState();
}

class _LottieTransitionWidgetState extends State<LottieTransitionWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );

    _animation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        switch (widget.animationType) {
          case 'scale':
            return Transform.scale(
              scale: _animation.value,
              child: widget.child,
            );
          case 'slide':
            return Transform.translate(
              offset: Offset(0, 20 * (1 - _animation.value)),
              child: Opacity(
                opacity: _animation.value,
                child: widget.child,
              ),
            );
          case 'fade':
          default:
            return Opacity(
              opacity: _animation.value,
              child: widget.child,
            );
        }
      },
    );
  }
}