package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.*;
import com.dlk.ecommerce.domain.request.category.CategoryDetailRequest;
import com.dlk.ecommerce.domain.request.category.CategoryRequest;
import com.dlk.ecommerce.repository.CategoryDetailRepository;
import com.dlk.ecommerce.repository.CategoryRepository;
import com.dlk.ecommerce.repository.ProductVariantRepository;
import com.dlk.ecommerce.repository.ToolRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryDetailService categoryDetailService;
    private final ProductVariantRepository productVariantRepository;
    private final VariantDetailService variantDetailService;
    private final CategoryDetailRepository categoryDetailRepository;

    public void createCategory(
            List<CategoryRequest> requests,
            Tool tool, List<CategoryDetailRequest> categoryDetail
    ) throws IdInvalidException {
        for (CategoryRequest request : requests) {
            // Tạo category
            Category category = new Category();
            category.setName(request.getName());
            Category newCategory = categoryRepository.save(category);

            // Tạo chi tiết category
            for (String value : request.getValues()) {
                CategoryDetail newCategoryDetail = categoryDetailService.createCategoryDetail(newCategory, value);
                // THêm Id cho categoryDetail
                for (CategoryDetailRequest detailRequest : categoryDetail) {
                    if (detailRequest.getCategory0() != null && detailRequest.getCategory0().equals(value)) {
                        detailRequest.setCategoryId0(newCategoryDetail.getId());
                    }
                    if (detailRequest.getCategory1() != null && detailRequest.getCategory1().equals(value)) {
                        detailRequest.setCategoryId1(newCategoryDetail.getId());
                    }
                }
            }
        }
//            LogFormatter.logFormattedRequest("categoryDetail", categoryDetail);
        for (CategoryDetailRequest request : categoryDetail) {
            // Tạo chi tiết giá và số lượng sản phẩm từng loại
            ProductVariant productVariant = new ProductVariant();
            productVariant.setTool(tool);
            productVariant.setPrice(request.getPrice());
            productVariant.setStock(request.getStock());
            ProductVariant newProductVariant = productVariantRepository.save(productVariant);

            // Tạo chi tiết sản phẩm kết hợp từng loại
            if (request.getCategoryId0() != null) {
                VariantDetail variantDetail = new VariantDetail();
                variantDetail.setProductVariant(newProductVariant);
                variantDetail.setCategoryDetail(categoryDetailService.findById(request.getCategoryId0()));
                variantDetailService.createVariantDetail(variantDetail);
            }

            if (request.getCategoryId1() != null) {
                VariantDetail variantDetail = new VariantDetail();
                variantDetail.setProductVariant(newProductVariant);
                variantDetail.setCategoryDetail(categoryDetailService.findById(request.getCategoryId1()));
                variantDetailService.createVariantDetail(variantDetail);
            }
        }
    }

    public Category getCategoryByCategoryDetailId(String categoryDetailId) throws IdInvalidException {
        CategoryDetail categoryDetail = categoryDetailRepository.findById(categoryDetailId)
                .orElseThrow(() -> new IdInvalidException("CategoryDetail not found"));
        return categoryDetail.getCategory();
    }
}
