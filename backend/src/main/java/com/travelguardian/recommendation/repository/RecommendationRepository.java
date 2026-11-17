package com.travelguardian.recommendation.repository;

import com.travelguardian.auth.entity.User;
import com.travelguardian.disruption.entity.Disruption;
import com.travelguardian.recommendation.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByDisruption(Disruption disruption);

    List<Recommendation> findByAccepted(boolean accepted);

    @Query("""
        SELECT r
        FROM Recommendation r
        JOIN FETCH r.disruption d
        JOIN FETCH d.flight f
        JOIN FETCH f.trip t
        WHERE t.user = :user
        ORDER BY r.createdAt DESC
    """)
    List<Recommendation> findAllByUser(@Param("user") User user);
}
