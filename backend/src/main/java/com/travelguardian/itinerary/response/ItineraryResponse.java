package com.travelguardian.itinerary.dto.response;

import com.travelguardian.itinerary.entity.ItineraryStatus;
import com.travelguardian.itinerary.entity.ItineraryType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryResponse {

    private Long id;

    private Long tripId;

    private String title;

    private ItineraryType type;

    private String description;

    private String location;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String bookingReference;

    private ItineraryStatus status;

    private Integer sequence;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}