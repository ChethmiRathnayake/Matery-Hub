package com.example.masteryhub.repository;

import com.example.masteryhub.models.PlanItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanItemRepository extends JpaRepository<PlanItem, Long> {

}
