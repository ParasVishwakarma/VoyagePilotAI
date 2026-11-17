package com.travelguardian.notification.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.disruption.entity.Disruption;
import com.travelguardian.disruption.repository.DisruptionRepository;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.flight.entity.Flight;
import com.travelguardian.flight.entity.FlightStatus;
import com.travelguardian.flight.repository.FlightRepository;
import com.travelguardian.notification.dto.NotificationItem;
import com.travelguardian.notification.service.NotificationService;
import com.travelguardian.recommendation.entity.Recommendation;
import com.travelguardian.recommendation.repository.RecommendationRepository;
import com.travelguardian.trip.entity.Trip;
import com.travelguardian.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final FlightRepository flightRepository;
    private final DisruptionRepository disruptionRepository;
    private final RecommendationRepository recommendationRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public List<NotificationItem> getNotifications() {
        User user = getAuthenticatedUser();
        List<NotificationItem> items = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // 1. Upcoming trips notifications
        List<Trip> trips = tripRepository.findAllByUser(
                user,
                PageRequest.of(0, 50, Sort.by("startDate").ascending())
        ).getContent();

        for (Trip trip : trips) {
            if (trip.getStartDate() != null && !trip.getStartDate().isBefore(today)) {
                long days = ChronoUnit.DAYS.between(today, trip.getStartDate());
                if (days <= 7) {
                    items.add(NotificationItem.builder()
                            .id("trip-" + trip.getId())
                            .title("Upcoming Trip: " + trip.getTitle())
                            .message(days == 0
                                    ? "Your journey to " + trip.getDestination() + " begins today! Have a safe trip."
                                    : "Journey to " + trip.getDestination() + " departs in " + days + " " + (days == 1 ? "day" : "days") + ".")
                            .type("UPCOMING_TRIP")
                            .severity(days <= 1 ? "WARNING" : "INFO")
                            .targetUrl("/trips")
                            .timestamp(trip.getStartDate().atStartOfDay())
                            .read(false)
                            .build());
                }
            }
        }

        // 2. Flight disruptions / delays / cancellations
        List<Flight> flights = flightRepository.findByTripUser(user);
        for (Flight flight : flights) {
            if (flight.getStatus() == FlightStatus.DELAYED) {
                items.add(NotificationItem.builder()
                        .id("flight-delayed-" + flight.getId())
                        .title("Flight Delay Notice: " + flight.getFlightNumber())
                        .message("Flight " + flight.getFlightNumber() + " (" + flight.getDepartureAirport() + " -> " + flight.getArrivalAirport() + ") has been flagged as delayed.")
                        .type("FLIGHT_DELAY")
                        .severity("WARNING")
                        .targetUrl("/flights")
                        .timestamp(flight.getUpdatedAt() != null ? flight.getUpdatedAt() : LocalDateTime.now())
                        .read(false)
                        .build());
            } else if (flight.getStatus() == FlightStatus.CANCELLED) {
                items.add(NotificationItem.builder()
                        .id("flight-cancelled-" + flight.getId())
                        .title("Flight Cancelled: " + flight.getFlightNumber())
                        .message("Flight " + flight.getFlightNumber() + " has been cancelled. AI rebooking advice is ready.")
                        .type("FLIGHT_CANCELLED")
                        .severity("ERROR")
                        .targetUrl("/recommendations")
                        .timestamp(flight.getUpdatedAt() != null ? flight.getUpdatedAt() : LocalDateTime.now())
                        .read(false)
                        .build());
            }
        }

        // 3. Active AI recommendations
        List<Recommendation> recommendations = recommendationRepository.findAllByUser(user);
        for (Recommendation rec : recommendations) {
            if (!rec.isAccepted()) {
                items.add(NotificationItem.builder()
                        .id("rec-" + rec.getId())
                        .title("AI Recommendation Ready")
                        .message(rec.getMessage())
                        .type("AI_RECOMMENDATION")
                        .severity("INFO")
                        .targetUrl("/recommendations")
                        .timestamp(rec.getCreatedAt() != null ? rec.getCreatedAt() : LocalDateTime.now())
                        .read(false)
                        .build());
            }
        }

        // Sort by timestamp desc
        items.sort(Comparator.comparing(NotificationItem::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())));
        return items;
    }

    @Override
    public void markAllAsRead() {
        // In-memory or client-side persisted state
    }
}
