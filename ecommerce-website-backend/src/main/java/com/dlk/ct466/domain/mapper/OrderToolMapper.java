package com.dlk.ct466.domain.mapper;

import com.dlk.ct466.domain.entity.OrderTool;
import com.dlk.ct466.domain.response.orderTool.ResCreateOrderToolDTO;
import com.dlk.ct466.domain.response.orderTool.ResOrderToolDTO;
import com.dlk.ct466.domain.response.orderTool.ResUpdateOrderToolDTO;
import org.springframework.stereotype.Component;

@Component
public class OrderToolMapper {

    public static ResCreateOrderToolDTO mapToCreateOrderToolDTO(OrderTool orderTool) {
        ResCreateOrderToolDTO.ToolInOrderTool tool = new ResCreateOrderToolDTO.ToolInOrderTool();
        tool.setToolId(orderTool.getTool().getToolId());
        tool.setName(orderTool.getTool().getName());

        ResCreateOrderToolDTO.OrderInOrderTool order = new ResCreateOrderToolDTO.OrderInOrderTool();
        order.setOrderId(orderTool.getOrder().getOrderId());
        order.setShippingCost(orderTool.getOrder().getShippingCost());

        return ResCreateOrderToolDTO.builder()
                .orderToolId(orderTool.getOrderToolId())
                .quantity(orderTool.getQuantity())
                .tool(tool)
                .order(order)
                .createdAt(orderTool.getCreatedAt())
                .createdBy(orderTool.getCreatedBy())
                .build();
    }

    public static ResUpdateOrderToolDTO mapToUpdateOrderToolDTO(OrderTool orderTool) {
        ResUpdateOrderToolDTO.ToolInOrderTool tool = new ResUpdateOrderToolDTO.ToolInOrderTool();
        tool.setToolId(orderTool.getTool().getToolId());
        tool.setName(orderTool.getTool().getName());

        ResUpdateOrderToolDTO.OrderInOrderTool order = new ResUpdateOrderToolDTO.OrderInOrderTool();
        order.setOrderId(orderTool.getOrder().getOrderId());
        order.setShippingCost(orderTool.getOrder().getShippingCost());

        return ResUpdateOrderToolDTO.builder()
                .orderToolId(orderTool.getOrderToolId())
                .quantity(orderTool.getQuantity())
                .tool(tool)
                .order(order)
                .updatedAt(orderTool.getUpdatedAt())
                .updatedBy(orderTool.getUpdatedBy())
                .build();
    }

    public static ResOrderToolDTO mapToOrderToolDTO(OrderTool orderTool) {
        ResOrderToolDTO.ToolInOrderTool tool = new ResOrderToolDTO.ToolInOrderTool();
        tool.setToolId(orderTool.getTool().getToolId());
        tool.setName(orderTool.getTool().getName());
        tool.setPrice(orderTool.getTool().getPrice());
        tool.setDiscountedPrice(orderTool.getTool().getDiscountedPrice());
        tool.setDescription(orderTool.getTool().getDescription());
        tool.setImageUrl(orderTool.getTool().getImageUrl());
        tool.setStockQuantity(orderTool.getTool().getStockQuantity());


        ResOrderToolDTO.OrderInOrderTool order = new ResOrderToolDTO.OrderInOrderTool();
        order.setOrderId(orderTool.getOrder().getOrderId());
        order.setShippingCost(orderTool.getOrder().getShippingCost());
        order.setStatus(orderTool.getOrder().getStatus());
        order.setPaymentMethod(orderTool.getOrder().getPaymentMethod());
        order.setUser(orderTool.getOrder().getUser());
        order.setAddress(orderTool.getOrder().getAddress());

        return ResOrderToolDTO.builder()
                .orderToolId(orderTool.getOrderToolId())
                .quantity(orderTool.getQuantity())
                .tool(tool)
                .order(order)
                .createdAt(orderTool.getCreatedAt())
                .createdBy(orderTool.getCreatedBy())
                .updatedAt(orderTool.getUpdatedAt())
                .updatedBy(orderTool.getUpdatedBy())
                .build();
    }
}
