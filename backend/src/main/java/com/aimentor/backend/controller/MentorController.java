package com.aimentor.backend.controller;

import com.aimentor.backend.ai.GeminiService;
import com.aimentor.backend.dto.AskRequest;
import com.aimentor.backend.dto.AskResponse;
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

@RestController
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
public class MentorController {

    private final GeminiService geminiService;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @PostMapping("/ask")
    public ResponseEntity<AskResponse> ask(@Valid @RequestBody AskRequest request) {
        String mode = request.getMode() != null ? request.getMode() : "concept";
        String lang = request.getLanguage() != null ? request.getLanguage() : "General";
        
        String prompt;
        if ("code".equalsIgnoreCase(mode)) {
            prompt = """
                You are an elite senior developer pairing with a student.
                Language Focus: %s
                The student asked: "%s"

                Respond STRICTLY focusing on code logic:
                1. Provide the most optimal, production-ready code snippet.
                2. Explain the time/space complexity or performance implications.
                3. Point out any potential edge cases or bugs.
                4. Keep the explanation brief, technical, and strictly focused on the algorithm/syntax.
                """.formatted(lang, request.getQuestion());
        } else {
            prompt = """
                You are a friendly, expert programming mentor.
                Language Context: %s
                A student asked: "%s"

                Respond STRICTLY focusing on theoretical concepts:
                1. A simple, jargon-free explanation.
                2. A creative real-world analogy.
                3. The underlying theory or architectural reason behind this concept.
                4. A high-level best practice tip.
                (Avoid deep code implementations; focus on helping them understand the "Why").
                """.formatted(lang, request.getQuestion());
        }

        String answer = geminiService.generate(prompt);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Message message = Message.builder()
                .user(user)
                .feature("mentor")
                .question(request.getQuestion())
                .answer(answer)
                .build();
        messageRepository.save(message);

        return ResponseEntity.ok(new AskResponse(answer));
    }

    @PostMapping("/doubt")
    public ResponseEntity<AskResponse> solveDoubt(@Valid @RequestBody AskRequest request) {
        String prompt = """
                You are an expert programming mentor specializing in helping students overcome coding doubts and errors.
                A student has the following doubt or problem: "%s"

                Respond with:
                1. A brief root cause analysis (why is this happening or confusing?)
                2. A step-by-step recommended solution or strategy
                3. A code snippet showing the fix or pattern
                4. A brief takeaway to prevent this in the future

                Keep your tone encouraging and educational.
                """.formatted(request.getQuestion());

        String answer = geminiService.generate(prompt);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Message message = Message.builder()
                .user(user)
                .feature("doubt")
                .question(request.getQuestion())
                .answer(answer)
                .build();
        messageRepository.save(message);

        return ResponseEntity.ok(new AskResponse(answer));
    }

    @GetMapping("/history")
    public ResponseEntity<List<HistoryItem>> history() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<HistoryItem> history = messageRepository
                .findByUserIdAndFeatureOrderByCreatedAtDesc(user.getId(), "mentor")
                .stream()
                .map(m -> new HistoryItem(m.getId(), m.getQuestion(), m.getAnswer(), m.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(history);
    }
}