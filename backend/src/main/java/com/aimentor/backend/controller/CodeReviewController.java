package com.aimentor.backend.controller;

import com.aimentor.backend.ai.GeminiService;
import com.aimentor.backend.dto.AskResponse;
import com.aimentor.backend.dto.CodeReviewRequest;
import com.aimentor.backend.dto.HistoryItem;
import com.aimentor.backend.entity.Message;
import com.aimentor.backend.entity.User;
import com.aimentor.backend.repository.MessageRepository;
import com.aimentor.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class CodeReviewController {

    private final GeminiService geminiService;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@Valid @RequestBody CodeReviewRequest request) {
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

        String answer;
        try {
            answer = geminiService.generate(prompt);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new AskResponse("⚠️ AI service unavailable: " + e.getMessage()));
        }

        // Save to history
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            messageRepository.save(Message.builder()
                    .user(userOpt.get())
                    .feature("review")
                    .question(request.getCode())
                    .answer(answer)
                    .build());
        }

        return ResponseEntity.ok(new AskResponse(answer));
    }

    @GetMapping("/history")
    public ResponseEntity<?> history() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) return ResponseEntity.ok(List.of());

        List<HistoryItem> history = messageRepository
                .findByUserIdAndFeatureOrderByCreatedAtDesc(userOpt.get().getId(), "review")
                .stream()
                .map(m -> new HistoryItem(m.getId(), m.getQuestion(), m.getAnswer(), m.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(history);
    }
}