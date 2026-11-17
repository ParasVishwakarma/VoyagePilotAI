package com.travelguardian.dashboard.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.dashboard.dto.DashboardResponse;
import com.travelguardian.dashboard.service.DashboardService;
import com.travelguardian.disruption.dto.response.DisruptionResponse;
import com.travelguardian.disruption.entity.Disruption;
import com.travelguardian.disruption.repository.DisruptionRepository;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.expense.entity.Expense;
import com.travelguardian.expense.repository.ExpenseRepository;
import com.travelguardian.flight.dto.response.FlightResponse;
import com.travelguardian.flight.entity.Flight;
import com.travelguardian.flight.entity.FlightStatus;
import com.travelguardian.flight.repository.FlightRepository;
import com.travelguardian.trip.dto.TripResponse;
import com.travelguardian.trip.entity.Trip;
import com.travelguardian.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final FlightRepository flightRepository;
    private final DisruptionRepository disruptionRepository;
    private final ExpenseRepository expenseRepository;

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
    public DashboardResponse getDashboardData() {
        User user = getAuthenticatedUser();

        // 1. Trips
        List<Trip> allTrips = tripRepository.findAllByUser(
                user,
                PageRequest.of(0, 100, Sort.by("startDate").ascending())
        ).getContent();

        long totalTrips = allTrips.size();

        BigDecimal totalBudget = allTrips.stream()
                .map(t -> t.getBudget() != null ? t.getBudget() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Upcoming trips (start date today or future)
        LocalDate today = LocalDate.now();
        List<TripResponse> upcomingTrips = allTrips.stream()
                .filter(t -> t.getEndDate() != null && !t.getEndDate().isBefore(today))
                .limit(5)
                .map(this::mapTrip)
                .toList();

        // 2. Flights
        List<Flight> allFlights = flightRepository.findByTripUser(user);
        long totalFlights = allFlights.size();

        long onTimeCount = allFlights.stream()
                .filter(f -> f.getStatus() == FlightStatus.ON_TIME || f.getStatus() == FlightStatus.SCHEDULED || f.getStatus() == FlightStatus.BOARDING)
                .count();

        long delayedCount = allFlights.stream()
                .filter(f -> f.getStatus() == FlightStatus.DELAYED)
                .count();

        long cancelledCount = allFlights.stream()
                .filter(f -> f.getStatus() == FlightStatus.CANCELLED)
                .count();

        List<FlightResponse> recentFlights = allFlights.stream()
                .limit(5)
                .map(this::mapFlight)
                .toList();

        // 3. Disruptions / Alerts
        List<Disruption> activeDisruptions = disruptionRepository.findActiveByUser(user);
        long activeAlerts = activeDisruptions.size();

        List<DisruptionResponse> recentAlerts = activeDisruptions.stream()
                .limit(5)
                .map(this::mapDisruption)
                .toList();

        // 4. Expenses
        BigDecimal totalExpenses = BigDecimal.ZERO;
        for (Trip trip : allTrips) {
            List<Expense> expenses = expenseRepository.findByTrip(trip);
            for (Expense exp : expenses) {
                if (exp.getAmount() != null) {
                    totalExpenses = totalExpenses.add(exp.getAmount());
                }
            }
        }

        return DashboardResponse.builder()
                .userName(user.getFirstName())
                .userEmail(user.getEmail())
                .totalTrips(totalTrips)
                .totalFlights(totalFlights)
                .activeAlerts(activeAlerts)
                .totalBudget(totalBudget)
                .totalExpenses(totalExpenses)
                .onTimeFlights(onTimeCount)
                .delayedFlights(delayedCount)
                .cancelledFlights(cancelledCount)
                .upcomingTrips(upcomingTrips)
                .recentFlights(recentFlights)
                .recentAlerts(recentAlerts)
                .build();
    }

    private TripResponse mapTrip(Trip trip) {
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

    private FlightResponse mapFlight(Flight flight) {
        return FlightResponse.builder()
                .id(flight.getId())
                .tripId(flight.getTrip().getId())
                .airline(flight.getAirline())
                .flightNumber(flight.getFlightNumber())
                .departureAirport(flight.getDepartureAirport())
                .arrivalAirport(flight.getArrivalAirport())
                .departureTerminal(flight.getDepartureTerminal())
                .arrivalTerminal(flight.getArrivalTerminal())
                .departureGate(flight.getDepartureGate())
                .arrivalGate(flight.getArrivalGate())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .status(flight.getStatus())
                .createdAt(flight.getCreatedAt())
                .updatedAt(flight.getUpdatedAt())
                .build();
    }

    private DisruptionResponse mapDisruption(Disruption disruption) {
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
