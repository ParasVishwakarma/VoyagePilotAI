package com.travelguardian.disruption.dto.request;

import com.travelguardian.disruption.entity.DisruptionSeverity;
import com.travelguardian.disruption.entity.DisruptionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDisruptionRequest {

    @NotNull
    private Long flightId;

    @NotNull
    private DisruptionType type;

    @NotNull
    private DisruptionSeverity severity;

    @NotBlank
    private String description;
}