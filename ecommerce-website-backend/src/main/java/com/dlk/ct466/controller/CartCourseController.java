package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.CartCourse;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.service.CartCourseService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart-courses")
public class CartCourseController {
    private final CartCourseService cartCourseService;

    @GetMapping("/{id}")
    @ApiMessage("Get cart course by id")
    public ResponseEntity<CartCourse> getCartCourseById(@PathVariable long id) throws IdInvalidException {
        return ResponseEntity.ok(cartCourseService.getCartCourseById(id));
    }

    @PostMapping
    @ApiMessage("Create a cart course")
    public ResponseEntity<CartCourse> create(@RequestBody CartCourse cartCourse) throws IdInvalidException {
        return ResponseEntity.ok(cartCourseService.createCartCourse(cartCourse));
    }

    @ApiMessage("Get all cart courses")
    @GetMapping
    public ResponseEntity<ResPaginationDTO> getAll(
            @Filter Specification<CartCourse> spec,
            Pageable pageable) throws IdInvalidException {
        return ResponseEntity.ok(cartCourseService.getAllCartCourse(spec, pageable));
    }
}
