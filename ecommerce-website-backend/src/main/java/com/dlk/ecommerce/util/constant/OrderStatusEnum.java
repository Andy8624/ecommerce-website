package com.dlk.ecommerce.util.constant;

import com.dlk.ecommerce.util.error.EnumNameNotValidException;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;

public enum OrderStatusEnum {
    PENDING,            // Đơn hàng mới được tạo, chờ xử lí
    CONFIRMED,          // Đơn hàng đã được xác nhận
    SHIPPING,            // Đơn hàng đang được vận chuyển
    DELIVERED,          // Đơn hàng đã được giao
    CANCELLED,          // Đơn hàng đã bị hủy
    COMPLETED;            // Đơn hàng đã hoàn thành

    @JsonCreator
    public static OrderStatusEnum fromValue(String value) {
        try {
            return OrderStatusEnum.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new EnumNameNotValidException("Invalid order status: '" + value + "'. Valid values are: " + Arrays.toString(OrderStatusEnum.values()));
        }
    }

}
