package com.example.masteryhub.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class LearningProgressUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String templateId;
    @Column(columnDefinition = "TEXT")
    private String generatedText;

    @ElementCollection
    @CollectionTable(name = "update_placeholders", joinColumns = @JoinColumn(name = "update_id"))
    @MapKeyColumn(name = "placeholder_key")
    @Column(name = "placeholder_value")
    private Map<String, String> placeholders;

    @ElementCollection
    private List<String> mediaUrls;

    @ElementCollection
    private List<String> tags;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
