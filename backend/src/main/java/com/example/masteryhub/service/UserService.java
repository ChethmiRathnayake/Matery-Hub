package com.example.masteryhub.service;

import com.example.masteryhub.DTO.RegisterRequest;
import com.example.masteryhub.Entity.User;
import com.example.masteryhub.Entity.UserProfile;
import com.example.masteryhub.Repository.UserProfileRepository;
import com.example.masteryhub.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserProfileRepository userProfileRepository;
    public String registerUser(RegisterRequest request) {
        System.out.println("User received: " + request.getUsername() + " " +request.getEmail() + " "+ request.getPassword());
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email is already in use!";
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return "Username is already taken!";
        }


        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Create and save the User entity
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setUsername(request.getUsername());




        UserProfile userProfile = new UserProfile();
        userProfile.setUser(user);
        userProfile.setFirstName(request.getFirstName());
        userProfile.setLastName(request.getLastName());
        userProfile.setBio(request.getBio());
        userProfile.setProfilePictureUrl(request.getProfilePictureUrl());

        user.setUserProfile(userProfile); // 🟢 Link back

        userRepository.save(user);
        return "User registered successfully";
    }

//    public User findUserByEmail(String email){
//        return userRepository.findByEmail(email);
//    }
}
