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

        if (dto.getFirstName() != null && !dto.getFirstName().equals(profile.getFirstName())) {
            profile.setFirstName(dto.getFirstName());
        }

        if (dto.getLastName() != null && !dto.getLastName().equals(profile.getLastName())) {
            profile.setLastName(dto.getLastName());
        }

        if (dto.getBio() != null && !dto.getBio().equals(profile.getBio())) {
            profile.setBio(dto.getBio());
        }

        if (dto.getLocation() != null && !dto.getLocation().equals(profile.getLocation())) {
            profile.setLocation(dto.getLocation());
        }

        if (dto.getProfilePictureUrl() != null && !dto.getProfilePictureUrl().equals(profile.getProfilePictureUrl())) {
            profile.setProfilePictureUrl(dto.getProfilePictureUrl());
        }

        if (dto.getBannerImageUrl() != null && !dto.getBannerImageUrl().equals(profile.getBannerImageUrl())) {
            profile.setBannerImageUrl(dto.getBannerImageUrl());
        }

        if (dto.getInterests() != null && !dto.getInterests().equals(profile.getInterests())) {
            profile.setInterests(dto.getInterests());
        }

        if (dto.getSkills() != null && !dto.getSkills().equals(profile.getSkills())) {
            profile.setSkills(dto.getSkills());
        }

        if (dto.getLearningGoals() != null && !dto.getLearningGoals().equals(profile.getLearningGoals())) {
            profile.setLearningGoals(dto.getLearningGoals());
        }

        if (dto.getSocialLinks() != null && !dto.getSocialLinks().equals(profile.getSocialLinks())) {
            profile.setSocialLinks(dto.getSocialLinks());
        }

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

        String prof = profile.getProfilePictureUrl();
        System.out.println(prof);
        System.out.println("Insideprofileservice");

        if(prof != null) {
            String filePath = profile.getProfilePictureUrl().replace("/uploads/", "");
            File file = new File("uploads/images/" + filePath);
            if (file.exists()) {
                file.delete();  // Delete the file
            }
        }
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

        String prof = profile.getBannerImageUrl();
       System.out.println(prof);
        if(prof != null) {

            String filePath = profile.getBannerImageUrl().replace("/uploads/", "");
            System.out.println(filePath);
            File file = new File("uploads/images/" + filePath);
            if (file.exists()) {
                System.out.println("in");
                file.delete();  // Delete the file
            }
        }
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

        String prof = profile.getProfilePictureUrl();

        if(prof != null) {
            String filePath = profile.getProfilePictureUrl().replace("/uploads/", "");
            File file = new File("uploads/images/" + filePath);
            if (file.exists()) {
                file.delete();  // Delete the file
            }
        }

        profile.setProfilePictureUrl(null);  // Update the database to remove the image reference
        profileRepo.save(profile);

    }
    public UserProfileRequest deleteBannerImage(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String filePath = profile.getBannerImageUrl().replace("/uploads/", "");
        File file = new File("uploads/images/" + filePath);
        if (file.exists()) {
            file.delete();  // Delete the file
        }

        profile.setBannerImageUrl(null); // Set the banner image to null (remove)

        profileRepo.save(profile);

        return convertToDTO(profile);
    }


}
