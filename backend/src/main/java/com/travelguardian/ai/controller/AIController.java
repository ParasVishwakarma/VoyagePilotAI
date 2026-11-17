package com.travelguardian.ai.controller;

import com.travelguardian.ai.dto.AIRecommendationResponse;
import com.travelguardian.ai.service.AIRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIRecommendationService aiRecommendationService;

    @PostMapping("/recommend/{disruptionId}")
    public AIRecommendationResponse recommend(
            @PathVariable Long disruptionId
    ) {
        return aiRecommendationService.generateRecommendation(disruptionId);
    }

    @PostMapping("/advice")
    public AIRecommendationResponse getAdvice(
            @RequestBody(required = false) java.util.Map<String, String> request
    ) {
        String query = request != null ? request.get("query") : null;
        String destination = request != null ? request.get("destination") : null;
        String flightNumber = request != null ? request.get("flightNumber") : null;
        return aiRecommendationService.generateTravelAdvice(query, destination, flightNumber);
    }

}