package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.OrderCourse;
import com.dlk.ecommerce.domain.response.orderCourse.ResRegisterCourseDTO;

public class OrderCourseMapper {

    public static ResRegisterCourseDTO toDto(OrderCourse orderCourse) {
        return ResRegisterCourseDTO.builder()
                .orderCourseId(orderCourse.getOrderCourseId())
                .order(orderCourse.getOrder())
                .course(orderCourse.getCourse())
                .build();
    }

    public static OrderCourse toEntity(ResRegisterCourseDTO dto) {
        return OrderCourse.builder()
                .orderCourseId(dto.getOrderCourseId())
                .order(dto.getOrder())
                .course(dto.getCourse())
                .build();
    }
}