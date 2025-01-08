package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.CartCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CartCourseRepository extends JpaRepository<CartCourse, Long>,
        JpaSpecificationExecutor<CartCourse> {

}
