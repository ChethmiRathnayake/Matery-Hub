package com.example.masteryhub.controller;


import com.example.masteryhub.DTO.request.UserProfileRequest;
import com.example.masteryhub.hateoas.UserProfileHateoasHelper;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.FileUploadService;
import com.example.masteryhub.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {

    private final UserProfileService service;

    @Autowired
    private FileUploadService fileUploadService;

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
        System.out.println("inside update profile");
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

    @PostMapping("/me/profile-picture")
    public ResponseEntity<?> uploadProfilePicture(Authentication authentication,
                                                  @RequestParam("file") MultipartFile file) {
        System.out.println("inside post");

        try {
            System.out.println("inside post");
            User userDetails = (User) authentication.getPrincipal();
            Long userId = userDetails.getId();
            // Upload the profile picture and get the file name
            String fileName = fileUploadService.uploadFile(file);

            // Update the user's profile with the new profile picture URL (relative path)
            UserProfileRequest updatedProfile = service.updateProfilePicture(userId, fileName);

            return ResponseEntity.ok(updatedProfile);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file");
        }
    }

    @PostMapping("/me/banner-image")
    public ResponseEntity<?> uploadBannerImage(Authentication authentication,
                                               @RequestParam("file") MultipartFile file) {
        System.out.println("inside post");
        try {
            User userDetails = (User) authentication.getPrincipal();
            Long userId = userDetails.getId();
            // Upload the banner image and get the file name
            String fileName = fileUploadService.uploadFile(file);

            // Update the user's profile with the new banner image URL (relative path)
            UserProfileRequest updatedProfile = service.updateBannerImage(userId, fileName);

            return ResponseEntity.ok(updatedProfile);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file");
        }
    }

    @DeleteMapping("/banner-image/me")
    public ResponseEntity<?> deleteBannerImage(Authentication authentication) {
        try {
            User userDetails = (User) authentication.getPrincipal();
            Long userId = userDetails.getId();
            // Upload the banner image and get the file name


            // Update the user's profile with the new banner image URL (relative path)
            UserProfileRequest deletedProfile = service.deleteBannerImage(userId);

            return ResponseEntity.ok(deletedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting banner image ");
        }
    }


    @DeleteMapping("/profile-picture/me")
    public ResponseEntity<?> deleteProfilePicture(Authentication authentication) {

        User userDetails = (User) authentication.getPrincipal();
        Long userId = userDetails.getId();

        service.deleteProfilePicture(userId);

        return ResponseEntity.ok().body("Profile picture deleted successfully");
    }


}
