package com.example.masteryhub.DTO.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class LearningPlanRequest {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long userId;
    private List<PlanItemRequest> items;
}
