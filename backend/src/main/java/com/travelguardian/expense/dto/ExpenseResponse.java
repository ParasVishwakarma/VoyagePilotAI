package com.travelguardian.expense.dto;

import com.travelguardian.expense.entity.ExpenseCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ExpenseResponse {

    private Long id;

    private BigDecimal amount;

    private ExpenseCategory category;

    private String description;

    private LocalDate expenseDate;

    private Long tripId;
}