package com.travelguardian.disruption.dto.request;

import com.travelguardian.disruption.entity.DisruptionSeverity;
import com.travelguardian.disruption.entity.DisruptionType;
import lombok.Data;

@Data
public class UpdateDisruptionRequest {

    private DisruptionType type;

    private DisruptionSeverity severity;

    private String description;

    private Boolean resolved;
}