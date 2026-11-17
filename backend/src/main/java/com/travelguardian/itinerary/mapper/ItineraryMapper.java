package com.travelguardian.itinerary.mapper;

import com.travelguardian.itinerary.dto.request.CreateItineraryRequest;
import com.travelguardian.itinerary.dto.request.UpdateItineraryRequest;
import com.travelguardian.itinerary.dto.response.ItineraryResponse;
import com.travelguardian.itinerary.entity.Itinerary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ItineraryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Itinerary toEntity(CreateItineraryRequest request);

    @Mapping(target = "tripId", source = "trip.id")
    ItineraryResponse toResponse(Itinerary itinerary);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UpdateItineraryRequest request,
                      @MappingTarget Itinerary itinerary);
}