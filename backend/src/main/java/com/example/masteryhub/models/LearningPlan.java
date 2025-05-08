package com.example.masteryhub.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "learning_plan")
public class LearningPlan {
    @Id
    @GeneratedValue
    private Long planId;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    @OneToMany(mappedBy = "learningPlan", cascade = CascadeType.ALL)
    private List<PlanItem> planItems;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
