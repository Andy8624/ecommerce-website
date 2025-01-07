package com.dlk.ct466.domain.request.orderTool;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReqOrderToolDTO {
    @NotNull(message = "Quantity must not be null")
    @DecimalMin(value = "1", message = "Quantity must be greater than or equal to 1")
    private Integer quantity;

    @NotNull(message = "Tool must not be null")
    private ToolInOrderTool tool;

    @NotNull(message = "Order must not be null")
    private OrderInOrderTool order;

    @Data
    public static class ToolInOrderTool {
        @NotNull(message = "Tool ID must not be null")
        private Long toolId;
    }

    @Data
    public static class OrderInOrderTool {
        @NotNull(message = "Order ID must not be null")
        private String orderId;
    }
}
