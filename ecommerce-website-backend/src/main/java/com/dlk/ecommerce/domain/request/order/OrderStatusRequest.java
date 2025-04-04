package com.dlk.ecommerce.domain.request.order;

import com.dlk.ecommerce.util.constant.OrderStatusEnum;
import lombok.Data;

@Data
public class OrderStatusRequest {
    private OrderStatusEnum status;
}
