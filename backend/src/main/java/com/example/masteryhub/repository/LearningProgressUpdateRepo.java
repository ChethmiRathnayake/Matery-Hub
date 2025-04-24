package com.example.masteryhub.repository;

import com.example.masteryhub.models.LearningProgressUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressUpdateRepo extends JpaRepository<LearningProgressUpdate, Long> {
    @Query("SELECT l FROM LearningProgressUpdate l WHERE l.user.id = :userId ORDER BY l.createdAt DESC")
    List<LearningProgressUpdate> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    List<LearningProgressUpdate> findAll();
}
