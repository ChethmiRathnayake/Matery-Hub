package com.example.masteryhub.controller;


import com.example.masteryhub.DTO.request.UserProfileRequest;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserProfileRequest> getAll() {
        return service.getAllProfiles();
    }


    @GetMapping("/me")
    public UserProfileRequest getMyProfile(Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        Long userId = userDetails.getId();
        return service.getProfileByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileRequest> getById(@PathVariable Long id) {
        return service.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<UserProfileRequest> update(@PathVariable Long id, @Valid @RequestBody UserProfileRequest dto) {
        try {
            return ResponseEntity.ok(service.updateProfile(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}
