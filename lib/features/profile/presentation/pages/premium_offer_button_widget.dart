// lib/features/profile/presentation/pages/premium_offer_button_widget.dart - MODAL ENTEGRE
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../shared/widgets/modals/premium_offer_modal.dart';

class PremiumOfferButtonWidget extends StatelessWidget {
  const PremiumOfferButtonWidget({super.key});

  // ✅ PREMIUM MODAL FONKSIYONU
  void _showPremiumOfferModal(BuildContext context) {
    print('💎 PremiumOfferButtonWidget: Opening Premium Offer Modal...');
    
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
        // ✅ Smooth fade transition
        return FadeTransition(
          opacity: anim1,
          child: child,
        );
      },
    ).then((result) {
      print('💎 PremiumOfferButtonWidget: Premium modal closed');
      
      // ✅ Modal kapandıktan sonra işlemler (opsiyonel)
      if (result != null) {
        print('💎 Modal returned result: $result');
      }
    }).catchError((error) {
      print('❌ Error showing premium modal: $error');
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _showPremiumOfferModal(context), // ✅ MODAL ÇAĞRISI
      child: Container(
        width: 111.78938293457031, // ✅ Design spec exact width
        height: 33.35926055908203, // ✅ Design spec exact height
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(53), // ✅ Design spec border-radius
          color: const Color(0xFFE50914), // ✅ Design spec: var(--Genel-Brand-Color, #E50914)
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
                  width: 18, // ✅ Design spec width
                  height: 18, // ✅ Design spec height
                  decoration: const BoxDecoration(shape: BoxShape.circle),
                  child: const Icon(
                    Icons.diamond,
                    size: 12,
                    color: Colors.white,
                  ),
                ),
                
                const SizedBox(width: 4), // ✅ Spacing between icon and text
                
                // ✅ Text with exact design spec
                const Text(
                  'Sınırlı Teklif',
                  style: TextStyle(
                    fontFamily: 'Montserrat', // ✅ Design spec font-family
                    fontSize: 12, // ✅ Design spec font-size
                    fontWeight: FontWeight.w600, // ✅ Design spec font-weight: 600 (SemiBold)
                    color: Color(0xFFFFFFFF), // ✅ Design spec background: #FFFFFF (text color)
                    height: 1.0, // ✅ Design spec line-height: 100%
                    letterSpacing: 0, // ✅ Design spec letter-spacing: 0%
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}