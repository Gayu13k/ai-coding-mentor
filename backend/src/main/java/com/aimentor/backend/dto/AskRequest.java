package com.aimentor.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AskRequest {
    @NotBlank
    private String question;
    
    private String mode;
    private String language;
}