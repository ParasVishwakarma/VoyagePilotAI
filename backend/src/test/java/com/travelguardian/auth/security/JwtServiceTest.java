package com.travelguardian.auth.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "expiration", 3600000L);
    }

    @Test
    void testGenerateAndValidateToken() {
        String username = "traveler@voyagepilot.ai";
        String token = jwtService.generateToken(username);

        assertNotNull(token);
        assertFalse(token.isEmpty());

        String extracted = jwtService.extractUsername(token);
        assertEquals(username, extracted);

        assertTrue(jwtService.isTokenValid(token, username));
        assertFalse(jwtService.isTokenValid(token, "other@voyagepilot.ai"));
    }

    @Test
    void testInvalidTokenReturnsNull() {
        assertNull(jwtService.extractUsername("invalid.garbage.token"));
        assertFalse(jwtService.isTokenValid("invalid.garbage.token", "test@voyagepilot.ai"));
    }
}
