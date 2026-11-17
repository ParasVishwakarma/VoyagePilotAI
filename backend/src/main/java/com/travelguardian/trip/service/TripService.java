package com.travelguardian.trip.service;

import com.travelguardian.trip.dto.CreateTripRequest;
import com.travelguardian.trip.dto.TripResponse;
import com.travelguardian.trip.dto.UpdateTripRequest;
import org.springframework.data.domain.Page;

public interface TripService {

    TripResponse createTrip(CreateTripRequest request);

    Page<TripResponse> getMyTrips(int page, int size, String sortBy);

    TripResponse getTrip(Long id);

    TripResponse updateTrip(Long id, UpdateTripRequest request);

    void deleteTrip(Long id);
}