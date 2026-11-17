package com.travelguardian.itinerary.service;

import com.travelguardian.itinerary.dto.request.CreateItineraryRequest;
import com.travelguardian.itinerary.dto.request.UpdateItineraryRequest;
import com.travelguardian.itinerary.dto.response.ItineraryResponse;

import java.util.List;

public interface ItineraryService {

    ItineraryResponse createItinerary(Long tripId,
                                      CreateItineraryRequest request);

    ItineraryResponse updateItinerary(Long itineraryId,
                                      UpdateItineraryRequest request);

    void deleteItinerary(Long itineraryId);

    ItineraryResponse getItinerary(Long itineraryId);

    List<ItineraryResponse> getTripItineraries(Long tripId);

}