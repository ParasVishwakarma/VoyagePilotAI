package com.travelguardian.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationItem {

    private String id;
    private String title;
    private String message;
    private String type; // FLIGHT_DELAY, FLIGHT_CANCELLED, UPCOMING_TRIP, AI_RECOMMENDATION, SYSTEM
    private String severity; // INFO, WARNING, ERROR, SUCCESS
    private String targetUrl;
    private LocalDateTime timestamp;
    private boolean read;
}
