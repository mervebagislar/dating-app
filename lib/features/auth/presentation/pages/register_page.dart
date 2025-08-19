// lib/features/auth/presentation/pages/register_page.dart - ENHANCED PROFILE NAVIGATION
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
import '../pages/login_page.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: SafeArea(
        child: BlocListener<AuthBloc, AuthState>(
          listener: (context, state) {
            if (state is AuthRegisterSuccess) {
              print('✅ Registration successful - Router will redirect to profile');
              
              // ✅ OPTIONAL: Explicit profile navigation (Router handles it automatically)
              // Future.delayed(const Duration(milliseconds: 500), () {
              //   if (mounted) {
              //     context.go(AppRoutes.profile);
              //   }
              // });
              
            } else if (state is AuthAuthenticated || state is AuthUserProfileLoaded) {
              print('✅ User authenticated - Router will handle redirect');
            } else if (state is AuthRegisterError) {
              _showErrorSnackBar(context, state.message);
            } else if (state is AuthError) {
              _showErrorSnackBar(context, state.message);
            }
          },
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 45),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  const SizedBox(height: 138.48 - 56),

                  // Header - Design matched
                  _buildHeader(),

                  const SizedBox(height: 246.5 - 206.48),

                  // Form Fields with exact design spacing
                  _buildNameField(),
                  const SizedBox(height: 14),
                  _buildEmailField(),
                  const SizedBox(height: 14),
                  _buildPasswordField(),
                  const SizedBox(height: 14),
                  _buildConfirmPasswordField(),

                  const SizedBox(height: 524.5 - 507.87),
                  _buildTermsCheckbox(),

                  const SizedBox(height: 604.5 - 566.5),
                  _buildRegisterButton(),

                  const SizedBox(height: 40),

                  // Social Login
                  const SocialLoginWidget(),

                  const SizedBox(height: 24),

                  // Login Link
                  _buildLoginLink(),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ✅ ENHANCED HEADER with profile focus
  Widget _buildHeader() {
    return SizedBox(
      width: 244,
      height: 68,
      child: Column(
        children: [
          const Text(
            'Hoşgeldiniz',
            style: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.white,
              height: 1.0,
              letterSpacing: 0,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 8),
          
          // ✅ Updated subtitle to mention profile completion
          const Text(
            'Hesabınızı oluşturun ve profilinizi tamamlayın.',
            style: TextStyle(
              fontFamily: 'Euclid Circular A',
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: AppColors.white,
              height: 1.0,
              letterSpacing: 0,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildNameField() {
    return Container(
      width: 324,
      height: 54.37,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: const Color(0x1AFFFFFF),
        border: Border.all(
          color: const Color(0x33FFFFFF),
          width: 1,
        ),
      ),
      child: TextFormField(
        controller: _nameController,
        style: const TextStyle(
          fontFamily: 'Euclid Circular A',
          fontSize: 12,
          color: AppColors.white,
        ),
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
          prefixIcon: const Icon(
            Icons.person_add_outlined,
            size: 16,
            color: AppColors.white,
          ),
          hintText: 'Ad Soyad',
          hintStyle: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0x80FFFFFF),
            height: 1.5,
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Ad soyad gereklidir';
          }
          if (value.trim().split(' ').length < 2) {
            return 'Lütfen ad ve soyadınızı giriniz';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildEmailField() {
    return Container(
      width: 324,
      height: 54.37,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: const Color(0x1AFFFFFF),
        border: Border.all(
          color: const Color(0x33FFFFFF),
          width: 1,
        ),
      ),
      child: TextFormField(
        controller: _emailController,
        keyboardType: TextInputType.emailAddress,
        style: const TextStyle(
          fontFamily: 'Euclid Circular A',
          fontSize: 12,
          color: AppColors.white,
        ),
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
          prefixIcon: const Icon(
            Icons.email_outlined,
            size: 16,
            color: AppColors.white,
          ),
          hintText: 'E-Posta',
          hintStyle: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0x80FFFFFF),
            height: 1.5,
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
    );
  }

  Widget _buildPasswordField() {
    return Container(
      width: 324,
      height: 54.37,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: const Color(0x1AFFFFFF),
        border: Border.all(
          color: const Color(0x33FFFFFF),
          width: 1,
        ),
      ),
      child: TextFormField(
        controller: _passwordController,
        obscureText: !_isPasswordVisible,
        style: const TextStyle(
          fontFamily: 'Euclid Circular A',
          fontSize: 12,
          color: AppColors.white,
        ),
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
          prefixIcon: const Icon(
            Icons.lock_outline,
            size: 16,
            color: AppColors.white,
          ),
          suffixIcon: GestureDetector(
            onTap: () {
              setState(() {
                _isPasswordVisible = !_isPasswordVisible;
              });
            },
            child: Icon(
              _isPasswordVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
              size: 18,
              color: AppColors.white,
            ),
          ),
          hintText: 'Şifre',
          hintStyle: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0x80FFFFFF),
            height: 1.5,
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Şifre gereklidir';
          }
          if (value.length < 6) {
            return 'Şifre en az 6 karakter olmalıdır';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildConfirmPasswordField() {
    return Container(
      width: 324,
      height: 54.37,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: const Color(0x1AFFFFFF),
        border: Border.all(
          color: const Color(0x33FFFFFF),
          width: 1,
        ),
      ),
      child: TextFormField(
        controller: _confirmPasswordController,
        obscureText: true,
        style: const TextStyle(
          fontFamily: 'Euclid Circular A',
          fontSize: 12,
          color: AppColors.white,
        ),
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
          prefixIcon: const Icon(
            Icons.lock_outline,
            size: 16,
            color: AppColors.white,
          ),
          hintText: 'Şifre Tekrar',
          hintStyle: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0x80FFFFFF),
            height: 1.5,
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Şifre tekrarı gereklidir';
          }
          if (value != _passwordController.text) {
            return 'Şifreler eşleşmiyor';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildTermsCheckbox() {
    return SizedBox(
      width: 324,
      child: RichText(
        textAlign: TextAlign.left,
        text: TextSpan(
          style: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: Colors.white.withOpacity(0.8),
            height: 1.5,
            letterSpacing: 0,
          ),
          children: [
            const TextSpan(
              text: 'Kullanıcı sözleşmesini ',
            ),
            const TextSpan(
              text: 'okudum ve kabul ediyorum',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                decoration: TextDecoration.underline,
                decorationColor: Colors.white,
              ),
            ),
            const TextSpan(
              text: '. Kayıt sonrası profilinizi tamamlayabilirsiniz.',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRegisterButton() {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        final isLoading = state is AuthRegisterLoading || state is AuthLoading;
        
        return Container(
          width: 324,
          height: 53.31,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            color: AppColors.primary,
          ),
          child: ElevatedButton(
            onPressed: isLoading ? null : _handleRegister,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              foregroundColor: AppColors.white,
              shadowColor: Colors.transparent,
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
                    'Şimdi Kaydol',
                    style: TextStyle(
                      fontFamily: 'Euclid Circular A',
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      height: 1.0,
                      letterSpacing: 0,
                    ),
                  ),
          ),
        );
      },
    );
  }

  Widget _buildLoginLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Zaten bir hesabın var mı? ',
          style: TextStyle(
            fontFamily: 'Euclid Circular A',
            fontSize: 12,
            color: Colors.white.withOpacity(0.5),
          ),
        ),
        GestureDetector(
          onTap: () {
            print('🔄 Navigating to login page');
            
            try {
              context.go(AppRoutes.login);
            } catch (e) {
              print('⚠️ GoRouter failed, using Navigator fallback: $e');
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(
                  builder: (context) => BlocProvider.value(
                    value: context.read<AuthBloc>(),
                    child: const LoginPage(),
                  ),
                ),
              );
            }
          },
          child: const Text(
            'Giriş Yap!',
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

  void _handleRegister() {
    if (_formKey.currentState!.validate()) {
      final name = _nameController.text.trim();
      final email = _emailController.text.trim();
      final password = _passwordController.text;
      final confirmPassword = _confirmPasswordController.text;

      print('📝 Attempting registration for: $email');
      print('🎯 Will redirect to profile after successful registration');

      context.read<AuthBloc>().add(
        RegisterRequested(
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
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