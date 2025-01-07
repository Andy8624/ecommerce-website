package com.dlk.ct466.domain.response.orderCourse;

import com.dlk.ct466.domain.entity.Course;
import com.dlk.ct466.domain.entity.Order;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
