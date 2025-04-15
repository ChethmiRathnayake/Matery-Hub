package com.example.masteryhub.controller;



import com.example.masteryhub.DTO.AuthCredentialRequest;
import com.example.masteryhub.DTO.RegisterRequest;
import com.example.masteryhub.Entity.User;
import com.example.masteryhub.config.JwtUtils;
import com.example.masteryhub.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registrationDto) {

        String response = userService.registerUser(registrationDto);
        if (response.equals("User registered successfully")) {

            // Auto login
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(registrationDto.getUsername(), registrationDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println(authentication);

            User user = (User) authentication.getPrincipal();

            //String jwt = jwtUtils.generateJwtToken
            user.setPassword(null);
            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            jwtUtils.generateJwtToken(user)
                    )
                    .body(user);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthCredentialRequest creds) {
        System.out.println("in the login");
        System.out.println("Username: " + creds.getUsername());
        System.out.println("Password: " + creds.getPassword());

        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getUsername(),
                            creds.getPassword()
                    )
            );

            if (auth.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(auth);

                User user = (User) auth.getPrincipal(); // Only if your User implements UserDetails

                String token = jwtUtils.generateJwtToken(user); // Works if 'user' is UserDetails

                user.setPassword(null); // Never return password

                return ResponseEntity.ok()
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                jwtUtils.generateJwtToken(user)
                        )
                        .body(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
            }

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}








