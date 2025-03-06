package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Message;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.repository.MessageRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;

    public List<Message> getMessagesBetweenUsers(String userId1, String userId2) {
        return messageRepository.findMessagesBetweenUsers(userId1, userId2);
    }

    public Message saveMessage(String userIdFrom, String userIdTo, String text) throws IdInvalidException {
        User sender = userService.fetchUserById(userIdFrom);
        User receiver = userService.fetchUserById(userIdTo);
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(text);
        message.setIsRead(false);
        return messageRepository.save(message);
    }
}