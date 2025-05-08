package com.example.masteryhub.repository;

import com.example.masteryhub.models.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LearningPlanRepo extends JpaRepository<LearningPlan, Long> {
    List<LearningPlan> findByUser_Id(Long id);
}
