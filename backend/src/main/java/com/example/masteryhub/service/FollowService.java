package com.example.masteryhub.service;

import com.example.masteryhub.models.Follow;
import com.example.masteryhub.models.User;
import com.example.masteryhub.repository.FollowRepository;
import com.example.masteryhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    // Follow a user
    public void followUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the follower is already following the user
        if (followRepository.existsByFollowerAndFollowed(follower, followed)) {
            throw new RuntimeException("You are already following this user");
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowed(followed);

        followRepository.save(follow);
    }

    // Unfollow a user
    public void unfollowUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Follow follow = followRepository.findByFollowerAndFollowed(follower, followed)
                .orElseThrow(() -> new RuntimeException("You are not following this user"));

        followRepository.delete(follow);
    }

    // List all followers
    public Set<User> getFollowers(Long userId) {
        return followRepository.findFollowersByFollowedId(userId);
    }

    // List all following users
    public Set<User> getFollowing(Long userId) {
        return followRepository.findFollowingByFollowerId(userId);
    }
}
