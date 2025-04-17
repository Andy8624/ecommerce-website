package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.ChatMessage;
import com.dlk.ecommerce.domain.entity.ChatNotification;
import com.dlk.ecommerce.service.ChatMessageService;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    // Xử lí tin nhắn được gửi đến với đường dẫn /app/chat
    @MessageMapping("/chat")
    public void processMessage(
            @Payload ChatMessage chatMessage
    ) {
        // Lưu vô DB
        ChatMessage saveMsg = chatMessageService.save(chatMessage);

        // Gửi tin nhắn đến đường dẫn /user/{recipientId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), // Id người nhận
                "/queue/messages",            // Đường dẫn đích
                ChatNotification.builder()    // Nội dung tin nhắn
                        .id(saveMsg.getId())
                        .senderId(saveMsg.getSenderId())
                        .recipientId(saveMsg.getRecipientId())
                        .content(saveMsg.getContent())
                        .build()
        );
    }

    // Lấy LS tin nhắn
    @GetMapping("/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(
            @PathVariable String senderId,
            @PathVariable String recipientId
    ) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

    // Lấy liên hệ mà người dùng đã chat
    @GetMapping("/contacts/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserContacts(@PathVariable String userId) throws IdInvalidException {
        return ResponseEntity.ok(chatMessageService.findUserContacts(userId));
    }
}
