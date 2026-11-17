package com.travelguardian.recommendation.dto.request;

import com.travelguardian.recommendation.entity.RecommendationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRecommendationRequest {

    private RecommendationType type;

    private String message;

    private Boolean accepted;
}
