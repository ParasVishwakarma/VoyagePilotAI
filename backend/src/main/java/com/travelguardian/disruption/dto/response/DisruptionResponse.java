package com.travelguardian.disruption.dto.response;

import com.travelguardian.disruption.entity.DisruptionSeverity;
import com.travelguardian.disruption.entity.DisruptionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DisruptionResponse {

    private Long id;

    private Long flightId;

    private DisruptionType type;

    private DisruptionSeverity severity;

    private String description;

    private boolean resolved;

    private LocalDateTime detectedAt;
}