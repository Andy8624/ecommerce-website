package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.ChatMessage;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByChatId(String s);

    Optional<ChatMessage> findFirstByChatIdOrderByTimestampDesc(String chatId);
}
