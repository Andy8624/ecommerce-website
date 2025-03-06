package com.dlk.ecommerce.domain.request.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestMessage {
    private String userIdFrom;
    private String userIdTo;
    private String text;
    private Instant createdAt;
}

