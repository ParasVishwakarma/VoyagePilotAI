package com.travelguardian.flight.dto.request;

import com.travelguardian.flight.entity.FlightStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateFlightRequest {

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
}