package com.example.masteryhub.controller;

import com.example.masteryhub.DTO.LearningProgressUpdateResponse;
import com.example.masteryhub.models.LearningProgressUpdate;
import com.example.masteryhub.models.User;
import com.example.masteryhub.service.LearningProgressUpdateService;
import com.example.masteryhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
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
    public void addProgressUpdate(@RequestBody LearningProgressUpdate progUpdate) {
        progUpdateService.addProgressUpdate(progUpdate);
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
