package com.example.masteryhub.controller;

import com.example.masteryhub.DTO.response.LearningProgressUpdateResponse;
import com.example.masteryhub.models.LearningProgressUpdate;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.LearningProgressUpdateService;
import com.example.masteryhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningProgressUpdateController {

    @Autowired
    private LearningProgressUpdateService progUpdateService;
    private UserService userService;

    @GetMapping
    public List<LearningProgressUpdateResponse> getAllProgressUpdates() {
        return progUpdateService.getAllProgressUpdateDtos();
    }

    @GetMapping("/{id}")
    public LearningProgressUpdateResponse getProgressUpdate(@PathVariable Long id) {
        return progUpdateService.getProgressUpdateDto(id);
    }

    @GetMapping("/user/{userId}")
    public List<LearningProgressUpdateResponse> getByUserId(@PathVariable Long userId) {
        return progUpdateService.getProgressUpdatesByUserId(userId);
    }

    @PostMapping
    public void addProgressUpdate(@RequestBody LearningProgressUpdate progUpdate,
                                  @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader) {

        // Log the Authorization token
        if (authorizationHeader != null) {
            System.out.println("Received Authorization Token: " + authorizationHeader);
        } else {
            System.out.println("No Authorization Token provided");
        }

        // Call your service to add the progress update
        progUpdateService.addProgressUpdate(progUpdate);
        System.out.println("Progress update added successfully");
    }


    @PutMapping("/{id}")
    public void updateProgressUpdate(@PathVariable Long id, @RequestBody LearningProgressUpdate update) {
        progUpdateService.updateProgressUpdate(id, update);
    }

    @DeleteMapping("/{id}")
    public void deleteProgressUpdate(@PathVariable Long id) {
        progUpdateService.deleteProgressUpdate(id);
    }

}
