package com.aimentor.backend.repository;

import com.aimentor.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserIdAndFeatureOrderByCreatedAtDesc(Long userId, String feature);
}
