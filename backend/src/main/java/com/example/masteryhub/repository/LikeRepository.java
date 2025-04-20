package com.example.masteryhub.repository;

import com.example.masteryhub.models.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndComment(com.example.masteryhub.models.User user, com.example.masteryhub.models.Comment comment);
    boolean existsByUserAndComment(com.example.masteryhub.models.User user, com.example.masteryhub.models.Comment comment);
    void deleteByUserAndComment(com.example.masteryhub.models.User user, com.example.masteryhub.models.Comment comment);
}