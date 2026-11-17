package com.travelguardian.trip.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.exception.BadRequestException;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.trip.dto.CreateTripRequest;
import com.travelguardian.trip.dto.TripResponse;
import com.travelguardian.trip.dto.UpdateTripRequest;
import com.travelguardian.trip.entity.Trip;
import com.travelguardian.trip.repository.TripRepository;
import com.travelguardian.trip.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public TripResponse createTrip(CreateTripRequest request) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        User user = getCurrentUser();

        Trip trip = Trip.builder()
                .title(request.getTitle())
                .destination(request.getDestination())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .user(user)
                .build();

        return map(tripRepository.save(trip));
    }

    @Override
    public Page<TripResponse> getMyTrips(int page, int size, String sortBy) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending()
        );

        return tripRepository
                .findAllByUser(getCurrentUser(), pageable)
                .map(this::map);
    }

    @Override
    public TripResponse getTrip(Long id) {

        Trip trip = tripRepository
                .findByIdAndUser(id, getCurrentUser())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        return map(trip);
    }

    @Override
    public TripResponse updateTrip(Long id, UpdateTripRequest request) {

        Trip trip = tripRepository
                .findByIdAndUser(id, getCurrentUser())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        LocalDate startDate = request.getStartDate() != null
                ? request.getStartDate()
                : trip.getStartDate();

        LocalDate endDate = request.getEndDate() != null
                ? request.getEndDate()
                : trip.getEndDate();

        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date cannot be before start date");
        }

        if (request.getTitle() != null) {
            trip.setTitle(request.getTitle());
        }

        if (request.getDestination() != null) {
            trip.setDestination(request.getDestination());
        }

        if (request.getDescription() != null) {
            trip.setDescription(request.getDescription());
        }

        if (request.getStartDate() != null) {
            trip.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            trip.setEndDate(request.getEndDate());
        }

        if (request.getBudget() != null) {
            trip.setBudget(request.getBudget());
        }

        trip.setUpdatedAt(LocalDateTime.now());

        return map(tripRepository.save(trip));
    }

    @Override
    public void deleteTrip(Long id) {

        Trip trip = tripRepository
                .findByIdAndUser(id, getCurrentUser())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        tripRepository.delete(trip);
    }

    private TripResponse map(Trip trip) {

        return TripResponse.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .destination(trip.getDestination())
                .description(trip.getDescription())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .budget(trip.getBudget())
                .status(trip.getStatus())
                .build();
    }
}