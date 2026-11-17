package com.travelguardian.hotel.dto;

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
public class HotelResponse {

    private Long id;

    private Long tripId;

    private String tripTitle;

    private String name;

    private String address;

    private LocalDateTime checkIn;

    private LocalDateTime checkOut;

    private String confirmationCode;

    private BigDecimal price;

    private String roomType;

    private String status;

    private String notes;

    private LocalDateTime createdAt;
}
