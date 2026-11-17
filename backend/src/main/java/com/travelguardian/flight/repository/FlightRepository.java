package com.travelguardian.flight.repository;

import com.travelguardian.auth.entity.User;
import com.travelguardian.flight.entity.Flight;
import com.travelguardian.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    List<Flight> findByTrip(Trip trip);

    Optional<Flight> findByIdAndTrip(Long id, Trip trip);

    boolean existsByTrip(Trip trip);

    long countByTrip(Trip trip);

    @Query("SELECT f FROM Flight f WHERE f.trip.user = :user ORDER BY f.departureTime ASC")
    List<Flight> findByTripUser(@Param("user") User user);

    @Query("SELECT COUNT(f) FROM Flight f WHERE f.trip.user = :user")
    long countByTripUser(@Param("user") User user);
}
