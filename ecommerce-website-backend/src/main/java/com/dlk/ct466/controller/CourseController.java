package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.Course;
import com.dlk.ct466.domain.request.course.ReqCourseDTO;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.service.CourseService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/courses")
public class CourseController {
    private final CourseService courseService;

    @PostMapping
    @ApiMessage("Create course successful")
    public ResponseEntity<Course> create(@RequestBody ReqCourseDTO course) throws IdInvalidException {
        return ResponseEntity.ok(courseService.createCourse(course));
    }

    @PutMapping("/{courseId}")
    @ApiMessage("Update course successful")
    public ResponseEntity<Course> update(
            @PathVariable String courseId,
            @RequestBody Course course
    ) throws IdInvalidException {
        return ResponseEntity.ok(courseService.updateCourse(courseId, course));
    }

    @GetMapping
    @ApiMessage("Get all courses")
    public ResponseEntity<ResPaginationDTO> getAllCourse(
            Pageable pageable
    ) {
        return ResponseEntity.ok(courseService.getAllCourse(pageable));
    }

    @GetMapping("/ownerByUser/{userId}")
    @ApiMessage("Get all courses by user")
    public ResponseEntity<ResPaginationDTO> getAllCourseByUser(
            @PathVariable String userId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(courseService.getAllCourseByUser(userId, pageable));
    }

    @PostMapping("/courseUrl")
    @ApiMessage("Get course db by url")
    public ResponseEntity<Course> getByPlaylistId(
            @RequestBody String courseUrl) {
        return ResponseEntity.ok(courseService.courseGetCourseByCourseUrlNotDeleted(courseUrl));
    }

    @GetMapping("/{courseId}")
    @ApiMessage("Get course by id")
    public ResponseEntity<Course> getById(
            @PathVariable String courseId
    ) throws IdInvalidException {
        return ResponseEntity.ok(courseService.getCourseById(courseId));
    }

    @DeleteMapping("/{courseId}")
    @ApiMessage("Delete course successful")
    public ResponseEntity<String> delete(
            @PathVariable String courseId
    ) throws IdInvalidException {
        courseService.deleteCourse(courseId);
        return ResponseEntity.ok("Delete course successful");
    }
}
