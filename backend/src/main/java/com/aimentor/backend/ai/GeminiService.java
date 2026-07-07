package com.aimentor.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    private final ObjectMapper mapper = new ObjectMapper();

    public String generate(String prompt) {

        String url = "/v1beta/models/" + model + ":generateContent?key=" + apiKey;

        // ===== DEBUG LOGS =====
        System.out.println("========================================");
        System.out.println("Gemini Debug");
        System.out.println("Model  : " + model);
        System.out.println("URL    : " + url);
        System.out.println("Prompt : " + prompt);

        if (apiKey != null && apiKey.length() > 10) {
            System.out.println("API Key: " + apiKey.substring(0, 10) + "...");
        } else {
            System.out.println("API Key is missing!");
        }
        System.out.println("========================================");

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                },
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "topP", 0.9,
                        "maxOutputTokens", 2048
                )
        );

        try {

            String response = webClient.post()
                    .uri(url)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Gemini Response:");
            System.out.println(response);

            JsonNode root = mapper.readTree(response);

            JsonNode candidates = root.path("candidates");

            if (candidates.isMissingNode() || candidates.isEmpty()) {
                throw new RuntimeException("No candidates returned from Gemini.\nResponse:\n" + response);
            }

            return candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {

            System.err.println("========== GEMINI ERROR ==========");
            e.printStackTrace();
            System.err.println("==================================");

            throw new RuntimeException("Gemini API call failed", e);
        }
    }
}