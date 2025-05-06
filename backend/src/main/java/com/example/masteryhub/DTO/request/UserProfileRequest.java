package com.example.masteryhub.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;

public class UserProfileRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;

    @Size(max = 255, message = "Bio must be less than 255 characters")
    private String bio;

    private String location;

    private String profilePictureUrl;
    private String bannerImageUrl;

    private List<String> interests;
    private List<String> skills;
    private String learningGoals;

    private Map<String, String> socialLinks;

    // Getters & Setters

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getLearningGoals() { return learningGoals; }
    public void setLearningGoals(String learningGoals) { this.learningGoals = learningGoals; }

    public Map<String, String> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(Map<String, String> socialLinks) { this.socialLinks = socialLinks; }
}
