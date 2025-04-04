package com.dlk.ecommerce.domain.response.orderTool;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResCreateOrderToolDTO {
    String orderToolId;
    int quantity;
    ToolInOrderTool tool;
    OrderInOrderTool order;
    Instant createdAt;
    String createdBy;

    String name;
    BigDecimal price;
    Integer stock;

    String variantDetailId1;
    String product_variant_id_1;
    String category_detail_id_1;
    String category_name_1;
    String category_detail_name_1;

    String variantDetailId2;
    String product_variant_id_2;
    String category_detail_id_2;
    String category_name_2;
    String category_detail_name_2;


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
