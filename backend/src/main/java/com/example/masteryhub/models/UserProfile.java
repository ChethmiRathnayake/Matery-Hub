package com.example.masteryhub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String firstName;
    private String lastName;
    private String bio;

    private String location;
    private String profilePictureUrl;

    private String bannerImageUrl;

    @ElementCollection
    @CollectionTable(name = "user_profile_interests", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "interest")
    private List<String> interests;

    @ElementCollection
    @CollectionTable(name = "user_profile_skills", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "skill")
    private List<String> skills;


    private String learningGoals;

    private int followerCount;
    private int followingCount;
    private int postCount;

    @ElementCollection
    @CollectionTable(
            name = "user_profile_social_links",
            joinColumns = @JoinColumn(name = "user_profile_id")
    )
    @MapKeyColumn(name = "platform")
    @Column(name = "url")
    private Map<String, String> socialLinks = new HashMap<>();


    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getLearningGoals() {
        return learningGoals;
    }

    public void setLearningGoals(String learningGoals) {
        this.learningGoals = learningGoals;
    }

    public int getFollowerCount() {
        return followerCount;
    }

    public void setFollowerCount(int followerCount) {
        this.followerCount = followerCount;
    }

    public int getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(int followingCount) {
        this.followingCount = followingCount;
    }

    public int getPostCount() {
        return postCount;
    }

    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }

    public Map<String, String> getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(Map<String, String> socialLinks) {
        this.socialLinks = socialLinks;
    }
}
