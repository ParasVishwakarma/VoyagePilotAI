package com.travelguardian.auth.service.impl;

import com.travelguardian.auth.dto.*;
import com.travelguardian.auth.entity.RefreshToken;
import com.travelguardian.auth.entity.Role;
import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.RefreshTokenRepository;
import com.travelguardian.auth.repository.RoleRepository;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.auth.security.JwtService;
import com.travelguardian.auth.service.AuthService;
import com.travelguardian.exception.BadRequestException;
import com.travelguardian.exception.ConflictException;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.mail.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }

        Role role = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER").build()));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(role))
                .enabled(true)
                .accountNonLocked(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        String accessToken = jwtService.generateToken(savedUser.getEmail());
        String refreshToken = createOrUpdateRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = createOrUpdateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired refresh token"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token has expired. Please log in again.");
        }

        User user = token.getUser();
        String newAccessToken = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token.getToken())
                .tokenType("Bearer")
                .build();
    }

    @Override
    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            String resetToken = jwtService.generateToken(user.getEmail());
            try {
                emailService.sendRecommendationEmail(
                        user.getEmail(),
                        user.getFirstName(),
                        "VoyagePilot AI — Password Reset Request",
                        "We received a request to reset your password. Use the following reset token in VoyagePilot AI: " + resetToken,
                        "N/A"
                );
            } catch (Exception e) {
                log.warn("Failed to dispatch password reset email: {}", e.getMessage());
            }
            return Map.of("message", "If an account matches that email, a password reset link has been dispatched.", "resetToken", resetToken);
        }

        return Map.of("message", "If an account matches that email, a password reset link has been dispatched.");
    }

    @Override
    @Transactional
    public Map<String, String> resetPassword(ResetPasswordRequest request) {
        String username = jwtService.extractUsername(request.getToken());
        if (username == null) {
            throw new BadRequestException("Invalid or expired password reset token.");
        }

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return Map.of("message", "Password has been reset successfully. You may now log in with your new password.");
    }

    private String createOrUpdateRefreshToken(User user) {
        String tokenStr = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusDays(7);

        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElseGet(() -> RefreshToken.builder().user(user).build());

        refreshToken.setToken(tokenStr);
        refreshToken.setExpiryDate(expiry);
        refreshTokenRepository.save(refreshToken);

        return tokenStr;
    }
}
