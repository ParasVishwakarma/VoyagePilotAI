package com.travelguardian.disruption.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.disruption.dto.request.CreateDisruptionRequest;
import com.travelguardian.disruption.dto.request.UpdateDisruptionRequest;
import com.travelguardian.disruption.dto.response.DisruptionResponse;
import com.travelguardian.disruption.entity.Disruption;
import com.travelguardian.disruption.repository.DisruptionRepository;
import com.travelguardian.disruption.service.DisruptionService;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.flight.entity.Flight;
import com.travelguardian.flight.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisruptionServiceImpl implements DisruptionService {

    private final DisruptionRepository disruptionRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public DisruptionResponse createDisruption(CreateDisruptionRequest request) {
        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        User currentUser = getCurrentUser();
        if (!flight.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Flight not found");
        }

        Disruption disruption = Disruption.builder()
                .flight(flight)
                .type(request.getType())
                .severity(request.getSeverity())
                .description(request.getDescription())
                .resolved(false)
                .build();

        return map(disruptionRepository.save(disruption));
    }

    @Override
    public List<DisruptionResponse> getAllDisruptions() {
        User currentUser = getCurrentUser();
        return disruptionRepository.findAllByUser(currentUser)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<DisruptionResponse> getFlightDisruptions(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        User currentUser = getCurrentUser();
        if (!flight.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Flight not found");
        }

        return disruptionRepository.findByFlight(flight)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public DisruptionResponse getDisruption(Long id) {
        Disruption disruption = disruptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found"));

        User currentUser = getCurrentUser();
        if (!disruption.getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Disruption not found");
        }

        return map(disruption);
    }

    @Override
    @Transactional
    public DisruptionResponse updateDisruption(Long id, UpdateDisruptionRequest request) {
        Disruption disruption = disruptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found"));

        User currentUser = getCurrentUser();
        if (!disruption.getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Disruption not found");
        }

        if (request.getType() != null) disruption.setType(request.getType());
        if (request.getSeverity() != null) disruption.setSeverity(request.getSeverity());
        if (request.getDescription() != null) disruption.setDescription(request.getDescription());
        if (request.getResolved() != null) disruption.setResolved(request.getResolved());

        return map(disruptionRepository.save(disruption));
    }

    @Override
    @Transactional
    public void deleteDisruption(Long id) {
        Disruption disruption = disruptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found"));

        User currentUser = getCurrentUser();
        if (!disruption.getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Disruption not found");
        }

        disruptionRepository.delete(disruption);
    }

    private DisruptionResponse map(Disruption disruption) {
        return DisruptionResponse.builder()
                .id(disruption.getId())
                .flightId(disruption.getFlight().getId())
                .type(disruption.getType())
                .severity(disruption.getSeverity())
                .description(disruption.getDescription())
                .resolved(disruption.isResolved())
                .detectedAt(disruption.getDetectedAt())
                .build();
    }
}
