package com.example.masteryhub.controller;

import com.example.masteryhub.models.User;
import com.example.masteryhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class UserController {

    @Autowired
    private UserRepository userRepo;

    // CREATE
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepo.save(user);
    }

    // READ ALL
    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE


    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepo.findById(id)
                .map(user -> {
                    userRepo.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
