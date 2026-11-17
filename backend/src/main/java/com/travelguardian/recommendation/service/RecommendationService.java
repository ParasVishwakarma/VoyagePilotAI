package com.travelguardian.recommendation.service;

import com.travelguardian.recommendation.dto.request.CreateRecommendationRequest;
import com.travelguardian.recommendation.dto.request.UpdateRecommendationRequest;
import com.travelguardian.recommendation.dto.response.RecommendationResponse;

import java.util.List;

public interface RecommendationService {

    RecommendationResponse createRecommendation(CreateRecommendationRequest request);

    RecommendationResponse updateRecommendation(Long id,
                                                UpdateRecommendationRequest request);

    RecommendationResponse acceptRecommendation(Long id);

    RecommendationResponse rejectRecommendation(Long id);

    void deleteRecommendation(Long id);

    RecommendationResponse getRecommendation(Long id);

    List<RecommendationResponse> getAllRecommendations();

    List<RecommendationResponse> getDisruptionRecommendations(Long disruptionId);
}