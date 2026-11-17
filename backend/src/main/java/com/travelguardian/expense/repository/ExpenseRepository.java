package com.travelguardian.expense.repository;

import com.travelguardian.expense.entity.Expense;
import com.travelguardian.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByTrip(Trip trip);

    long countByTrip(Trip trip);

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.trip = :trip
            """)
    BigDecimal sumAmountByTrip(Trip trip);
}