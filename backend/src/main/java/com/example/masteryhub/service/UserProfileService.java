package com.example.masteryhub.service;

import com.example.masteryhub.DTO.request.UserProfileRequest;

import com.example.masteryhub.models.User;
import com.example.masteryhub.models.UserProfile;

import com.example.masteryhub.repository.UserProfileRepository;
import com.example.masteryhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository profileRepo;
    @Autowired
    private UserRepository userRepo;

    public UserProfileService(UserProfileRepository profileRepo, UserRepository userRepo) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }

    public List<UserProfileRequest> getAllProfiles() {
        return profileRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserProfileRequest> getProfileById(Long id) {
        return profileRepo.findById(id).map(this::convertToDTO);
    }

    public UserProfileRequest getProfileByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return convertToDTO(profile);
    }

    public UserProfileRequest updateProfile(Long id, UserProfileRequest dto) {
        return profileRepo.findById(id).map(profile -> {
            profile.setFirstName(dto.getFirstName());
            profile.setLastName(dto.getLastName());
            profile.setBio(dto.getBio());
            profile.setLocation(dto.getLocation());
            profile.setProfilePictureUrl(dto.getProfilePictureUrl());
            return convertToDTO(profileRepo.save(profile));
        }).orElseThrow(() -> new RuntimeException("UserProfile not found"));
    }

    public void deleteProfile(Long id) {
        profileRepo.deleteById(id);
    }

    // Manual mapping methods
    private UserProfileRequest convertToDTO(UserProfile entity) {
        UserProfileRequest dto = new UserProfileRequest();

        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setBio(entity.getBio());
        dto.setLocation(entity.getLocation());
        dto.setProfilePictureUrl(entity.getProfilePictureUrl());

        return dto;
    }


}
