package com.travelguardian.flight.controller;

import com.travelguardian.flight.dto.request.CreateFlightRequest;
import com.travelguardian.flight.dto.request.UpdateFlightRequest;
import com.travelguardian.flight.dto.response.FlightResponse;
import com.travelguardian.flight.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @PostMapping("/trip/{tripId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FlightResponse createFlight(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateFlightRequest request) {

        return flightService.createFlight(tripId, request);
    }

    @GetMapping("/trip/{tripId}")
    public List<FlightResponse> getTripFlights(
            @PathVariable Long tripId) {

        return flightService.getTripFlights(tripId);
    }

    @GetMapping("/{id}")
    public FlightResponse getFlight(
            @PathVariable Long id) {

        return flightService.getFlight(id);
    }

    @PutMapping("/{id}")
    public FlightResponse updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFlightRequest request) {

        return flightService.updateFlight(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFlight(
            @PathVariable Long id) {

        flightService.deleteFlight(id);
    }
}