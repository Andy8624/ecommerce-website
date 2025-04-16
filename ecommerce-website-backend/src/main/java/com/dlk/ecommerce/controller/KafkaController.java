package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/kafka")
public class KafkaController {
    private final KafkaProducerService kafkaProducerService;

    @GetMapping("/send")
    public String sendMessage(@RequestParam String message) {
        kafkaProducerService.sendMessage(message);
        return "ChatMessage sent: " + message;
    }
}
