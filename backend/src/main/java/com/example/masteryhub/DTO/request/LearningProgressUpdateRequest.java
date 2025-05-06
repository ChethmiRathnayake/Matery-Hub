package com.example.masteryhub.DTO.request;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class LearningProgressUpdateRequest {
    private Long progressId; // ID of the update to modify
    private Map<String, String> placeholders;
    private List<String> mediaUrls;
    private List<String> tags;
    private String generatedText; // Optionally allow updating generated text (if needed)
}
