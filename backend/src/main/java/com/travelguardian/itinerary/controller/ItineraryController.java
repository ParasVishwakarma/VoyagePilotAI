package com.travelguardian.itinerary.controller;

import com.travelguardian.itinerary.dto.request.CreateItineraryRequest;
import com.travelguardian.itinerary.dto.request.UpdateItineraryRequest;
import com.travelguardian.itinerary.dto.response.ItineraryResponse;
import com.travelguardian.itinerary.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping("/trip/{tripId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ItineraryResponse createItinerary(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateItineraryRequest request) {

        return itineraryService.createItinerary(tripId, request);
    }

    @GetMapping("/trip/{tripId}")
    public List<ItineraryResponse> getTripItineraries(
            @PathVariable Long tripId) {

        return itineraryService.getTripItineraries(tripId);
    }

    @GetMapping("/{id}")
    public ItineraryResponse getItinerary(
            @PathVariable Long id) {

        return itineraryService.getItinerary(id);
    }

    @PutMapping("/{id}")
    public ItineraryResponse updateItinerary(
            @PathVariable Long id,
            @Valid @RequestBody UpdateItineraryRequest request) {

        return itineraryService.updateItinerary(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItinerary(
            @PathVariable Long id) {

        itineraryService.deleteItinerary(id);
    }
}