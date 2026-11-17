package com.travelguardian.ai.service;

import com.travelguardian.ai.dto.AIRecommendationResponse;

public interface AIRecommendationService {

    AIRecommendationResponse generateRecommendation(Long disruptionId);

    AIRecommendationResponse generateTravelAdvice(String query, String destination, String flightNumber);

}
