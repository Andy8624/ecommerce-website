package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.OrderCourse;
import com.dlk.ecommerce.domain.response.orderCourse.ResRegisterCourseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderCourseMapper {
    ResRegisterCourseDTO toDto(OrderCourse orderCourse);
    OrderCourse toEntity(ResRegisterCourseDTO dto);
}