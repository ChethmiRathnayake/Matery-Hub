package com.example.masteryhub.controller;

import com.example.masteryhub.models.ERole;
import com.example.masteryhub.models.User;
import com.example.masteryhub.repository.RoleRepository;
import com.example.masteryhub.repository.UserRepository;
import com.example.masteryhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class AdminController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepository;


    @Autowired
    private UserService userService;


    // READ ALL
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        Optional<User> user = userRepo.findById(id);

        if (user.isPresent()) {
            User existingUser = user.get();
            if (!existingUser.isEnabled()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("User is already deactivated.");
            }
            existingUser.setEnabled(false);
            userRepo.save(existingUser);
            return ResponseEntity.ok("User deactivated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }
    }

    @PutMapping("/users/reactivate/{id}")
    public ResponseEntity<String> reactivateUser(@PathVariable Long id) {
        Optional<User> user = userRepo.findById(id);

        if (user.isPresent()) {
            User existingUser = user.get();
            if (!existingUser.isEnabled()) {
                existingUser.setEnabled(true);
                userRepo.save(existingUser);  // Save the updated user
                return ResponseEntity.ok("User reactivated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("User is already active.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }
    }


    // Change User Role
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> changeUserRole(@PathVariable Long id, @RequestBody Set<ERole> roles) {
        // Fetch the user by id
        var userOpt = userRepo.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Clear existing roles
        user.getRoles().clear();

        // Assign new roles
        for (ERole role : roles) {
            roleRepository.findByName(role)
                    .ifPresent(roleEntity -> user.getRoles().add(roleEntity));
        }

        // Save the updated user entity
        userRepo.save(user);

        return ResponseEntity.ok("User roles updated successfully.");
    }


    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepo.findById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }
}