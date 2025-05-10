package com.example.masteryhub.DTO.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Setter
@Getter
@Builder
@AllArgsConstructor@NoArgsConstructor
public class LearningPlanResponse {
    private Long planId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long userId;
    private List<PlanItemResponse> items;

    // Helper method to calculate completion percentage
    public Integer getCompletionPercentage() {
        if (items == null || items.isEmpty()) return 0;
        long completedCount = items.stream().filter(PlanItemResponse::isCompleted).count();
        return (int) ((completedCount * 100) / items.size());
    }
}
