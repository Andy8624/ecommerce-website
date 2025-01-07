package com.dlk.ct466.util.constant;

import com.dlk.ct466.util.error.EnumNameNotValidException;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;

public enum OrderStatusEnum {
    PENDING,            // Đơn hàng mới được tạo, chờ xử lí
    CONFIRMED,          // Đơn hàng đã được xác nhận
    PROCESSING,         // Đơn hàng đang được chuẩn bị
    SHIPPED,            // Đơn hàng đã được vận chuyển
    DELIVERED,          // Đơn hàng đã được giao
    CANCELLED,          // Đơn hàng đã bị hủy
    RETURN_REQUESTED,   // Khách hàng yêu cầu trả lại hàng
    RETURN_SUCCEEDED,   // Hàng đã được chấp nhận trả lại thành công.
    RETURN_REFUSED,    // Người bán đã từ chối yêu cầu trả hàng của bạn
    REFUNDED,           // Đơn hàng cần hoàn tiền
    SUCCESS;            // Đơn hàng đã hoàn thành

    @JsonCreator
    public static OrderStatusEnum fromValue(String value) {
        try {
            return OrderStatusEnum.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new EnumNameNotValidException("Invalid order status: '" + value + "'. Valid values are: " + Arrays.toString(OrderStatusEnum.values()));
        }
    }

}
