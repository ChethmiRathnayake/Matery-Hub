package com.example.masteryhub.service;

import com.example.masteryhub.DTO.response.LearningProgressUpdateResponse;
import com.example.masteryhub.models.LearningProgressUpdate;
import com.example.masteryhub.models.User;
import com.example.masteryhub.repository.LearningProgressUpdateRepo;
import com.example.masteryhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningProgressUpdateService {

    private final UserRepository userRepository;
    private final LearningProgressUpdateRepo progUpdateRepo;

    public List<LearningProgressUpdateResponse> getAllProgressUpdateDtos() {
        return progUpdateRepo.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LearningProgressUpdateResponse getProgressUpdateDto(Long id) {
        LearningProgressUpdate update = progUpdateRepo.findById(id).orElse(new LearningProgressUpdate());
        return toDto(update);
    }

    public List<LearningProgressUpdateResponse> getProgressUpdatesByUserId(Long userId) {
        return progUpdateRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void addProgressUpdate(LearningProgressUpdate update) {
        if (update.getUser() == null) {
            System.out.println("User is null in the LearningProgressUpdate object.");
            throw new IllegalArgumentException("User must not be null");
        }

        Long userId = update.getUser().getId();
        System.out.println("User ID: " + userId);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        update.setUser(user);

        progUpdateRepo.save(update);
    }


    public void updateProgressUpdate(Long id, LearningProgressUpdate updated) {
        LearningProgressUpdate existing = progUpdateRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        existing.setTemplateId(updated.getTemplateId());
        existing.setGeneratedText(updated.getGeneratedText());
        existing.setPlaceholders(updated.getPlaceholders());
        existing.setMediaUrls(updated.getMediaUrls());
        existing.setTags(updated.getTags());
        progUpdateRepo.save(existing);
    }

    public void deleteProgressUpdate(Long id) {
        progUpdateRepo.deleteById(id);
    }

    private LearningProgressUpdateResponse toDto(LearningProgressUpdate entity) {
        LearningProgressUpdateResponse dto = new LearningProgressUpdateResponse();
        dto.setId(entity.getProgressId());
        dto.setTemplateId(entity.getTemplateId());
        dto.setGeneratedText(entity.getGeneratedText());
        dto.setPlaceholders(entity.getPlaceholders());
        dto.setMediaUrls(entity.getMediaUrls());
        dto.setTags(entity.getTags());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setUserId(entity.getUser().getId());
        return dto;
    }
}
