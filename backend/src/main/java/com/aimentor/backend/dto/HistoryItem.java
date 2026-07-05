package com.aimentor.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class HistoryItem {
    private Long id;
    private String question;
    private String answer;
    private LocalDateTime createdAt;
}
