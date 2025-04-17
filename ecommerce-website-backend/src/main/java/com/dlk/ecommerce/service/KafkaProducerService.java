package com.dlk.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String message) {
        kafkaTemplate.send("test-topic", message);
    }

    public void sendUserInteraction(String userId, String productId, String action) {
        String message = String.format("{\"userId\": \"%s\", \"productId\": \"%s\", \"action\": \"%s\"}", userId, productId, action);
        kafkaTemplate.send("user_interactions", message);
    }
}
