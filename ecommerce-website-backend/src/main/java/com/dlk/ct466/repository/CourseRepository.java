package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {

    Optional<Course> findByCourseUrl(String courseUrl);

    @Query("SELECT c FROM Course c WHERE c.courseUrl = :courseUrl AND c.deleted = false")
    Optional<Course> findCourseByCourseUrlAndNotDeleted(@Param("courseUrl") String courseUrl);

}
