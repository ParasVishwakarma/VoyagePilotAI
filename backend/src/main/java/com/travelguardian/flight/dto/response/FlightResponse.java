package com.travelguardian.flight.dto.response;

import com.travelguardian.flight.entity.FlightStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FlightResponse {

    private Long id;

    private Long tripId;

    private String airline;

    private String flightNumber;

    private String departureAirport;

    private String arrivalAirport;

    private String departureTerminal;

    private String arrivalTerminal;

    private String departureGate;

    private String arrivalGate;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    private FlightStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}