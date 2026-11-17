package com.travelguardian.recommendation.controller;

import com.travelguardian.recommendation.dto.request.CreateRecommendationRequest;
import com.travelguardian.recommendation.dto.request.UpdateRecommendationRequest;
import com.travelguardian.recommendation.dto.response.RecommendationResponse;
import com.travelguardian.recommendation.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecommendationResponse createRecommendation(
            @Valid @RequestBody CreateRecommendationRequest request) {

        return recommendationService.createRecommendation(request);
    }

    @GetMapping
    public List<RecommendationResponse> getAllRecommendations() {
        return recommendationService.getAllRecommendations();
    }

    @GetMapping("/{id}")
    public RecommendationResponse getRecommendation(@PathVariable Long id) {
        return recommendationService.getRecommendation(id);
    }

    @GetMapping("/disruption/{disruptionId}")
    public List<RecommendationResponse> getDisruptionRecommendations(
            @PathVariable Long disruptionId) {

        return recommendationService.getDisruptionRecommendations(disruptionId);
    }


    @PutMapping("/{id}/accept")
    public RecommendationResponse acceptRecommendation(
            @PathVariable Long id) {

        return recommendationService.acceptRecommendation(id);
    }

    @PutMapping("/{id}/reject")
    public RecommendationResponse rejectRecommendation(
            @PathVariable Long id) {

        return recommendationService.rejectRecommendation(id);
    }
    @PutMapping("/{id}")
    public RecommendationResponse updateRecommendation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRecommendationRequest request) {

        return recommendationService.updateRecommendation(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecommendation(@PathVariable Long id) {
        recommendationService.deleteRecommendation(id);
    }
}