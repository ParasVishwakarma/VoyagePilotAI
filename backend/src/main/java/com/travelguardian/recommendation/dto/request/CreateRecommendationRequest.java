package com.travelguardian.recommendation.dto.request;

import com.travelguardian.recommendation.entity.RecommendationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRecommendationRequest {

    @NotNull
    private Long disruptionId;

    @NotNull
    private RecommendationType type;

    @NotBlank
    private String message;
}