package com.travelguardian.expense.service;

import com.travelguardian.expense.dto.CreateExpenseRequest;
import com.travelguardian.expense.dto.ExpenseResponse;
import com.travelguardian.expense.dto.ExpenseSummaryResponse;
import com.travelguardian.expense.dto.UpdateExpenseRequest;

import java.util.List;

public interface ExpenseService {

    ExpenseResponse addExpense(Long tripId, CreateExpenseRequest request);

    List<ExpenseResponse> getExpenses(Long tripId);

    ExpenseResponse getExpense(Long id);

    ExpenseResponse updateExpense(Long id, UpdateExpenseRequest request);

    void deleteExpense(Long id);

    ExpenseSummaryResponse getExpenseSummary(Long tripId);
}