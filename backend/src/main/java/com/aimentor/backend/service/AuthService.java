package com.aimentor.backend.service;

import com.aimentor.backend.dto.*;
import com.aimentor.backend.entity.User;
import com.aimentor.backend.repository.UserRepository;
import com.aimentor.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getStreakCount());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        LocalDate today = LocalDate.now();
        if (user.getLastActiveDate() != null) {
            if (user.getLastActiveDate().equals(today.minusDays(1))) {
                user.setStreakCount(user.getStreakCount() + 1);
            } else if (user.getLastActiveDate().isBefore(today.minusDays(1))) {
                user.setStreakCount(1);
            }
        } else {
            user.setStreakCount(1);
        }
        user.setLastActiveDate(today);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getStreakCount());
    }
}