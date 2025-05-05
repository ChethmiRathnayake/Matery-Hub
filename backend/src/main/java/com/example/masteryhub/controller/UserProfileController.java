package com.example.masteryhub.controller;


import com.example.masteryhub.DTO.request.UserProfileRequest;
import com.example.masteryhub.hateoas.UserProfileHateoasHelper;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.hateoas.EntityModel;
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
    public EntityModel<UserProfileRequest> getMyProfile(Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        Long userId = userDetails.getId();
        UserProfileRequest profile = service.getProfileByUserId(userId);

        // Add HATEOAS links using the helper method
        return UserProfileHateoasHelper.addLinksToMyProfile(profile);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileRequest> getById(@PathVariable Long id) {
        return service.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/me")
    public ResponseEntity<UserProfileRequest> update( @Valid @RequestBody UserProfileRequest dto,Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        Long id = userDetails.getId();
        try {
            return ResponseEntity.ok(service.updateProfile(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> delete(Authentication authentication) {
        User userDetails = (User) authentication.getPrincipal();
        Long id = userDetails.getId();
        service.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}
