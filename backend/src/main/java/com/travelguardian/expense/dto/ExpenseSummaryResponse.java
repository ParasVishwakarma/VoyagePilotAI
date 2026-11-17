package com.travelguardian.expense.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ExpenseSummaryResponse {

    private Long tripId;

    private BigDecimal tripBudget;

    private BigDecimal totalExpense;

    private BigDecimal remainingBudget;

    private Integer expenseCount;
}