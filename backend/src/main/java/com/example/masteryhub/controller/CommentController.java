package com.example.masteryhub.controller;

import com.example.masteryhub.models.Comment;
import com.example.masteryhub.models.Post;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;
    @PostMapping("/{postId}")

    public ResponseEntity<Comment> createComment(@PathVariable Long postId,
                                                 @RequestBody Comment comment,
                                                 @AuthenticationPrincipal User currentUser) {
        comment.setUser(currentUser);

        Post post = new Post();
        post.setId(postId);
        comment.setPost(post);

        return ResponseEntity.ok(commentService.createComment(comment));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        Post post = new Post();
        post.setId(postId); // Set the post ID manually
        return ResponseEntity.ok(commentService.getCommentsByPost(post));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long commentId,
                                                 @RequestBody Comment comment,
                                                 @AuthenticationPrincipal User currentUser) {
        comment.setId(commentId);
        comment.setUser(currentUser); // Update the user if needed
        return ResponseEntity.ok(commentService.updateComment(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}