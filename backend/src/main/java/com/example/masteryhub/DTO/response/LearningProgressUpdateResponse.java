package com.example.masteryhub.DTO.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class LearningProgressUpdateResponse {
    private Long id;
    private Long userId;
    private String username;  // Add this field
    private String templateId;
    private String generatedText;
    private Map<String, String> placeholders;
    private List<String> mediaUrls;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
