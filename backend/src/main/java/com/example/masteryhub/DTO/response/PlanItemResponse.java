package com.example.masteryhub.DTO.response;

import lombok.Data;

@Data
public class PlanItemResponse {
    private Long itemId;
    private String topic;
    private String resourceLink;
    private boolean completed;
}
