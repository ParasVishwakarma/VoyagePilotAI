package com.travelguardian.mail.service;

public interface EmailService {

    void sendRecommendationEmail(
            String to,
            String name,
            String subject,
            String recommendation,
            String flightNumber
    );
}