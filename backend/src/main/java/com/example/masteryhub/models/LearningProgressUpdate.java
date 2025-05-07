package com.example.masteryhub.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "learning_progress_updates")
public class LearningProgressUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String templateId;

    @Column(columnDefinition = "TEXT")
    private String generatedText; // Optional: store the final generated message

    @ElementCollection
    @CollectionTable(name = "update_placeholders", joinColumns = @JoinColumn(name = "progress_id"))
    @MapKeyColumn(name = "placeholder_key")
    @Column(name = "placeholder_value", columnDefinition = "TEXT")
    private Map<String, String> placeholders;

    @ElementCollection
    @CollectionTable(name = "update_media_urls", joinColumns = @JoinColumn(name = "progress_id"))
    @Column(name = "media_url")
    private List<String> mediaUrls = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "update_tags", joinColumns = @JoinColumn(name = "progress_id"))
    @Column(name = "tag")
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
