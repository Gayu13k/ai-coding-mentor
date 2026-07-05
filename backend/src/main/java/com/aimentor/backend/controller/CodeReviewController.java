package com.aimentor.backend.controller;

import com.aimentor.backend.ai.GeminiService;
import com.aimentor.backend.dto.AskResponse;
import com.aimentor.backend.dto.CodeReviewRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class CodeReviewController {

    private final GeminiService geminiService;

    @PostMapping("/analyze")
    public ResponseEntity<AskResponse> analyze(@Valid @RequestBody CodeReviewRequest request) {
        String prompt = """
                You are a senior software engineer reviewing code.
                Language: %s

                Code:
                %s

                Return a structured review with:
                1. Code Quality score out of 100
                2. Strengths (bullet points)
                3. Issues (bullet points)
                4. Time Complexity
                5. Suggested improvements
                6. Improved version of the code
                """.formatted(
                        request.getLanguage() != null ? request.getLanguage() : "unspecified",
                        request.getCode()
                );

        String answer = geminiService.generate(prompt);
        return ResponseEntity.ok(new AskResponse(answer));
    }
}