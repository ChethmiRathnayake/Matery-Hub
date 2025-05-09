package com.example.masteryhub.DTO.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String caption;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
}