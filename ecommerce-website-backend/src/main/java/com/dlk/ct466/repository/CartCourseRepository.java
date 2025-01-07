package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.CartCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CartCourseRepository extends JpaRepository<CartCourse, Long>,
        JpaSpecificationExecutor<CartCourse> {

}
