package com.travelguardian.disruption.controller;

import com.travelguardian.disruption.dto.request.CreateDisruptionRequest;
import com.travelguardian.disruption.dto.request.UpdateDisruptionRequest;
import com.travelguardian.disruption.dto.response.DisruptionResponse;
import com.travelguardian.disruption.service.DisruptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disruptions")
@RequiredArgsConstructor
public class DisruptionController {

    private final DisruptionService disruptionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DisruptionResponse createDisruption(
            @Valid @RequestBody CreateDisruptionRequest request) {

        return disruptionService.createDisruption(request);
    }

    @GetMapping
    public List<DisruptionResponse> getAllDisruptions() {

        return disruptionService.getAllDisruptions();
    }

    @GetMapping("/{id}")
    public DisruptionResponse getDisruption(
            @PathVariable Long id) {

        return disruptionService.getDisruption(id);
    }

    @GetMapping("/flight/{flightId}")
    public List<DisruptionResponse> getFlightDisruptions(
            @PathVariable Long flightId) {

        return disruptionService.getFlightDisruptions(flightId);
    }

    @PutMapping("/{id}")
    public DisruptionResponse updateDisruption(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDisruptionRequest request) {

        return disruptionService.updateDisruption(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDisruption(
            @PathVariable Long id) {

        disruptionService.deleteDisruption(id);
    }
}