package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.OrderCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface OrderCourseRepository extends JpaRepository<OrderCourse, String>,
        JpaSpecificationExecutor<OrderCourse> {
    Optional<OrderCourse> findByOrderOrderIdAndCourseCourseId(String orderId, String courseId);
}
