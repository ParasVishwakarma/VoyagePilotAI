package com.travelguardian.recommendation.dto.response;

import com.travelguardian.recommendation.entity.RecommendationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RecommendationResponse {

    private Long id;

    private Long disruptionId;

    private RecommendationType type;

    private String message;

    private boolean accepted;

    private LocalDateTime createdAt;
}