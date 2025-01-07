package com.dlk.ct466.domain.response.tool;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResToolDTO {
    long toolId;
    String name;
    String description;
    BigDecimal discountedPrice;
    int stockQuantity;
    String imageUrl;
    BigDecimal price;
    boolean isActive = true;
    ToolOwner user;
    TypeOfTool toolType;
    Instant createdAt;
    String createdBy;
    Instant updatedAt;
    String updatedBy;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ToolOwner {
        String userId;
        String email;
        String fullName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypeOfTool {
        long toolTypeId;
        String name;
    }
}
