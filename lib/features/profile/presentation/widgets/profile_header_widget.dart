// lib/features/profile/presentation/widgets/profile_header_widget.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/navigation/app_routes.dart';
import '../../../../shared/widgets/modals/premium_offer_modal.dart';

class ProfileHeaderWidget extends StatelessWidget {
  const ProfileHeaderWidget({super.key});

  // ✅ PREMIUM MODAL FONKSIYONU - Direkt widget içinde
  void _showPremiumOfferModal(BuildContext context) {
    print('💎 ProfileHeaderWidget: Opening Premium Offer Modal...');
    
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
      barrierColor: Colors.transparent, // ✅ Modal kendi backdrop'unu handle ediyor
      transitionDuration: const Duration(milliseconds: 600),
      pageBuilder: (context, anim1, anim2) {
        return const PremiumOfferModal();
      },
      transitionBuilder: (context, anim1, anim2, child) {
        return FadeTransition(
          opacity: anim1,
          child: child,
        );
      },
    ).then((result) {
      print('💎 ProfileHeaderWidget: Premium modal closed');
    }).catchError((error) {
      print('❌ Error showing premium modal: $error');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        children: [
          // ✅ FIGMA SPEC: Back Button
          GestureDetector(
            onTap: () => context.go(AppRoutes.home),
            child: Container(
              width: 44.34,  // ✅ Figma exact width
              height: 44.34, // ✅ Figma exact height
              decoration: BoxDecoration(
                color: const Color(0x1AFFFFFF), // ✅ Figma color
                shape: BoxShape.circle,
                border: Border.all(
                  color: const Color(0x33FFFFFF), // ✅ Figma border color
                  width: 1,
                ),
              ),
              child: const Icon(
                Icons.arrow_back,
                color: Colors.white,
                size: 24,
              ),
            ),
          ),

          // ✅ FIGMA SPEC: Title with exact measurements
          const Expanded(
            child: Center(
              child: SizedBox(
                width: 88,  // ✅ Figma width
                height: 19, // ✅ Figma height
                child: Text(
                  'Profil Detayı',
                  textAlign: TextAlign.center, // ✅ Figma text-align: center
                  style: TextStyle(
                    fontFamily: 'Euclid Circular A', // ✅ Figma font-family
                    fontSize: 15,                    // ✅ Figma font-size: 15px
                    fontWeight: FontWeight.w500,     // ✅ Figma font-weight: 500 (Medium)
                    color: Color(0xFFFFFFFF),        // ✅ Figma color
                    height: 1.0,                     // ✅ Figma line-height: 100%
                    letterSpacing: 0,                // ✅ Figma letter-spacing: 0%
                  ),
                ),
              ),
            ),
          ),

          // ✅ FIGMA SPEC: Premium Offer Button - DIREKT İMPLEMENTASYON
          GestureDetector(
            onTap: () => _showPremiumOfferModal(context), // ✅ MODAL ÇAĞRISI
            child: Container(
              width: 111.78938293457031,  // ✅ Figma exact width
              height: 33.35926055908203, // ✅ Figma exact height
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(53), // ✅ Figma border-radius: 53px
                color: const Color(0xFFE50914), // ✅ Figma: var(--Genel-Brand-Color, #E50914)
                // ✅ Subtle shadow for better visual feedback
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFE50914).withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => _showPremiumOfferModal(context),
                  borderRadius: BorderRadius.circular(53),
                  splashColor: Colors.white.withOpacity(0.2), // ✅ Touch feedback
                  highlightColor: Colors.white.withOpacity(0.1),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // ✅ Diamond icon with exact positioning
                      Container(
                        width: 18,  // ✅ Figma width
                        height: 18, // ✅ Figma height
                        decoration: const BoxDecoration(shape: BoxShape.circle),
                        child: const Icon(
                          Icons.diamond,
                          size: 12,
                          color: Colors.white,
                        ),
                      ),
                      
                      const SizedBox(width: 4), // ✅ Spacing between icon and text
                      
                      // ✅ Text with exact Figma spec
                      const Text(
                        'Sınırlı Teklif',
                        style: TextStyle(
                          fontFamily: 'Montserrat',        // ✅ Figma font-family
                          fontSize: 12,                    // ✅ Figma font-size
                          fontWeight: FontWeight.w600,     // ✅ Figma font-weight: 600 (SemiBold)
                          color: Color(0xFFFFFFFF),        // ✅ Figma text color
                          height: 1.0,                     // ✅ Figma line-height: 100%
                          letterSpacing: 0,                // ✅ Figma letter-spacing: 0%
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}