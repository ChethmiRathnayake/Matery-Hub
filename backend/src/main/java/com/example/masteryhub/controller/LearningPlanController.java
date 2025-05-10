package com.example.masteryhub.controller;

import com.example.masteryhub.DTO.request.LearningPlanRequest;
import com.example.masteryhub.DTO.response.LearningPlanResponse;
import com.example.masteryhub.DTO.response.PlanItemResponse;
import com.example.masteryhub.service.LearningPlanService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class LearningPlanController {
    private final LearningPlanService learningPlanService;

    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody LearningPlanRequest requestDTO) {
        try {
            LearningPlanResponse responseDTO = learningPlanService.createPlan(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("Failed to create learning plan"));
        }
    }

    // Add this inner class
    @Data
    @AllArgsConstructor
    private static class ErrorResponse {
        private String message;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlanResponse>> getPlansByUser(@PathVariable Long userId) {
        List<LearningPlanResponse> plans = learningPlanService.getAllPlansForUser(userId);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{planId}")
    public ResponseEntity<LearningPlanResponse> getPlanById(@PathVariable Long planId) {
        LearningPlanResponse plan = learningPlanService.getPlanById(planId);
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanResponse> updatePlan(
            @PathVariable Long id,
            @RequestBody LearningPlanRequest requestDTO) {
        return ResponseEntity.ok(learningPlanService.updatePlan(id, requestDTO));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        learningPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{planId}/items/{itemId}")
    public ResponseEntity<PlanItemResponse> updateItemStatus(
            @PathVariable Long planId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Boolean> statusUpdate) {

        if (!statusUpdate.containsKey("completed")) {
            return ResponseEntity.badRequest().build();
        }

        boolean completed = statusUpdate.get("completed");
        PlanItemResponse updatedItem = learningPlanService.updateItemStatus(planId, itemId, completed);

        return ResponseEntity.ok(updatedItem);
    }

    @GetMapping("/test")
    public String test() {
        return "Works!";
    }

}
