package com.example.masteryhub.service;

import com.example.masteryhub.models.Like;
import com.example.masteryhub.models.User;
import com.example.masteryhub.models.Comment;
import com.example.masteryhub.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public Like createLike(Like like) {
        return likeRepository.save(like);
    }

    public boolean hasUserLikedComment(User user, Comment comment) {
        return likeRepository.existsByUserAndComment(user, comment);
    }

    public void unlikeComment(User user, Comment comment) {
        likeRepository.deleteByUserAndComment(user, comment);
    }
}