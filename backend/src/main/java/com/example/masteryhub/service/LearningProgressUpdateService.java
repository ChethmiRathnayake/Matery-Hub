package com.example.masteryhub.service;

import com.example.masteryhub.DTO.request.LearningProgressUpdateRequest;
import com.example.masteryhub.DTO.response.LearningProgressUpdateResponse;
import com.example.masteryhub.models.LearningProgressUpdate;
import com.example.masteryhub.models.User;
import com.example.masteryhub.repository.LearningProgressUpdateRepo;
import com.example.masteryhub.repository.UserRepository;
import jakarta.transaction.Transactional;
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


    @Transactional
    public void addProgressUpdate(LearningProgressUpdateRequest req) {
        if (req.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LearningProgressUpdate update = new LearningProgressUpdate();
        update.setUser(user);
        update.setTemplateId(req.getTemplateId());
        update.setGeneratedText(req.getGeneratedText());
        update.setPlaceholders(req.getPlaceholders());
        update.setMediaUrls(req.getMediaUrls());
        update.setTags(req.getTags());

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

        // Get username by fetching the User object using userId
        dto.setUserId(entity.getUser().getId());
        dto.setUsername(entity.getUser().getUsername());  // Fetch username here
        return dto;
    }
}
