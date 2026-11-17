package com.travelguardian.expense.controller;

import com.travelguardian.expense.dto.CreateExpenseRequest;
import com.travelguardian.expense.dto.ExpenseResponse;
import com.travelguardian.expense.dto.ExpenseSummaryResponse;
import com.travelguardian.expense.dto.UpdateExpenseRequest;
import com.travelguardian.expense.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping("/api/trips/{tripId}/expenses")
    public ResponseEntity<ExpenseResponse> addExpense(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.addExpense(tripId, request)
        );
    }

    @GetMapping("/api/trips/{tripId}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getExpenses(
            @PathVariable Long tripId) {

        return ResponseEntity.ok(
                expenseService.getExpenses(tripId)
        );
    }

    @GetMapping("/api/trips/{tripId}/expenses/summary")
    public ResponseEntity<ExpenseSummaryResponse> getSummary(
            @PathVariable Long tripId) {

        return ResponseEntity.ok(
                expenseService.getExpenseSummary(tripId)
        );
    }

    @GetMapping("/api/expenses/{id}")
    public ResponseEntity<ExpenseResponse> getExpense(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                expenseService.getExpense(id)
        );
    }

    @PutMapping("/api/expenses/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @RequestBody UpdateExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.updateExpense(id, request)
        );
    }

    @DeleteMapping("/api/expenses/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.ok("Expense deleted successfully.");
    }
}