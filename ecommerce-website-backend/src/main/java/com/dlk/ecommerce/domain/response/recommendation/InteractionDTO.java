package com.dlk.ecommerce.domain.response.recommendation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InteractionDTO {
    private String userId;
    private Long toolId;
    private String interactionType;
    private Instant createdAt;
    private Instant updatedAt;
}
