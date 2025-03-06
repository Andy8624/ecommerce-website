package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.Message;
import com.dlk.ecommerce.domain.request.websocket.RequestMessage;
import com.dlk.ecommerce.service.MessageService;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/private-message")
    public void sendToUser(@Payload RequestMessage messageDTO) throws IdInvalidException {
        Message savedMessage = messageService.saveMessage(messageDTO.getUserIdFrom(), messageDTO.getUserIdTo(), messageDTO.getText());

        messagingTemplate.convertAndSendToUser(
                messageDTO.getUserIdTo(), "/queue/private",
                new RequestMessage(savedMessage.getSender().getUserId(),
                        savedMessage.getReceiver().getUserId(),
                        savedMessage.getText(),
                        savedMessage.getCreatedAt())
        );
    }
}