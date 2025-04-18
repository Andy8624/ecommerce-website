package com.dlk.ecommerce.domain.response.orderTool;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.entity.PaymentMethod;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.util.constant.OrderStatusEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResOrderToolDTO {
    String orderToolId;
    int quantity;
    ToolInOrderTool tool;
    OrderInOrderTool order;
    Instant createdAt;
    String createdBy;
    Instant updatedAt;
    String updatedBy;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ToolInOrderTool {
        long toolId;
        String name;
        BigDecimal price;
        BigDecimal discountedPrice;
        String description;
        String imageUrl;
        int stockQuantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderInOrderTool {
        String orderId;
        BigDecimal shippingCost;
        OrderStatusEnum status;
        PaymentMethod paymentMethod;
        User user;
        Address address;
    }
}
