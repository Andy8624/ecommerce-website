package com.dlk.ecommerce.domain.response.tool;

import com.dlk.ecommerce.domain.entity.ImageTool;
import com.dlk.ecommerce.domain.entity.ProductReview;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

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
    List<ImageTool> imageTools;
    Double averageRating;
    int totalRating;
    String brand;
    List<ProductReview> productReviews;

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
