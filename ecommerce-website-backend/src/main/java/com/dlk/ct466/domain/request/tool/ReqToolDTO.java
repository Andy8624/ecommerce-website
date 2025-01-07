package com.dlk.ct466.domain.request.tool;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
public class ReqToolDTO {
    @NotNull(message = "Tool name must not be null")
    String name;
    String description;

    @NotNull(message = "Tool stock quantity must not be null")
    int stockQuantity;
    String imageUrl;

    @NotNull(message = "Price must not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 0, message = "Invalid format for price")
    BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discounted price must be greater equal than 0")
    @Digits(integer = 10, fraction = 0, message = "Invalid format for discounted price")
    BigDecimal discountedPrice;

    boolean isActive = true;

    @NotNull(message = "User must not be null")
    ToolOwner user;

    @NotNull(message = "Tool Type must not be null")
    TypeOfTool toolType;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ToolOwner {
        @NotNull(message = "User ID must not be null")
        String userId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypeOfTool {
        @NotNull(message = "Type ID must not be null")
        long toolTypeId;
    }
}
