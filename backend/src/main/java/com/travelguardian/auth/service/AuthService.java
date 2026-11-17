package com.travelguardian.auth.service;

import com.travelguardian.auth.dto.*;

import java.util.Map;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    Map<String, String> forgotPassword(ForgotPasswordRequest request);

    Map<String, String> resetPassword(ResetPasswordRequest request);
}
