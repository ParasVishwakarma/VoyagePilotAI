package com.travelguardian.itinerary.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.security.UserPrincipal;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.itinerary.dto.request.CreateItineraryRequest;
import com.travelguardian.itinerary.dto.request.UpdateItineraryRequest;
import com.travelguardian.itinerary.dto.response.ItineraryResponse;
import com.travelguardian.itinerary.entity.Itinerary;
import com.travelguardian.itinerary.repository.ItineraryRepository;
import com.travelguardian.itinerary.service.ItineraryService;
import com.travelguardian.trip.entity.Trip;
import com.travelguardian.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryServiceImpl implements ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;

    @Override
    public ItineraryResponse createItinerary(Long tripId,
                                             CreateItineraryRequest request) {

        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        Itinerary itinerary = Itinerary.builder()
                .title(request.getTitle())
                .type(request.getType())
                .description(request.getDescription())
                .location(request.getLocation())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .bookingReference(request.getBookingReference())
                .status(request.getStatus())
                .sequence(request.getSequence())
                .trip(trip)
                .build();

        return map(itineraryRepository.save(itinerary));
    }

    @Override
    public List<ItineraryResponse> getTripItineraries(Long tripId) {

        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        return itineraryRepository.findByTripOrderBySequenceAsc(trip)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public ItineraryResponse getItinerary(Long id) {

        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Itinerary not found"));

        User currentUser = getCurrentUser();

        if (!itinerary.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Itinerary not found");
        }

        return map(itinerary);
    }
    @Override
    public ItineraryResponse updateItinerary(Long id,
                                             UpdateItineraryRequest request) {

        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Itinerary not found"));

        User currentUser = getCurrentUser();

        if (!itinerary.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Itinerary not found");
        }

        if (request.getTitle() != null)
            itinerary.setTitle(request.getTitle());

        if (request.getType() != null)
            itinerary.setType(request.getType());

        if (request.getDescription() != null)
            itinerary.setDescription(request.getDescription());

        if (request.getLocation() != null)
            itinerary.setLocation(request.getLocation());

        if (request.getStartTime() != null)
            itinerary.setStartTime(request.getStartTime());

        if (request.getEndTime() != null)
            itinerary.setEndTime(request.getEndTime());

        if (request.getBookingReference() != null)
            itinerary.setBookingReference(request.getBookingReference());

        if (request.getStatus() != null)
            itinerary.setStatus(request.getStatus());

        if (request.getSequence() != null)
            itinerary.setSequence(request.getSequence());

        return map(itineraryRepository.save(itinerary));
    }

    @Override
    public void deleteItinerary(Long id) {

        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Itinerary not found"));

        User currentUser = getCurrentUser();

        if (!itinerary.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Itinerary not found");
        }

        itineraryRepository.delete(itinerary);
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserPrincipal userPrincipal =
                (UserPrincipal) authentication.getPrincipal();

        return userPrincipal.getUser();
    }

    private ItineraryResponse map(Itinerary itinerary) {

        return ItineraryResponse.builder()
                .id(itinerary.getId())
                .tripId(itinerary.getTrip().getId())
                .title(itinerary.getTitle())
                .type(itinerary.getType())
                .description(itinerary.getDescription())
                .location(itinerary.getLocation())
                .startTime(itinerary.getStartTime())
                .endTime(itinerary.getEndTime())
                .bookingReference(itinerary.getBookingReference())
                .status(itinerary.getStatus())
                .sequence(itinerary.getSequence())
                .createdAt(itinerary.getCreatedAt())
                .updatedAt(itinerary.getUpdatedAt())
                .build();
    }
}