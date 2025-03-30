package com.dlk.ecommerce.domain.response.tool;

import com.dlk.ecommerce.domain.entity.ImageTool;
import com.dlk.ecommerce.domain.entity.ProductAttributes;
import com.dlk.ecommerce.domain.entity.ProductReview;
import com.dlk.ecommerce.domain.request.category.ProductCategoryDetailRequest;
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
    String origin;
    String warranty;

    Double length;
    Double width;
    Double height;
    Double weight;

    List<ProductReview> productReviews;
    List<ProductAttributes> attributes;

    // ✅ Danh sách biến thể sản phẩm
    List<ProductVariantDTO> variants;

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
        public static class Address {
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

    // ✅ DTO cho biến thể sản phẩm (ProductVariant)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductVariantDTO {
        String variantId;
        BigDecimal price;
        int stockQuantity;
        List<VariantDetailDTO> attributes; // Danh sách thuộc tính của biến thể
    }

    // ✅ DTO cho chi tiết thuộc tính của biến thể (VariantDetail)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantDetailDTO {
        String variantDetailId;
        String categoryDetailId;
        String categoryName;  // Ví dụ: "Màu sắc", "Kích thước"
        String attributeValue; // Ví dụ: "Đỏ", "Xanh", "Nhỏ", "Lớn"
    }

    // ✅ Thêm DTO mới cho category
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDTO {
        String categoryId;
        String categoryName;
    }

    // ✅ Thêm DTO mới cho categoryDetail
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDetailDTO {
        String categoryDetailId;
        String categoryDetailName;
    }
}
