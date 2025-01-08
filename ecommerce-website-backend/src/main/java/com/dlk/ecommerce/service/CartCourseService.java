package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.CartCourse;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.repository.CartCourseRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartCourseService {
    private final CartCourseRepository cartCourseRepository;

    public CartCourse getCartCourseById(long id) {
        return this.cartCourseRepository.findById(id).orElse(null);
    }

    public ResPaginationDTO getAllCartCourse(Specification<CartCourse> spec, Pageable pageable) {
        Page<CartCourse> pageCartCourse = cartCourseRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageCartCourse, pageable);
    }

    public CartCourse createCartCourse(CartCourse cartCourse) {
        return this.cartCourseRepository.save(cartCourse);
    }
}
