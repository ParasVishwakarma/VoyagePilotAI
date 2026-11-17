package com.travelguardian.expense.dto;

import com.travelguardian.expense.entity.ExpenseCategory;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateExpenseRequest {

    private BigDecimal amount;

    private ExpenseCategory category;

    private String description;

    private LocalDate expenseDate;
}