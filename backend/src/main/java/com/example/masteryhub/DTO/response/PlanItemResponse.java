package com.example.masteryhub.DTO.response;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlanItemResponse {
    private Long itemId;
    private String topic;
    private String resourceLink;
    private boolean completed;
}
