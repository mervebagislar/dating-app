// lib/features/auth/presentation/pages/login_page.dart - UPDATED DESIGN
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/navigation/app_routes.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';
import '../widgets/auth_header_widget.dart';
import '../widgets/auth_text_field.dart';
import '../widgets/social_login_widget.dart';
import '../pages/register_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  
  bool _isPasswordVisible = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: SafeArea(
        child: BlocListener<AuthBloc, AuthState>(
          listener: (context, state) {
            if (state is AuthLoginSuccess || 
                state is AuthAuthenticated || 
                state is AuthUserProfileLoaded) {
              print('✅ Login successful, GoRouter will handle redirect');
            } else if (state is AuthLoginError) {
              _showErrorSnackBar(context, state.message);
            } else if (state is AuthError) {
              _showErrorSnackBar(context, state.message);
            }
          },
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 39),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    // ✅ HEADER - Position: top: 300.5px
                    const SizedBox(height: 220), // Adjust for top positioning
                    
                    _buildHeader(),

                    // ✅ EMAIL FIELD - Position: top: 410.5px  
                    const SizedBox(height: 40),
                    
                    _buildEmailField(),

                    // ✅ PASSWORD FIELD - Position: top: 478.5px
                    const SizedBox(height: 14), // 478.5 - 410.5 - 54 = 14px gap
                    
                    _buildPasswordField(),

                    // ✅ FORGOT PASSWORD - Position: top: 562.5px
                    const SizedBox(height: 30), // 562.5 - 478.5 - 54 = 30px gap
                    
                    _buildForgotPassword(),

                    // ✅ LOGIN BUTTON - Position: top: 604.5px
                    const SizedBox(height: 24), // 604.5 - 562.5 - 18 = 24px gap
                    
                    _buildLoginButton(),

                    // ✅ SOCIAL LOGIN BUTTONS
                    const SizedBox(height: 40),
                    
                    const SocialLoginWidget(),

                    // ✅ REGISTER LINK
                    const SizedBox(height: 24),
                    
                    _buildRegisterLink(),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ✅ HEADER - Exact design specs
  Widget _buildHeader() {
    return Column(
      children: [
        // Merhabalar - width: 101, height: 23
        const Text(
          'Merhabalar',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
            height: 1.0,
            letterSpacing: 0,
          ),
        ),
        const SizedBox(height: 8),
        // Subtitle - width: 236, height: 39
        const SizedBox(
          width: 236,
          child: Text(
            'Tempus varius a vitae interdum id tortor elementum tristique eleifend at.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: Colors.white,
              height: 1.0,
              letterSpacing: 0,
            ),
          ),
        ),
      ],
    );
  }

  // ✅ EMAIL FIELD - width: 324, height: 54.37
  Widget _buildEmailField() {
    return SizedBox(
      width: 324,
      height: 54.37,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: const Color(0x1AFFFFFF), // saydam-10-beyaz
          border: Border.all(
            color: const Color(0x33FFFFFF), // saydam-20-beyaz
            width: 1,
          ),
        ),
        child: TextFormField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          style: const TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            color: Colors.white,
          ),
          decoration: InputDecoration(
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
            // Email icon - width: 17.67, height: 15.73, positioned at left: 63px
            prefixIcon: Container(
              padding: const EdgeInsets.only(left: 24, right: 12),
              child: Icon(
                Icons.email_outlined,
                size: 16,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
            hintText: 'E-Posta',
            hintStyle: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Colors.white.withOpacity(0.5),
            ),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'E-posta gereklidir';
            }
            if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
              return 'Geçerli bir e-posta giriniz';
            }
            return null;
          },
        ),
      ),
    );
  }

  // ✅ PASSWORD FIELD - width: 324, height: 54.37
  Widget _buildPasswordField() {
    return SizedBox(
      width: 324,
      height: 54.37,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: const Color(0x1AFFFFFF), // saydam-10-beyaz
          border: Border.all(
            color: const Color(0x33FFFFFF), // saydam-20-beyaz
            width: 1,
          ),
        ),
        child: TextFormField(
          controller: _passwordController,
          obscureText: !_isPasswordVisible,
          style: const TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            color: Colors.white,
          ),
          decoration: InputDecoration(
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
            // Lock icon - width: 13.99, height: 17, positioned at left: 65px
            prefixIcon: Container(
              padding: const EdgeInsets.only(left: 26, right: 12),
              child: Icon(
                Icons.lock_outline,
                size: 16,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
            // Hide/Show icon - positioned at right
            suffixIcon: GestureDetector(
              onTap: () {
                setState(() {
                  _isPasswordVisible = !_isPasswordVisible;
                });
              },
              child: Container(
                padding: const EdgeInsets.only(right: 20),
                child: Icon(
                  _isPasswordVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                  size: 18,
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
            ),
            hintText: 'Şifre',
            hintStyle: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Colors.white.withOpacity(0.5),
            ),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Şifre gereklidir';
            }
            return null;
          },
        ),
      ),
    );
  }

  // ✅ FORGOT PASSWORD - width: 90, height: 18
  Widget _buildForgotPassword() {
    return SizedBox(
      width: 324,
      child: Align(
        alignment: Alignment.centerLeft,
        child: GestureDetector(
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Şifre sıfırlama yakında aktif olacak'),
              ),
            );
          },
          child: const Text(
            'Şifremi unuttum',
            style: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Colors.white,
              decoration: TextDecoration.underline,
              decorationColor: Colors.white,
              height: 1.5,
            ),
          ),
        ),
      ),
    );
  }

  // ✅ LOGIN BUTTON - width: 324, height: 53.31
  Widget _buildLoginButton() {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        final isLoading = state is AuthLoginLoading || state is AuthLoading;
        
        return SizedBox(
          width: 324,
          height: 53.31,
          child: ElevatedButton(
            onPressed: isLoading ? null : _handleLogin,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE50914), // Genel-Brand-Color
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
              ),
              elevation: 0,
            ),
            child: isLoading
                ? const CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    strokeWidth: 2,
                  )
                : const Text(
                    'Giriş Yap',
                    style: TextStyle(
                      fontFamily: 'Euclid Circular A',
                      fontSize: 15,
                      fontWeight: FontWeight.w500, // Medium
                      height: 1.0,
                      letterSpacing: 0,
                    ),
                  ),
          ),
        );
      },
    );
  }

  // ✅ REGISTER LINK
  Widget _buildRegisterLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Hesabın yok mu? ',
          style: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            color: Colors.white.withOpacity(0.5),
          ),
        ),
        GestureDetector(
          onTap: () {
            print('🔄 Navigating to register page');
            
            try {
              context.go(AppRoutes.register);
            } catch (e) {
              print('⚠️ GoRouter failed, using Navigator fallback: $e');
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => BlocProvider.value(
                    value: context.read<AuthBloc>(),
                    child: const RegisterPage(),
                  ),
                ),
              );
            }
          },
          child: const Text(
            'Kaydol',
            style: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 12,
              color: Colors.white,
              decoration: TextDecoration.underline,
              decorationColor: Colors.white,
            ),
          ),
        ),
      ],
    );
  }

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text.trim();
      final password = _passwordController.text;

      print('🔐 Attempting login for: $email');

      context.read<AuthBloc>().add(
        LoginRequested(
          email: email,
          password: password,
        ),
      );
    }
  }

  void _showErrorSnackBar(BuildContext context, String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: AppColors.error,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      );
    }
  }
}