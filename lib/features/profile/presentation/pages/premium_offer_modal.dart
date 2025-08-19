// lib/shared/widgets/modals/premium_offer_modal.dart - EXACT COPY (Tasarım değiştirilmedi)
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';


class PremiumOfferModal extends StatefulWidget {
  const PremiumOfferModal({super.key});

  @override
  State<PremiumOfferModal> createState() => _PremiumOfferModalState();
}

class _PremiumOfferModalState extends State<PremiumOfferModal>
    with SingleTickerProviderStateMixin {
  int _selectedPackage = 1; // Middle package selected by default
  late AnimationController _animationController;
  late Animation<double> _slideAnimation;
  late Animation<double> _fadeAnimation;

  final List<Map<String, dynamic>> _packages = [
    {
      'tokens': '330',
      'originalTokens': '200',
      'price': '₺99,99',
      'period': 'Başına haftalık',
      'discount': '+10%',
      'discountColor': const Color(0xFF6F060B),
      'gradient': const [Color(0xFF6F060B), Color(0xFFE50914)],
    },
    {
      'tokens': '3.375',
      'originalTokens': '2.000',
      'price': '₺799,99',
      'period': 'Başına haftalık',
      'discount': '+70%',
      'discountColor': const Color(0xFF5949E6),
      'gradient': const [Color(0xFF5949E6), Color(0xFFE50914)],
      'isPopular': true,
    },
    {
      'tokens': '1.350',
      'originalTokens': '1.000',
      'price': '₺399,99',
      'period': 'Başına haftalık',
      'discount': '+35%',
      'discountColor': const Color(0xFF6F060B),
      'gradient': const [Color(0xFF6F060B), Color(0xFFE50914)],
    },
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _slideAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutCubic),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.3, 1.0, curve: Curves.easeOut),
      ),
    );

    // Start animation
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return Material(
          color: Colors.transparent,
          child: Stack(
            children: [
              // ✅ DESIGN SPEC: Backdrop blur container with exact measurements
              Positioned.fill(
                child: GestureDetector(
                  onTap: () async {
                    print('Backdrop tapped'); // Debug log
                    await _animationController.reverse();
                    if (mounted) {
                      Navigator.of(context).pop();
                    }
                  },
                  child: Container(
                    width: 402, // ✅ Design spec width
                    height: 844, // ✅ Design spec height
                    padding: const EdgeInsets.only(
                      top: 23, // ✅ Design spec padding-top
                      right: 16, // ✅ Design spec padding-right
                      bottom: 23, // ✅ Design spec padding-bottom
                      left: 16, // ✅ Design spec padding-left
                    ),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15), // ✅ Design spec: blur(15px)
                      child: Container(
                        decoration: BoxDecoration(
                          color: Color.lerp(
                            Colors.transparent,
                            const Color(0x33000000), // ✅ Design spec: saydam-20-siyah (#00000033)
                            _fadeAnimation.value,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              // ✅ Modal content with slide-up animation
              Positioned(
                bottom: MediaQuery.of(context).size.height * _slideAnimation.value - 23,
                left: 16,
                right: 16,
                child: Opacity(
                  opacity: _fadeAnimation.value,
                  child: _buildModalContent(),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildModalContent() {
    return Container(
      width: 402, // ✅ Design spec width
      height: 654, // ✅ Design spec height
      decoration: BoxDecoration(
        color: const Color(0xFF090909), // ✅ Design spec: Backround-Siyah
        borderRadius: BorderRadius.circular(32), // ✅ Design spec: Spacing/8
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, -10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: Stack(
          children: [
            // ✅ DESIGN SPEC: Background blur effect - Ellipse 852 EXACT MEASUREMENTS
            Positioned(
              top: -83.74, // ✅ Design spec exact top position
              left: 92.3,  // ✅ Design spec exact left position
              child: Container(
                width: 217.3944091796875, // ✅ Design spec exact width
                height: 217.3944091796875, // ✅ Design spec exact height
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFE50914), // ✅ Design spec: var(--Genel-Brand-Color, #E50914)
                ),
                child: BackdropFilter(
                  filter: ImageFilter.blur(
                    sigmaX: 216.24923706054688, // ✅ Design spec exact blur value
                    sigmaY: 216.24923706054688, // ✅ Design spec exact blur value
                  ),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.transparent,
                    ),
                  ),
                ),
              ),
            ),

            // ✅ DESIGN SPEC: Background blur effect - Ellipse 853 (bottom) EXACT MEASUREMENTS
            Positioned(
              top: 503.13, // ✅ Design spec exact top position
              left: 92.8,  // ✅ Design spec exact left position
              child: Container(
                width: 217.3944091796875, // ✅ Design spec exact width
                height: 217.3944091796875, // ✅ Design spec exact height
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFE50914), // ✅ Design spec: var(--Genel-Brand-Color, #E50914)
                ),
                child: BackdropFilter(
                  filter: ImageFilter.blur(
                    sigmaX: 250, // ✅ Design spec exact blur value: blur(250px)
                    sigmaY: 250, // ✅ Design spec exact blur value: blur(250px)
                  ),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.transparent,
                    ),
                  ),
                ),
              ),
            ),

            // ✅ Main content positioned according to design spec
            Positioned(
              top: 19, // ✅ Design spec positioning
              left: 0,
              right: 0,
              bottom: 0,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 0),
                child: Column(
                  children: [
                    // ✅ Header - Sınırlı Teklif
                    _buildHeader(),

                    const SizedBox(height: 24.37),

                    // ✅ Bonus section - Alacağınız Bonuslar
                    _buildBonusSection(),

                    const SizedBox(height: 22.97),

                    // ✅ Package selection title
                    _buildPackageTitle(),

                    const SizedBox(height: 20),

                    // ✅ Package options
                    _buildPackageOptions(),

                    const SizedBox(height: 17.78),

                    // ✅ Purchase button
                    _buildPurchaseButton(),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        // ✅ Title
        const Text(
          'Sınırlı Teklif',
          style: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Color(0xFFFFFFFF),
            height: 1.0,
            letterSpacing: 0,
          ),
        ),

        const SizedBox(height: 4.37),

        // ✅ Subtitle
        SizedBox(
          width: 220.49,
          height: 36,
          child: const Text(
            'Jeton paketi\'ni seçerek bonus kazanın ve yeni bölümlerin kilidini açın!',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Color(0xFFFFFFFF),
              height: 1.5,
              letterSpacing: 0,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBonusSection() {
  return Container(
    width: 366.08,
    height: 173.71,
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: const Color(0x1AFFFFFF), width: 1),
      gradient: const RadialGradient(
        center: Alignment(0.0912, -0.6543),
        radius: 1.6543,
        colors: [Color(0x1AFFFFFF), Color(0x08FFFFFF)],
      ),
    ),
    child: Column(
      children: [
        const SizedBox(height: 22.26),

        // ✅ FIGMA TITLE: Alacağınız Bonuslar
        Container(
          width: 142,  // ✅ Figma: width: 142
          height: 19,  // ✅ Figma: height: 19
          child: const Text(
            'Alacağınız Bonuslar',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Euclid Circular A', // ✅ Figma: font-family
              fontSize: 15,                    // ✅ Figma: font-size: 15px
              fontWeight: FontWeight.w500,     // ✅ Figma: font-weight: 500 (Medium)
              color: Color(0xFFFFFFFF),        // ✅ Figma: background: #FFFFFF
              height: 1.0,                     // ✅ Figma: line-height: 100%
              letterSpacing: 0,                // ✅ Figma: letter-spacing: 0%
            ),
          ),
        ),

        const SizedBox(height: 14),

        // ✅ Bonus icons row
        _buildBonusIcons(),
      ],
    ),
  );
}

  Widget _buildBonusIcons() {
  return Container(
    width: 325.5624694824219,  // ✅ Figma: Group 166294 width
    height: 104.19282531738281, // ✅ Figma: Group 166294 height
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildAnimatedBonusItem(
          'assets/images/premium_hesap.png',
          'Premium\nHesap',
          0,
        ),
        _buildAnimatedBonusItem(
          'assets/images/daha_fazla_eslesme.png',
          'Daha Fazla\nEşleşme',
          100,
        ),
        _buildAnimatedBonusItem(
          'assets/images/one_cikarma.png',
          'Öne\nÇıkarma',
          200,
        ),
        _buildAnimatedBonusItem(
          'assets/images/daha_fazla_begeni.png',
          'Daha Fazla\nBeğeni',
          300,
        ),
      ],
    ),
  );
}

  Widget _buildAnimatedBonusItem(
    String assetPath,
    String title,
    int delay,
  ) {
    return TweenAnimationBuilder<double>(
      duration: Duration(milliseconds: 800 + delay),
      tween: Tween(begin: 0.0, end: 1.0),
      builder: (context, value, child) {
        return Transform.scale(
          scale: 0.5 + (0.5 * value),
          child: Opacity(
            opacity: value,
            child: _buildBonusItem(assetPath, title),
          ),
        );
      },
    );
  }

  Widget _buildBonusItem(String assetPath, String title) {
  return Column(
    children: [
      // ✅ FIGMA: Ellipse 818 boyutları
      Container(
        width: 55,  // ✅ Figma: width: 55
        height: 55, // ✅ Figma: height: 55
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: const Color(0xFF6F060B), // ✅ Figma: background: #6F060B
          // ✅ FIGMA INSET SHADOW: box-shadow: 0px 0px 8.33px 0px #FFFFFF inset;
          boxShadow: [
            // Flutter doesn't support inset shadows directly, so we simulate with gradient
          ],
        ),
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            // ✅ Simulate inset shadow with gradient overlay
            gradient: RadialGradient(
              center: Alignment.center,
              radius: 0.8,
              colors: [
                Colors.white.withOpacity(0.15), // Inset glow effect
                const Color(0xFF6F060B).withOpacity(0.9),
                const Color(0xFF6F060B),
              ],
              stops: const [0.0, 0.3, 1.0],
            ),
          ),
          child: Center(
            child: Image.asset(
              assetPath,
              // ✅ FIGMA: Rectangle 39346 boyutları (örnek)
              width: 33.314208984375,  // ✅ Figma exact width
              height: 33.314208984375, // ✅ Figma exact height
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) {
                // ✅ FALLBACK: Asset yoksa icon göster
                IconData fallbackIcon;
                if (assetPath.contains('premium_hesap')) {
                  fallbackIcon = Icons.diamond;
                } else if (assetPath.contains('daha_fazla_eslesme')) {
                  fallbackIcon = Icons.favorite;
                } else if (assetPath.contains('one_cikarma')) {
                  fallbackIcon = Icons.star;
                } else {
                  fallbackIcon = Icons.thumb_up;
                }
                
                return Icon(
                  fallbackIcon,
                  size: 24,
                  color: Colors.white,
                );
              },
            ),
          ),
        ),
      ),

      const SizedBox(height: 12), // ✅ Spacing between icon and text

      // ✅ FIGMA TEXT: Premium Hesap
      Container(
        width: 59.3910529868852,  // ✅ Figma: width (örnek Premium Hesap için)
        height: 36.00000044903216, // ✅ Figma: height
        child: Text(
          title,
          textAlign: TextAlign.center, // ✅ Figma: text-align: center
          style: const TextStyle(
            fontFamily: 'Euclid Circular A', // ✅ Figma: font-family
            fontSize: 12,                    // ✅ Figma: font-size: 12px
            fontWeight: FontWeight.w400,     // ✅ Figma: font-weight: 400 (Regular)
            color: Color(0xFFFFFFFF),        // ✅ Figma: background: #FFFFFF
            height: 1.5,                     // ✅ Figma: line-height: 18px (18/12 = 1.5)
            letterSpacing: 0,                // ✅ Figma: letter-spacing: 0%
          ),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
      ),
    ],
  );
}


  Widget _buildPackageTitle() {
    return const Text(
      'Kilidi açmak için bir jeton paketi seçin',
      style: TextStyle(
        fontFamily: 'Euclid Circular A',
        fontSize: 15,
        fontWeight: FontWeight.w500,
        color: Color(0xFFFFFFFF),
        height: 1.0,
        letterSpacing: 0,
      ),
    );
  }

  Widget _buildPackageOptions() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: SizedBox(
        width: 367.14,
        height: 243.78, // ✅ Height increased to accommodate badges
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            for (int i = 0; i < _packages.length; i++)
              Flexible(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: i == 1 ? 6.0 : 3.0),
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedPackage = i;
                      });
                    },
                    child: _buildPackageCard(_packages[i], i == _selectedPackage, i),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPackageCard(Map<String, dynamic> package, bool isSelected, int index) {
    return Stack(
      clipBehavior: Clip.none, // ✅ Allows badge to overflow outside card bounds
      children: [
        // ✅ DESIGN SPEC: Main card container
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: index == 1 ? 111.713623046875 : 105,
          height: index == 1 ? 217.826416015625 : 217.83,
          margin: const EdgeInsets.only(top: 15), // ✅ Space for badge above card
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected 
                ? Colors.white.withOpacity(0.8)
                : const Color(0x66FFFFFF),
              width: 1,
            ),
            gradient: index == 1 
                ? const RadialGradient(
                    center: Alignment(-0.7356, -0.8478),
                    radius: 1.4456,
                    colors: [
                      Color(0xFF5949E6),
                      Color(0xFFE50914),
                    ],
                    stops: [0.0, 1.0],
                  )
                : RadialGradient(
                    center: const Alignment(-0.7444, -0.8478),
                    radius: 1.4456,
                    colors: package['gradient'] as List<Color>,
                  ),
            boxShadow: [
              // ✅ FIXED: Removed inset parameter (not supported in Flutter)
              BoxShadow(
                color: Colors.white.withOpacity(0.3),
                blurRadius: 15,
                spreadRadius: -8,
                offset: const Offset(4, 4),
              ),
              BoxShadow(
                color: Colors.white.withOpacity(0.1),
                blurRadius: 10,
                spreadRadius: -5,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Stack(
            children: [
              // ✅ Package content
              Positioned(
                bottom: 20,
                left: 4,
                right: 4,
                child: Column(
                  children: [
                    // Original tokens (crossed out)
                    Text(
                      package['originalTokens'],
                      style: const TextStyle(
                        fontFamily: 'Euclid Circular A',
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFFFFFFFF),
                        height: 1.0,
                        letterSpacing: 0,
                        decoration: TextDecoration.lineThrough,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 4.04),

                    // New tokens amount
                    Text(
                      package['tokens'],
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 25,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFFFFFFF),
                        height: 1.0,
                        letterSpacing: 0,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 3.37),

                    // "Jeton" text
                    const Text(
                      'Jeton',
                      style: TextStyle(
                        fontFamily: 'Euclid Circular A',
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFFFFFFFF),
                        height: 1.0,
                        letterSpacing: 0,
                      ),
                    ),

                    const SizedBox(height: 25),

                    // Divider line
                    Container(
                      width: 80,
                      height: 1,
                      color: const Color(0x1AFFFFFF),
                    ),

                    const SizedBox(height: 14),

                    // Price
                    Text(
                      package['price'],
                      style: const TextStyle(
                        fontFamily: 'Montserrat',
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFFFFFFF),
                        height: 1.0,
                        letterSpacing: 0,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 1.17),

                    // Period
                    Text(
                      package['period'],
                      style: const TextStyle(
                        fontFamily: 'Euclid Circular A',
                        fontSize: 11,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFFFFFFFF),
                        height: 1.5,
                        letterSpacing: 0,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // ✅ FIXED: Discount badge positioned ABOVE the card - No inset shadow
        Positioned(
          top: 0, // ✅ Positioned above the card
          left: 0,
          right: 0,
          child: Center(
            child: Container(
              width: 61,
              height: 25,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: package['discountColor'] as Color,
                // ✅ FIXED: Simulate inner glow with gradient instead of inset shadow
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 0.8,
                  colors: [
                    (package['discountColor'] as Color).withOpacity(0.9),
                    package['discountColor'] as Color,
                    (package['discountColor'] as Color).withOpacity(0.8),
                  ],
                  stops: const [0.0, 0.5, 1.0],
                ),
                boxShadow: [
                  // ✅ Outer glow effect
                  BoxShadow(
                    color: Colors.white.withOpacity(0.3),
                    blurRadius: 8,
                    spreadRadius: 0,
                    offset: const Offset(0, 0),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  package['discount'],
                  style: const TextStyle(
                    fontFamily: 'Euclid Circular A',
                    fontSize: 12,
                    fontWeight: FontWeight.w600, // ✅ Made text bolder for better visibility
                    color: Color(0xFFFFFFFF),
                    height: 1.2,
                    letterSpacing: 0,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPurchaseButton() {
    return Container(
      width: 367.14,
      height: 53.31,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: const Color(0xFFE50914),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFE50914).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            await _animationController.reverse();
            if (mounted) {
              context.pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    '${_packages[_selectedPackage]['tokens']} jeton paketi satın alındı!',
                  ),
                  backgroundColor: const Color(0xFF4CAF50),
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              );
            }
          },
          borderRadius: BorderRadius.circular(18),
          child: const Center(
            child: Text(
              'Tüm Jetonları Gör',
              style: TextStyle(
                fontFamily: 'Euclid Circular A',
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: Color(0xFFFFFFFF),
                height: 1.0,
                letterSpacing: 0,
              ),
            ),
          ),
        ),
      ),
    );
  }
}