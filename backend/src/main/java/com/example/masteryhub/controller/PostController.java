package com.example.masteryhub.controller;

import com.example.masteryhub.DTO.request.CaptionUpdateRequest;
import com.example.masteryhub.DTO.request.UserProfileRequest;
import com.example.masteryhub.DTO.response.PostResponse;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.FileUploadService;
import com.example.masteryhub.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @Autowired
    private FileUploadService fileUploadService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        PostResponse post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getPostsByUser(@PathVariable Long userId) {
        List<PostResponse> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(

            @RequestParam("caption") String caption,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();

            // Upload the profile picture and get the file name
            String fileName = fileUploadService.uploadPostFile(image);

            // Update the user's profile with the new profile picture URL (relative path)
            PostResponse createdPost = postService.createPost(caption, image, username,fileName);

            System.out.println("postss");
            return ResponseEntity.ok(createdPost);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new PostResponse());
        }
    }

    @PutMapping("/{id}/caption")
    public ResponseEntity<Void> updateCaption(@PathVariable Long id, @RequestBody CaptionUpdateRequest request) {
        postService.updateCaption(id, request.getCaption());
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
