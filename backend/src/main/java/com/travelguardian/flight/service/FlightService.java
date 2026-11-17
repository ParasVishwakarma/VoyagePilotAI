package com.travelguardian.flight.service;

import com.travelguardian.flight.dto.request.CreateFlightRequest;
import com.travelguardian.flight.dto.request.UpdateFlightRequest;
import com.travelguardian.flight.dto.response.FlightResponse;

import java.util.List;

public interface FlightService {

    FlightResponse createFlight(Long tripId,
                                CreateFlightRequest request);

    FlightResponse updateFlight(Long id,
                                UpdateFlightRequest request);

    void deleteFlight(Long id);

    FlightResponse getFlight(Long id);

    List<FlightResponse> getTripFlights(Long tripId);
}