package com.example.masteryhub.service;

import com.example.masteryhub.DTO.request.ChangePasswordRequest;
import com.example.masteryhub.DTO.request.RegisterRequest;
import com.example.masteryhub.models.*;
import com.example.masteryhub.repository.PasswordResetTokenRepository;
import com.example.masteryhub.repository.RoleRepository;
import com.example.masteryhub.repository.UserProfileRepository;
import com.example.masteryhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    public String registerUser(RegisterRequest request) {
        System.out.println(request);
        System.out.println("User received: " + request.getUsername() + " " +request.getEmail() + " "+ request.getPassword() + " " +request.getRole());
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

        Set<String> strRoles = request.getRole();
        Set<Role>  roles= new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }


        user.setRoles(roles);

        UserProfile userProfile = new UserProfile();
        userProfile.setUser(user);
        userProfile.setFirstName(request.getFirstName());
        userProfile.setLastName(request.getLastName());
        userProfile.setBio(request.getBio());
        userProfile.setProfilePictureUrl(request.getProfilePictureUrl());
        System.out.println(userProfile.getBio());
        user.setUserProfile(userProfile);
        System.out.println(userProfile);
        userRepository.save(user);
        return "User registered successfully";
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public String generateResetTokenAndSendEmail(String email, boolean forceResend) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Optional<PasswordResetToken> existingToken = passwordResetTokenRepository.findByUser(user);
        if (existingToken.isPresent()) {
            PasswordResetToken token = existingToken.get();
            if (!forceResend && token.getExpiryDate().isAfter(LocalDateTime.now())) {
                return "A password reset request is already in progress. Please check your email for the reset link.";
            } else {
                passwordResetTokenRepository.delete(token);
            }
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return "If the email exists, a reset link will be sent.";
    }

    public User updateUser(Long userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if new username is taken by someone else
        if (!existingUser.getUsername().equals(updatedUser.getUsername()) &&
                userRepository.existsByUsername(updatedUser.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Check if new email is taken by someone else
        if (!existingUser.getEmail().equals(updatedUser.getEmail()) &&
                userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        String newUsername=updatedUser.getUsername();
        String newEmail=updatedUser.getEmail();

        if(newUsername != null){
            existingUser.setUsername(updatedUser.getUsername());
        }

        if (newEmail != null){
            existingUser.setEmail(updatedUser.getEmail());
        }


        return userRepository.save(existingUser);
    }


    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token."));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            return "Token has expired. Please request a new one.";
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Clean up token after successful password reset
        passwordResetTokenRepository.delete(resetToken);

        return "Password reset successful!";
    }





}
