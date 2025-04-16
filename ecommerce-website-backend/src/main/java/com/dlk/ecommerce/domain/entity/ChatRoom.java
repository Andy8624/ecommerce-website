package com.dlk.ecommerce.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "chat_rooms")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String chatId;
    String senderId;
    String recipientId;
}
