package com.travelguardian.mail.service.impl;

import com.travelguardian.mail.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendRecommendationEmail(
            String to,
            String name,
            String subject,
            String recommendation,
            String flightNumber
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);

        message.setText(
                """
                Hello %s,

                Your flight (%s) has a new AI recommendation.

                Recommendation:
                %s

                Please log in to VoyagePilot AI to view more details.

                Regards,
                VoyagePilot AI Team
                """
                        .formatted(
                                name,
                                flightNumber,
                                recommendation
                        )
        );

        mailSender.send(message);
    }
}