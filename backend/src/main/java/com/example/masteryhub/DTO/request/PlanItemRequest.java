package com.example.masteryhub.DTO.request;

import lombok.Data;

@Data
public class PlanItemRequest {
    private String topic;
    private String resourceLink;
    private boolean completed;
}
