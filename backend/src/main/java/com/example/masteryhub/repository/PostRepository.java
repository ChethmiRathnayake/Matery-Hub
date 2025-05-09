package com.example.masteryhub.repository;

import com.example.masteryhub.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser_IdOrderByCreatedAtDesc(Long userId);
    Optional<Post> findById(Long postId);
}
