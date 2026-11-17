package com.travelguardian.hotel.controller;

import com.travelguardian.hotel.dto.CreateHotelRequest;
import com.travelguardian.hotel.dto.HotelResponse;
import com.travelguardian.hotel.dto.UpdateHotelRequest;
import com.travelguardian.hotel.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping("/trip/{tripId}")
    public ResponseEntity<HotelResponse> createHotel(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateHotelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelService.createHotel(tripId, request));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<HotelResponse>> getTripHotels(@PathVariable Long tripId) {
        return ResponseEntity.ok(hotelService.getTripHotels(tripId));
    }

    @GetMapping
    public ResponseEntity<List<HotelResponse>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllMyHotels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelResponse> getHotel(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotel(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelResponse> updateHotel(
            @PathVariable Long id,
            @RequestBody UpdateHotelRequest request) {
        return ResponseEntity.ok(hotelService.updateHotel(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(Map.of("message", "Hotel accommodation removed successfully."));
    }
}
