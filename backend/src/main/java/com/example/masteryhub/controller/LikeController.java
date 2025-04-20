package com.example.masteryhub.controller;

import com.example.masteryhub.models.Comment;
import com.example.masteryhub.models.Like;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/{commentId}")
    public ResponseEntity<Like> createLike(@PathVariable Long commentId,
                                           @AuthenticationPrincipal User currentUser) {
        Comment comment = new Comment();
        comment.setId(commentId); // Set the comment ID manually
        if (likeService.hasUserLikedComment(currentUser, comment)) {
            return ResponseEntity.badRequest().body(null); // User already liked the comment
        }
        Like like = new Like();
        like.setUser(currentUser);
        like.setComment(comment);
        return ResponseEntity.ok(likeService.createLike(like));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long commentId,
                                              @AuthenticationPrincipal User currentUser) {
        Comment comment = new Comment();
        comment.setId(commentId); // Set the comment ID manually
        likeService.unlikeComment(currentUser, comment);
        return ResponseEntity.noContent().build();
    }
}