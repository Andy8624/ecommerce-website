package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Category;
import com.dlk.ecommerce.domain.entity.CategoryDetail;
import com.dlk.ecommerce.domain.request.category.CategoryDetailRequest;
import com.dlk.ecommerce.repository.CategoryDetailRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryDetailService {
    private final CategoryDetailRepository categoryDetailRepository;

    public CategoryDetail createCategoryDetail(Category category, String name) {
        CategoryDetail categoryDetail = new CategoryDetail();
        categoryDetail.setCategory(category);
        categoryDetail.setName(name);
        return categoryDetailRepository.save(categoryDetail);
    }

    public CategoryDetail findById(String categoryId0) throws IdInvalidException {
        return categoryDetailRepository.findById(categoryId0).orElseThrow(
                () -> new IdInvalidException("Không tìm thấy categoryDetail")
        );
    }
}