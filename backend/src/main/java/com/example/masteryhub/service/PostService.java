package com.example.masteryhub.service;

import com.example.masteryhub.DTO.response.PostResponse;
import com.example.masteryhub.models.Post;
import com.example.masteryhub.models.User;
import com.example.masteryhub.repository.PostRepository;
import com.example.masteryhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id) {
        return postRepository.findById(id)
                .map(this::mapToPostResponse)
                .orElse(null);
    }

    public List<PostResponse> getPostsByUserId(Long userId) {
        return postRepository.findByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponse createPost(String caption, MultipartFile image, String username, String fileName) {
        System.out.println("came innnn");
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setCaption(caption);
        post.setUser(user);

        if (image != null && !image.isEmpty()) {
            try {

//                String filePath = post.getMediaUrl().replace("/uploads/", "");
//                System.out.println(filePath);
//                File file = new File("uploads/posts/" + filePath);


                post.setMediaUrl("/uploads/" + fileName);

            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost);
    }

    @Transactional
    public void updateCaption(Long postId, String caption) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setCaption(caption);
        postRepository.save(post);
    }

    @Transactional
    public void deletePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        postRepository.deleteById(postId);
    }

    private PostResponse mapToPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getPostId());
        response.setCaption(post.getCaption());
        response.setMediaUrl(post.getMediaUrl());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setUserId(post.getUser().getId());
        return response;
    }

    // TODO: Implement this method to save to cloud or file system
    private String saveImageAndReturnUrl(MultipartFile image) throws IOException {
        return "http://your-storage.com/" + image.getOriginalFilename();
    }
}
