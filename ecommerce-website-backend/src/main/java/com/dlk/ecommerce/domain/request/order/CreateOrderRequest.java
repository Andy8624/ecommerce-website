package com.dlk.ecommerce.domain.request.order;

import com.dlk.ecommerce.domain.entity.*;
import com.dlk.ecommerce.domain.request.orderTool.OrderToolRequest;
import com.dlk.ecommerce.util.constant.OrderStatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequest {
        String orderId;
        BigDecimal shippingCost;
        BigDecimal totalToolCost;
        OrderStatusEnum status;
        User user;
        String cartId;
        String shopId;
        PaymentMethod paymentMethod;
        Address address;
//        OrderToolRequest orderTools;
        List<OrderToolRequest> orderTools;
}
