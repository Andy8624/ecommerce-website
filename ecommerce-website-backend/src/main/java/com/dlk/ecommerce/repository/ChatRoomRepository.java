package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);

    List<ChatRoom> findAllBySenderId(String userId);

    List<ChatRoom> findAllBySenderIdOrderByRecipientId(String userId);

    List<ChatRoom> findAllBySenderIdOrRecipientId(String senderId, String recipientId);}
