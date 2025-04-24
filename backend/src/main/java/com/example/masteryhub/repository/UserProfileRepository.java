package com.example.masteryhub.repository;

import com.example.masteryhub.models.User;
import com.example.masteryhub.models.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    // 🔍 Find profile by associated User ID
    Optional<UserProfile> findByUserId(Long userId);

    Optional<UserProfile> findByUser(User user);

    // 🔍 Find all profiles by location
    List<UserProfile> findByLocation(String location);

    // 🔍 Search by first or last name containing part of the name (case-insensitive)
    List<UserProfile> findByFirstNameIgnoreCaseContainingOrLastNameIgnoreCaseContaining(String firstName, String lastName);

    // 🔍 Find profiles with non-null bios
    List<UserProfile> findByBioIsNotNull();

    // 🔍 Find all profiles with a profile picture
    List<UserProfile> findByProfilePictureUrlIsNotNull();

    // 🔍 Optional: Delete by user ID
    void deleteByUserId(Long userId);
}