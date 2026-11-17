package com.travelguardian.trip.repository;

import com.travelguardian.auth.entity.User;
import com.travelguardian.trip.entity.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    Page<Trip> findAllByUser(User user, Pageable pageable);

    Optional<Trip> findByIdAndUser(Long id, User user);
}