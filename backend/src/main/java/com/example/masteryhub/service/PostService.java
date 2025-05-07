package com.example.masteryhub.service;

import com.example.masteryhub.DTO.response.PostResponse;
import com.example.masteryhub.models.Post;
import com.example.masteryhub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(this::mapToPostResponse).orElse(null);
    }

    public List<PostResponse> getPostsByUserId(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    public void addPost(Post post) {
        postRepository.save(post);
    }

    public void updateCaption(Long postId, String caption) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setCaption(caption);
            postRepository.save(post);
        }
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    private PostResponse mapToPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getPostId());
        response.setCaption(post.getCaption());
        response.setMediaUrl(post.getMediaUrl());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setUserId(post.getUser().getId()); // Assuming User has getId() method
        return response;
    }
}
