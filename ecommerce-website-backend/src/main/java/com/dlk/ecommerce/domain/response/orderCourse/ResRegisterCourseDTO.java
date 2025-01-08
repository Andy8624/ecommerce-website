package com.dlk.ecommerce.domain.response.orderCourse;

import com.dlk.ecommerce.domain.entity.Course;
import com.dlk.ecommerce.domain.entity.Order;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResRegisterCourseDTO {
    String orderCourseId;
    Order order;
    Course course;
}
