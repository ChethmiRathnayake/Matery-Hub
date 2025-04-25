package com.example.masteryhub.controller;

import com.example.masteryhub.DTO.PostResponse;
import com.example.masteryhub.models.Post;
import com.example.masteryhub.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/posts")
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public PostResponse getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<PostResponse> getPostsByUser(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }

    @PostMapping
    public void createPost(@RequestBody Post post) {
        postService.addPost(post);
    }

    @PutMapping("/{id}/caption")
    public void updateCaption(@PathVariable Long id, @RequestBody String caption) {
        postService.updateCaption(id, caption);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }
}
