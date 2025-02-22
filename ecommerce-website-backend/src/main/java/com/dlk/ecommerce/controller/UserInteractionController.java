package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user-interaction")
public class UserInteractionController {
    private final KafkaProducerService kafkaProducerService;

    @PostMapping("/click")
    public String userClickedProduct(@RequestParam String userId, @RequestParam String productId) {
        kafkaProducerService.sendUserInteraction(userId, productId, "click");
        return "User click event sent!";
    }

    @PostMapping("/view")
    public String userViewedProduct(@RequestParam String userId, @RequestParam String productId) {
        kafkaProducerService.sendUserInteraction(userId, productId, "view");
        return "User view event sent!";
    }

    @PostMapping("/purchase")
    public String userPurchasedProduct(@RequestParam String userId, @RequestParam String productId) {
        kafkaProducerService.sendUserInteraction(userId, productId, "purchase");
        return "User purchase event sent!";
    }
}
