package com.example.masteryhub.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "plan_item")
public class PlanItem {
    @Id
    @GeneratedValue
    private Long itemId;

    private String topic;
    private String resourceLink;
    private boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private LearningPlan learningPlan;
}
