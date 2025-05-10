package com.example.masteryhub.DTO.request;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;
@Data
public class PostRequest {
    private String caption;
    private Long userId;
}