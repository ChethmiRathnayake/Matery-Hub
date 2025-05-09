package com.example.masteryhub.controller;

import com.example.masteryhub.DTO.request.LearningProgressUpdateRequest;
import com.example.masteryhub.DTO.response.LearningProgressUpdateResponse;
import com.example.masteryhub.models.LearningProgressUpdate;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.LearningProgressUpdateService;
import com.example.masteryhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private LearningProgressUpdateRequest request;

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
    public ResponseEntity<?> addProgressUpdate(@RequestBody LearningProgressUpdateRequest request) {
        try {
            if (request == null || request.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            progUpdateService.addProgressUpdate(request);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public void updateProgressUpdate(@PathVariable Long id, @RequestBody LearningProgressUpdate update) {
        progUpdateService.updateProgressUpdate(id, update);
    }

    @DeleteMapping("/{id}")
    public void deleteProgressUpdate(@PathVariable Long id) {
        progUpdateService.deleteProgressUpdate(id);
    }

    @GetMapping("/test")
    public String test() {
        return "Works!";
    }

}
