package com.travelguardian.trip.dto;

import com.travelguardian.trip.entity.TripStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class TripResponse {

    private Long id;

    private String title;

    private String destination;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal budget;

    private TripStatus status;
}