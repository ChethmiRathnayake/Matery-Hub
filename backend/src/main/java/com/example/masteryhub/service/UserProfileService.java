package com.example.masteryhub.service;

import com.example.masteryhub.DTO.request.UserProfileRequest;
import com.example.masteryhub.models.User;
import com.example.masteryhub.models.UserProfile;
import com.example.masteryhub.repository.UserProfileRepository;
import com.example.masteryhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Map;
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

    // Get all profiles
    public List<UserProfileRequest> getAllProfiles() {
        return profileRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get a profile by ID
    public Optional<UserProfileRequest> getProfileById(Long id) {
        return profileRepo.findById(id).map(this::convertToDTO);
    }

    // Get profile by user ID
    public UserProfileRequest getProfileByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return convertToDTO(profile);
    }

    // Update profile
    public UserProfileRequest updateProfile(Long userId, UserProfileRequest dto) {
        System.out.println("in the update profile");

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("UserProfile not found"));

        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setBio(dto.getBio());
        profile.setLocation(dto.getLocation());
        profile.setProfilePictureUrl(dto.getProfilePictureUrl());
        profile.setBannerImageUrl(dto.getBannerImageUrl());
        profile.setInterests(dto.getInterests());
        profile.setSkills(dto.getSkills());
        profile.setLearningGoals(dto.getLearningGoals());
        profile.setSocialLinks(dto.getSocialLinks());

        return convertToDTO(profileRepo.save(profile));
    }


    // Delete profile
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
        dto.setBannerImageUrl(entity.getBannerImageUrl());
        dto.setInterests(entity.getInterests());
        dto.setSkills(entity.getSkills());
        dto.setLearningGoals(entity.getLearningGoals());
        dto.setSocialLinks(entity.getSocialLinks());

        return dto;
    }

    // Additional functions if needed:

    // Get profiles by interests (useful for discovering users with common interests)
//    public List<UserProfileRequest> getProfilesByInterest(String interest) {
//        return profileRepo.findByInterestsContaining(interest).stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    // Get profiles by skills (to connect users with similar skill sets)
//    public List<UserProfileRequest> getProfilesBySkill(String skill) {
//        return profileRepo.findBySkillsContaining(skill).stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }

    public UserProfileRequest updateProfilePicture(Long userId, String fileName) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Store the relative path for the image (e.g., "uploads/images/UUID-profile.jpg")
        profile.setProfilePictureUrl("/uploads/" + fileName);

        profileRepo.save(profile);

        return convertToDTO(profile);
    }

    public UserProfileRequest updateBannerImage(Long userId, String fileName) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Store the relative path for the image (e.g., "uploads/images/UUID-banner.jpg")
        profile.setBannerImageUrl("/uploads/" + fileName);

        profileRepo.save(profile);

        return convertToDTO(profile);
    }
    // In UserProfileService

    public void deleteProfilePicture(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String filePath = profile.getProfilePictureUrl().replace("/uploads/", "");
        File file = new File("uploads/images/" + filePath);
        if (file.exists()) {
            file.delete();  // Delete the file
        }

        profile.setProfilePictureUrl(null);  // Update the database to remove the image reference
        profileRepo.save(profile);
    }
    public UserProfileRequest deleteBannerImage(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setBannerImageUrl(null); // Set the banner image to null (remove)

        profileRepo.save(profile);

        return convertToDTO(profile);
    }


}
