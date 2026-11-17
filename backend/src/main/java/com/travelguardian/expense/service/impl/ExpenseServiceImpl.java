package com.travelguardian.expense.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.security.UserPrincipal;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.expense.dto.CreateExpenseRequest;
import com.travelguardian.expense.dto.ExpenseResponse;
import com.travelguardian.expense.dto.ExpenseSummaryResponse;
import com.travelguardian.expense.dto.UpdateExpenseRequest;
import com.travelguardian.expense.entity.Expense;
import com.travelguardian.expense.repository.ExpenseRepository;
import com.travelguardian.expense.service.ExpenseService;
import com.travelguardian.trip.entity.Trip;
import com.travelguardian.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;

    @Override
    public ExpenseResponse addExpense(Long tripId, CreateExpenseRequest request) {

        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        Expense expense = Expense.builder()
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .expenseDate(request.getExpenseDate())
                .trip(trip)
                .build();

        return map(expenseRepository.save(expense));
    }

    @Override
    public List<ExpenseResponse> getExpenses(Long tripId) {

        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        return expenseRepository.findByTrip(trip)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public ExpenseResponse getExpense(Long id) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        User currentUser = getCurrentUser();

        if (!expense.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Expense not found");
        }

        return map(expense);
    }

    @Override
    public ExpenseResponse updateExpense(Long id, UpdateExpenseRequest request) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        User currentUser = getCurrentUser();

        if (!expense.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Expense not found");
        }

        if (request.getAmount() != null)
            expense.setAmount(request.getAmount());

        if (request.getCategory() != null)
            expense.setCategory(request.getCategory());

        if (request.getDescription() != null)
            expense.setDescription(request.getDescription());

        if (request.getExpenseDate() != null)
            expense.setExpenseDate(request.getExpenseDate());

        return map(expenseRepository.save(expense));
    }

    @Override
    public void deleteExpense(Long id) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        User currentUser = getCurrentUser();

        if (!expense.getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Expense not found");
        }

        expenseRepository.delete(expense);
    }

    @Override
    public ExpenseSummaryResponse getExpenseSummary(Long tripId) {

        User currentUser = getCurrentUser();

        Trip trip = tripRepository.findByIdAndUser(tripId, currentUser)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Trip not found"));

        BigDecimal totalExpense = expenseRepository.sumAmountByTrip(trip);

        BigDecimal remainingBudget =
                trip.getBudget().subtract(totalExpense);

        return ExpenseSummaryResponse.builder()
                .tripId(trip.getId())
                .tripBudget(trip.getBudget())
                .totalExpense(totalExpense)
                .remainingBudget(remainingBudget)
                .expenseCount((int) expenseRepository.countByTrip(trip))
                .build();
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserPrincipal userPrincipal =
                (UserPrincipal) authentication.getPrincipal();

        return userPrincipal.getUser();
    }

    private ExpenseResponse map(Expense expense) {

        return ExpenseResponse.builder()
                .id(expense.getId())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .expenseDate(expense.getExpenseDate())
                .tripId(expense.getTrip().getId())
                .build();
    }
}