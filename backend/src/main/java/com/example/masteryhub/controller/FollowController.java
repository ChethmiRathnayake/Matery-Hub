package com.example.masteryhub.controller;

import com.example.masteryhub.models.User;
import com.example.masteryhub.service.FollowService;
import com.example.masteryhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserService userService;

    // Follow a user
    @PostMapping("/{followerId}/{followedId}")
    public void followUser(@PathVariable Long followerId, @PathVariable Long followedId) {
        followService.followUser(followerId, followedId);
    }

    // Unfollow a user
    @DeleteMapping("/{followerId}/{followedId}")
    public void unfollowUser(@PathVariable Long followerId, @PathVariable Long followedId) {
        followService.unfollowUser(followerId, followedId);
    }

    // Get all followers
    @GetMapping("/followers/{userId}")
    public Set<User> getFollowers(@PathVariable Long userId) {
        return followService.getFollowers(userId);
    }

    // Get all following users
    @GetMapping("/following/{userId}")
    public Set<User> getFollowing(@PathVariable Long userId) {
        return followService.getFollowing(userId);
    }

    @GetMapping("/stats/{id}")
    public Map<String, Long> getUserStats(@PathVariable Long id) {
        User user = userService.getUserById(id);
        Map<String, Long> stats = new HashMap<>();
        stats.put("followersCount", user.getFollowersCount());
        stats.put("followingCount", user.getFollowingCount());
        return stats;
    }
}
