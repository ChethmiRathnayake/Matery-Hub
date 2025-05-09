package com.example.masteryhub.DTO.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor@NoArgsConstructor
public class LearningPlanResponse {
    private Long planId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long userId;
    private List<PlanItemResponse> items;
}
