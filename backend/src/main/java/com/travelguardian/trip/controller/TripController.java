package com.travelguardian.trip.controller;

import com.travelguardian.trip.dto.CreateTripRequest;
import com.travelguardian.trip.dto.TripResponse;
import com.travelguardian.trip.dto.UpdateTripRequest;
import com.travelguardian.trip.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @Valid @RequestBody CreateTripRequest request) {

        return ResponseEntity.ok(tripService.createTrip(request));
    }

    @GetMapping
    public ResponseEntity<Page<TripResponse>> getMyTrips(

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startDate") String sortBy) {

        return ResponseEntity.ok(
                tripService.getMyTrips(page, size, sortBy)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTrip(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                tripService.getTrip(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(
            @PathVariable Long id,
            @RequestBody UpdateTripRequest request) {

        return ResponseEntity.ok(
                tripService.updateTrip(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrip(
            @PathVariable Long id) {

        tripService.deleteTrip(id);

        return ResponseEntity.ok("Trip deleted successfully.");
    }
}