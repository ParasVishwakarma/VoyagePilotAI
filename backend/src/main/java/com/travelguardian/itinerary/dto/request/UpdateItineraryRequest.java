package com.travelguardian.itinerary.dto.request;

import com.travelguardian.itinerary.entity.ItineraryStatus;
import com.travelguardian.itinerary.entity.ItineraryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateItineraryRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotNull(message = "Type is required")
    private ItineraryType type;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @Size(max = 100, message = "Booking reference must not exceed 100 characters")
    private String bookingReference;

    @NotNull(message = "Status is required")
    private ItineraryStatus status;

    @NotNull(message = "Sequence is required")
    private Integer sequence;
}