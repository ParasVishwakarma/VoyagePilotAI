package com.travelguardian.trip.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateTripRequest {

    private String title;

    private String destination;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal budget;
}