package com.dlk.ecommerce.domain.response.recommendation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private String userId;
    private Long toolId;
    private Integer rating;
    private String comment;
    private Instant createdAt;
    private Instant updatedAt;
}
