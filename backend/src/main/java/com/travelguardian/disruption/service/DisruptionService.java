package com.travelguardian.disruption.service;

import com.travelguardian.disruption.dto.request.CreateDisruptionRequest;
import com.travelguardian.disruption.dto.request.UpdateDisruptionRequest;
import com.travelguardian.disruption.dto.response.DisruptionResponse;

import java.util.List;

public interface DisruptionService {

    DisruptionResponse createDisruption(CreateDisruptionRequest request);

    DisruptionResponse updateDisruption(Long id,
                                        UpdateDisruptionRequest request);

    void deleteDisruption(Long id);

    DisruptionResponse getDisruption(Long id);

    List<DisruptionResponse> getAllDisruptions();

    List<DisruptionResponse> getFlightDisruptions(Long flightId);
}