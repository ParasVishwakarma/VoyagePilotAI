package com.travelguardian.auth.service;

import com.travelguardian.auth.dto.AuthResponse;
import com.travelguardian.auth.dto.LoginRequest;
import com.travelguardian.auth.dto.RegisterRequest;
import com.travelguardian.auth.entity.Role;
import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.RefreshTokenRepository;
import com.travelguardian.auth.repository.RoleRepository;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.auth.security.JwtService;
import com.travelguardian.auth.service.impl.AuthServiceImpl;
import com.travelguardian.exception.ConflictException;
import com.travelguardian.mail.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        Role role = Role.builder().id(1L).name("ROLE_USER").build();
        sampleUser = User.builder()
                .id(1L)
                .email("test@voyagepilot.ai")
                .firstName("Alex")
                .lastName("Pilot")
                .password("encoded_pass")
                .roles(Set.of(role))
                .build();
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = RegisterRequest.builder()
                .firstName("Alex")
                .lastName("Pilot")
                .email("test@voyagepilot.ai")
                .password("password123")
                .phone("+1234567890")
                .build();

        when(userRepository.existsByEmail("test@voyagepilot.ai")).thenReturn(false);
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(Role.builder().name("ROLE_USER").build()));
        when(passwordEncoder.encode("password123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken("test@voyagepilot.ai")).thenReturn("jwt.token.here");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("jwt.token.here", res.getAccessToken());
        assertEquals("Bearer", res.getTokenType());
    }

    @Test
    void testRegisterDuplicateEmailThrowsConflict() {
        RegisterRequest req = RegisterRequest.builder()
                .email("test@voyagepilot.ai")
                .build();

        when(userRepository.existsByEmail("test@voyagepilot.ai")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(req));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest req = LoginRequest.builder()
                .email("test@voyagepilot.ai")
                .password("password123")
                .build();

        when(userRepository.findByEmail("test@voyagepilot.ai")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encoded_pass")).thenReturn(true);
        when(jwtService.generateToken("test@voyagepilot.ai")).thenReturn("jwt.token.here");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("jwt.token.here", res.getAccessToken());
    }

    @Test
    void testLoginInvalidPasswordThrowsBadCredentials() {
        LoginRequest req = LoginRequest.builder()
                .email("test@voyagepilot.ai")
                .password("wrongpassword")
                .build();

        when(userRepository.findByEmail("test@voyagepilot.ai")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", "encoded_pass")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }
}
