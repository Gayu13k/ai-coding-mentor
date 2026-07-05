package com.aimentor.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CodeReviewRequest {
    @NotBlank
    private String code;

    private String language; // optional, e.g. "Java", "Python"
}