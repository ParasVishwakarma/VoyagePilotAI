package com.travelguardian.itinerary.repository;

import com.travelguardian.auth.entity.User;
import com.travelguardian.itinerary.entity.Itinerary;
import com.travelguardian.itinerary.entity.ItineraryType;
import com.travelguardian.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {

    List<Itinerary> findByTripOrderBySequenceAsc(Trip trip);

    List<Itinerary> findByTripAndTypeOrderByStartTimeAsc(Trip trip, ItineraryType type);

    Optional<Itinerary> findByIdAndTrip(Long id, Trip trip);

    boolean existsByTrip(Trip trip);

    long countByTrip(Trip trip);

    @Query("SELECT i FROM Itinerary i WHERE i.trip.user = :user AND i.type = :type ORDER BY i.startTime ASC")
    List<Itinerary> findByUserAndType(@Param("user") User user, @Param("type") ItineraryType type);
}
