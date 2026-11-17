package com.travelguardian.hotel.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.hotel.dto.CreateHotelRequest;
import com.travelguardian.hotel.dto.HotelResponse;
import com.travelguardian.hotel.dto.UpdateHotelRequest;
import com.travelguardian.hotel.service.HotelService;
import com.travelguardian.itinerary.entity.Itinerary;
import com.travelguardian.itinerary.entity.ItineraryStatus;
import com.travelguardian.itinerary.entity.ItineraryType;
import com.travelguardian.itinerary.repository.ItineraryRepository;
import com.travelguardian.trip.entity.Trip;
import com.travelguardian.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

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
    public HotelResponse createHotel(Long tripId, CreateHotelRequest request) {
        User currentUser = getCurrentUser();
        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        String metaJson = encodeMetadata(request.getPrice(), request.getRoomType(), request.getNotes());

        ItineraryStatus status = ItineraryStatus.PLANNED;
        if (request.getStatus() != null) {
            try {
                status = ItineraryStatus.valueOf(request.getStatus().toUpperCase());
            } catch (Exception ignored) {}
        }

        Itinerary itinerary = Itinerary.builder()
                .trip(trip)
                .title(request.getName())
                .type(ItineraryType.HOTEL)
                .description(metaJson)
                .location(request.getAddress())
                .startTime(request.getCheckIn())
                .endTime(request.getCheckOut())
                .bookingReference(request.getConfirmationCode())
                .status(status)
                .sequence(1)
                .build();

        return map(itineraryRepository.save(itinerary));
    }

    @Override
    public List<HotelResponse> getTripHotels(Long tripId) {
        User currentUser = getCurrentUser();
        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        return itineraryRepository.findByTripAndTypeOrderByStartTimeAsc(trip, ItineraryType.HOTEL)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<HotelResponse> getAllMyHotels() {
        User currentUser = getCurrentUser();
        return itineraryRepository.findByUserAndType(currentUser, ItineraryType.HOTEL)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public HotelResponse getHotel(Long id) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel booking not found"));

        User currentUser = getCurrentUser();
        if (!itinerary.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Hotel booking not found");
        }

        return map(itinerary);
    }

    @Override
    @Transactional
    public HotelResponse updateHotel(Long id, UpdateHotelRequest request) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel booking not found"));

        User currentUser = getCurrentUser();
        if (!itinerary.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Hotel booking not found");
        }

        if (request.getName() != null) itinerary.setTitle(request.getName());
        if (request.getAddress() != null) itinerary.setLocation(request.getAddress());
        if (request.getCheckIn() != null) itinerary.setStartTime(request.getCheckIn());
        if (request.getCheckOut() != null) itinerary.setEndTime(request.getCheckOut());
        if (request.getConfirmationCode() != null) itinerary.setBookingReference(request.getConfirmationCode());

        if (request.getStatus() != null) {
            try {
                itinerary.setStatus(ItineraryStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }

        Map<String, Object> meta = decodeMetadata(itinerary.getDescription());
        if (request.getPrice() != null) meta.put("price", request.getPrice().toString());
        if (request.getRoomType() != null) meta.put("roomType", request.getRoomType());
        if (request.getNotes() != null) meta.put("notes", request.getNotes());

        try {
            itinerary.setDescription(objectMapper.writeValueAsString(meta));
        } catch (Exception ignored) {}

        return map(itineraryRepository.save(itinerary));
    }

    @Override
    @Transactional
    public void deleteHotel(Long id) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel booking not found"));

        User currentUser = getCurrentUser();
        if (!itinerary.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Hotel booking not found");
        }

        itineraryRepository.delete(itinerary);
    }

    private String encodeMetadata(BigDecimal price, String roomType, String notes) {
        Map<String, Object> map = new HashMap<>();
        if (price != null) map.put("price", price.toString());
        if (roomType != null) map.put("roomType", roomType);
        if (notes != null) map.put("notes", notes);
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            return notes != null ? notes : "";
        }
    }

    private Map<String, Object> decodeMetadata(String description) {
        if (description == null || description.trim().isEmpty()) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(description, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            Map<String, Object> map = new HashMap<>();
            map.put("notes", description);
            return map;
        }
    }

    private HotelResponse map(Itinerary itinerary) {
        Map<String, Object> meta = decodeMetadata(itinerary.getDescription());

        BigDecimal price = null;
        if (meta.containsKey("price")) {
            try {
                price = new BigDecimal(meta.get("price").toString());
            } catch (Exception ignored) {}
        }

        String roomType = meta.containsKey("roomType") ? String.valueOf(meta.get("roomType")) : "Standard Room";
        String notes = meta.containsKey("notes") ? String.valueOf(meta.get("notes")) : "";

        return HotelResponse.builder()
                .id(itinerary.getId())
                .tripId(itinerary.getTrip().getId())
                .tripTitle(itinerary.getTrip().getTitle())
                .name(itinerary.getTitle())
                .address(itinerary.getLocation())
                .checkIn(itinerary.getStartTime())
                .checkOut(itinerary.getEndTime())
                .confirmationCode(itinerary.getBookingReference())
                .price(price)
                .roomType(roomType)
                .status(itinerary.getStatus() != null ? itinerary.getStatus().name() : "CONFIRMED")
                .notes(notes)
                .createdAt(itinerary.getCreatedAt())
                .build();
    }
}
