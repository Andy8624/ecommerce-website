package com.dlk.ecommerce.domain.response.tool;

import com.dlk.ecommerce.domain.entity.ImageTool;
import com.dlk.ecommerce.domain.entity.ProductAttributes;
import com.dlk.ecommerce.domain.entity.ProductReview;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
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
    @JsonProperty("is_active")
    boolean isActive;
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
    // Xuất xứ
    String origin;
    // Thông tin bảo hành
    String warranty;
    Double length;
    Double width;
    Double height;
    Double weight;
    List<ProductReview> productReviews;
    List<ProductAttributes> attributes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ToolOwner {
        String userId;
        String email;
        String fullName;
        List<Address> address;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Address{
            String city;
            String district;
            String ward;
            String street;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypeOfTool {
        long toolTypeId;
        String name;
    }
}