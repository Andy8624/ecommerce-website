package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.Category;
import com.dlk.ecommerce.service.CategoryService;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/category-detail/{categoryDetailId}")
    public Category getCategoryByCategoryDetailId(@PathVariable String categoryDetailId) throws IdInvalidException {
        return categoryService.getCategoryByCategoryDetailId(categoryDetailId);
    }
}
