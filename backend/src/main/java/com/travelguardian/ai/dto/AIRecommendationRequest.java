package com.travelguardian.ai.dto;

import lombok.Data;

@Data
public class AIRecommendationRequest {

    private Long disruptionId;  // <-- Add this

    private String travelerName;

    private String airline;

    private String flightNumber;

    private String departureAirport;

    private String arrivalAirport;

    private String disruptionType;

    private String severity;

    private String itinerary;

    private String budget;

    private String preferences;
}