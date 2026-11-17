package com.travelguardian.flight.dto.request;

import com.travelguardian.flight.entity.FlightStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateFlightRequest {

    @NotBlank
    private String airline;

    @NotBlank
    private String flightNumber;

    @NotBlank
    private String departureAirport;

    @NotBlank
    private String arrivalAirport;

    private String departureTerminal;

    private String arrivalTerminal;

    private String departureGate;

    private String arrivalGate;

    @NotNull
    private LocalDateTime departureTime;

    @NotNull
    private LocalDateTime arrivalTime;

    @NotNull
    private FlightStatus status;
}