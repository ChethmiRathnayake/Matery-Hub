package com.example.masteryhub.DTO.request;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class CreateLearningProgressRequest {
    private Long userId;
    private String templateId;
    private Map<String, String> placeholders;
    private List<String> mediaUrls;
    private List<String> tags;
}
