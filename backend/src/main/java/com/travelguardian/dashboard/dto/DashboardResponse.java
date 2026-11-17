package com.travelguardian.dashboard.dto;

import com.travelguardian.disruption.dto.response.DisruptionResponse;
import com.travelguardian.flight.dto.response.FlightResponse;
import com.travelguardian.trip.dto.TripResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private String userName;
    private String userEmail;

    private Long totalTrips;
    private Long totalFlights;
    private Long activeAlerts;

    private BigDecimal totalBudget;
    private BigDecimal totalExpenses;

    private Long onTimeFlights;
    private Long delayedFlights;
    private Long cancelledFlights;

    private List<TripResponse> upcomingTrips;
    private List<FlightResponse> recentFlights;
    private List<DisruptionResponse> recentAlerts;
}
