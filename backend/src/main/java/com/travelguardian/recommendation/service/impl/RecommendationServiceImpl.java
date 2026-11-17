package com.travelguardian.recommendation.service.impl;

import com.travelguardian.auth.entity.User;
import com.travelguardian.auth.repository.UserRepository;
import com.travelguardian.disruption.entity.Disruption;
import com.travelguardian.disruption.repository.DisruptionRepository;
import com.travelguardian.exception.ResourceNotFoundException;
import com.travelguardian.mail.service.EmailService;
import com.travelguardian.recommendation.dto.request.CreateRecommendationRequest;
import com.travelguardian.recommendation.dto.request.UpdateRecommendationRequest;
import com.travelguardian.recommendation.dto.response.RecommendationResponse;
import com.travelguardian.recommendation.entity.Recommendation;
import com.travelguardian.recommendation.repository.RecommendationRepository;
import com.travelguardian.recommendation.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final DisruptionRepository disruptionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public RecommendationResponse createRecommendation(CreateRecommendationRequest request) {
        Disruption disruption = disruptionRepository.findById(request.getDisruptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found"));

        User currentUser = getCurrentUser();
        if (!disruption.getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Disruption not found");
        }

        Recommendation recommendation = Recommendation.builder()
                .disruption(disruption)
                .type(request.getType())
                .message(request.getMessage())
                .accepted(false)
                .build();

        return map(recommendationRepository.save(recommendation));
    }

    @Override
    public List<RecommendationResponse> getAllRecommendations() {
        User currentUser = getCurrentUser();
        return recommendationRepository.findAllByUser(currentUser)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public RecommendationResponse getRecommendation(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));

        User currentUser = getCurrentUser();
        if (!recommendation.getDisruption().getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Recommendation not found");
        }

        return map(recommendation);
    }

    @Override
    public List<RecommendationResponse> getDisruptionRecommendations(Long disruptionId) {
        Disruption disruption = disruptionRepository.findById(disruptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found"));

        User currentUser = getCurrentUser();
        if (!disruption.getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Disruption not found");
        }

        return recommendationRepository.findByDisruption(disruption)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional
    public RecommendationResponse acceptRecommendation(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));

        User currentUser = getCurrentUser();
        if (!recommendation.getDisruption().getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Recommendation not found");
        }

        recommendation.setAccepted(true);
        return map(recommendationRepository.save(recommendation));
    }

    @Override
    @Transactional
    public RecommendationResponse rejectRecommendation(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));

        User currentUser = getCurrentUser();
        if (!recommendation.getDisruption().getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Recommendation not found");
        }

        recommendation.setAccepted(false);
        return map(recommendationRepository.save(recommendation));
    }

    @Override
    @Transactional
    public RecommendationResponse updateRecommendation(Long id, UpdateRecommendationRequest request) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));

        User currentUser = getCurrentUser();
        if (!recommendation.getDisruption().getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Recommendation not found");
        }

        if (request.getType() != null) recommendation.setType(request.getType());
        if (request.getMessage() != null) recommendation.setMessage(request.getMessage());
        if (request.getAccepted() != null) recommendation.setAccepted(request.getAccepted());

        return map(recommendationRepository.save(recommendation));
    }

    @Override
    @Transactional
    public void deleteRecommendation(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found"));

        User currentUser = getCurrentUser();
        if (!recommendation.getDisruption().getFlight().getTrip().getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Recommendation not found");
        }

        recommendationRepository.delete(recommendation);
    }

    private RecommendationResponse map(Recommendation recommendation) {
        return RecommendationResponse.builder()
                .id(recommendation.getId())
                .disruptionId(recommendation.getDisruption().getId())
                .type(recommendation.getType())
                .message(recommendation.getMessage())
                .accepted(recommendation.isAccepted())
                .createdAt(recommendation.getCreatedAt())
                .build();
    }
}
