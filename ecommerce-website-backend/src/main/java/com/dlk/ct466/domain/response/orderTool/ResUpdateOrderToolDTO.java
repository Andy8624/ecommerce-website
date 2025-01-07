package com.dlk.ct466.domain.response.orderTool;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResUpdateOrderToolDTO {
    String orderToolId;
    int quantity;
    ToolInOrderTool tool;
    OrderInOrderTool order;
    Instant updatedAt;
    String updatedBy;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ToolInOrderTool {
        long toolId;
        String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderInOrderTool {
        String orderId;
        BigDecimal shippingCost;
    }
}
