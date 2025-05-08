package com.example.masteryhub.controller;

import com.example.masteryhub.DTO.request.LearningPlanRequest;
import com.example.masteryhub.DTO.response.LearningPlanResponse;
import com.example.masteryhub.service.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class LearningPlanController {
    private final LearningPlanService learningPlanService;

    @PostMapping
    public ResponseEntity<LearningPlanResponse> createPlan(@RequestBody LearningPlanRequest requestDTO) {
        LearningPlanResponse responseDTO = learningPlanService.createPlan(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlanResponse>> getPlansByUser(@PathVariable Long userId) {
        List<LearningPlanResponse> plans = learningPlanService.getAllPlansForUser(userId);
        return ResponseEntity.ok(plans);
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

}
