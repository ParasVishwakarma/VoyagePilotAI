package com.travelguardian.disruption.repository;

import com.travelguardian.auth.entity.User;
import com.travelguardian.disruption.entity.Disruption;
import com.travelguardian.flight.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DisruptionRepository extends JpaRepository<Disruption, Long> {

    List<Disruption> findByFlight(Flight flight);

    List<Disruption> findByResolvedFalse();

    List<Disruption> findByResolved(boolean resolved);

    @Query("""
        SELECT d
        FROM Disruption d
        JOIN FETCH d.flight f
        JOIN FETCH f.trip t
        JOIN FETCH t.user
        WHERE d.id = :id
    """)
    Optional<Disruption> findByIdWithTrip(@Param("id") Long id);

    @Query("""
        SELECT d
        FROM Disruption d
        JOIN FETCH d.flight f
        JOIN FETCH f.trip t
        WHERE t.user = :user
        ORDER BY d.detectedAt DESC
    """)
    List<Disruption> findAllByUser(@Param("user") User user);

    @Query("""
        SELECT d
        FROM Disruption d
        JOIN FETCH d.flight f
        JOIN FETCH f.trip t
        WHERE t.user = :user AND d.resolved = false
        ORDER BY d.detectedAt DESC
    """)
    List<Disruption> findActiveByUser(@Param("user") User user);

    @Query("""
        SELECT COUNT(d)
        FROM Disruption d
        JOIN d.flight f
        JOIN f.trip t
        WHERE t.user = :user AND d.resolved = false
    """)
    long countActiveByUser(@Param("user") User user);
}
