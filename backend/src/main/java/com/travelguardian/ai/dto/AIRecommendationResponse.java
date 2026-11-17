package com.travelguardian.ai.dto;

import lombok.Data;

@Data
public class AIRecommendationResponse {

    private String action;

    private String reason;

    private String airline;

    private String flightNumber;

    private boolean hotelExtension;

    private boolean refund;

    private boolean itineraryUpdate;

    private String notification;

}