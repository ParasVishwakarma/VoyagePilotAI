package com.travelguardian.hotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHotelRequest {

    @NotBlank(message = "Hotel name is required")
    private String name;

    @NotBlank(message = "Hotel address or location is required")
    private String address;

    @NotNull(message = "Check-in date & time is required")
    private LocalDateTime checkIn;

    @NotNull(message = "Check-out date & time is required")
    private LocalDateTime checkOut;

    private String confirmationCode;

    private BigDecimal price;

    private String roomType;

    private String status; // CONFIRMED, PLANNED, CANCELLED

    private String notes;
}
