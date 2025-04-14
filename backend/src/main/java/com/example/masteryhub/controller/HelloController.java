package com.example.masteryhub.controller;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")  // Allow React frontend
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/home")
    public String hello() {
        return "hello this is me";
    }
}
