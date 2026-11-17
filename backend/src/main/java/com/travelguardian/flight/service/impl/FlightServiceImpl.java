package com.travelguardian.flight.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.security.UserPrincipal;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.flight.dto.request.CreateFlightRequest;
import com.travelguardian.flight.dto.request.UpdateFlightRequest;
import com.travelguardian.flight.dto.response.FlightResponse;
import com.travelguardian.flight.entity.Flight;
import com.travelguardian.flight.repository.FlightRepository;
import com.travelguardian.flight.service.FlightService;
import com.travelguardian.trip.entity.Trip;
import com.travelguardian.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;
    private final TripRepository tripRepository;

    @Override
    public FlightResponse createFlight(Long tripId,
                                       CreateFlightRequest request) {

        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        Flight flight = Flight.builder()
                .trip(trip)
                .airline(request.getAirline())
                .flightNumber(request.getFlightNumber())
                .departureAirport(request.getDepartureAirport())
                .arrivalAirport(request.getArrivalAirport())
                .departureTerminal(request.getDepartureTerminal())
                .arrivalTerminal(request.getArrivalTerminal())
                .departureGate(request.getDepartureGate())
                .arrivalGate(request.getArrivalGate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .status(request.getStatus())
                .build();

        return map(flightRepository.save(flight));
    }

    @Override
    public List<FlightResponse> getTripFlights(Long tripId) {

        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        return flightRepository.findByTrip(trip)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public FlightResponse getFlight(Long id) {

        Flight flight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Flight not found"));

        User currentUser = getCurrentUser();

        if (!flight.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Flight not found");
        }

        return map(flight);
    }
    @Override
    public FlightResponse updateFlight(Long id,
                                       UpdateFlightRequest request) {

        Flight flight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Flight not found"));

        User currentUser = getCurrentUser();

        if (!flight.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Flight not found");
        }

        if (request.getAirline() != null)
            flight.setAirline(request.getAirline());

        if (request.getFlightNumber() != null)
            flight.setFlightNumber(request.getFlightNumber());

        if (request.getDepartureAirport() != null)
            flight.setDepartureAirport(request.getDepartureAirport());

        if (request.getArrivalAirport() != null)
            flight.setArrivalAirport(request.getArrivalAirport());

        if (request.getDepartureTerminal() != null)
            flight.setDepartureTerminal(request.getDepartureTerminal());

        if (request.getArrivalTerminal() != null)
            flight.setArrivalTerminal(request.getArrivalTerminal());

        if (request.getDepartureGate() != null)
            flight.setDepartureGate(request.getDepartureGate());

        if (request.getArrivalGate() != null)
            flight.setArrivalGate(request.getArrivalGate());

        if (request.getDepartureTime() != null)
            flight.setDepartureTime(request.getDepartureTime());

        if (request.getArrivalTime() != null)
            flight.setArrivalTime(request.getArrivalTime());

        if (request.getStatus() != null)
            flight.setStatus(request.getStatus());

        return map(flightRepository.save(flight));
    }

    @Override
    public void deleteFlight(Long id) {

        Flight flight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Flight not found"));

        User currentUser = getCurrentUser();

        if (!flight.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Flight not found");
        }

        flightRepository.delete(flight);
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserPrincipal userPrincipal =
                (UserPrincipal) authentication.getPrincipal();

        return userPrincipal.getUser();
    }

    private FlightResponse map(Flight flight) {

        return FlightResponse.builder()
                .id(flight.getId())
                .tripId(flight.getTrip().getId())
                .airline(flight.getAirline())
                .flightNumber(flight.getFlightNumber())
                .departureAirport(flight.getDepartureAirport())
                .arrivalAirport(flight.getArrivalAirport())
                .departureTerminal(flight.getDepartureTerminal())
                .arrivalTerminal(flight.getArrivalTerminal())
                .departureGate(flight.getDepartureGate())
                .arrivalGate(flight.getArrivalGate())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .status(flight.getStatus())
                .createdAt(flight.getCreatedAt())
                .updatedAt(flight.getUpdatedAt())
                .build();
    }
}