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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryDetailService categoryDetailService;
    private final ProductVariantRepository productVariantRepository;
    private final VariantDetailService variantDetailService;
    private final CategoryDetailRepository categoryDetailRepository;

    public void createCategory(
            List<CategoryRequest> requests,
            Tool tool, List<CategoryDetailRequest> categoryDetail) throws IdInvalidException {
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

    /**
     * Cập nhật cấu trúc phân loại sản phẩm
     * 
     * @param categories Danh sách các category request
     * @param tool       Sản phẩm cần cập nhật
     */
    @Transactional
    public void updateCategories(List<CategoryRequest> categories, Tool tool) {
        log.info("Updating categories for tool ID: {}", tool.getToolId());

        // Lấy các category hiện tại theo tên để mapping
        Map<String, Category> existingCategoriesMap = categoryRepository.findByToolsContaining(tool).stream()
                .collect(Collectors.toMap(Category::getName, category -> category));

        // Lặp qua từng category request để cập nhật hoặc tạo mới
        for (CategoryRequest categoryRequest : categories) {
            Category category;

            // Tìm category hiện tại theo tên
            if (existingCategoriesMap.containsKey(categoryRequest.getName())) {
                // Nếu đã tồn tại, sử dụng category hiện có
                category = existingCategoriesMap.get(categoryRequest.getName());
                log.info("Found existing category: {}", category.getName());
            } else {
                // Nếu chưa tồn tại, tạo mới category
                category = new Category();
                category.setName(categoryRequest.getName());
                category = categoryRepository.save(category);
                log.info("Created new category: {}", category.getName());
            }

            // Tạo map các giá trị hiện tại để so sánh
            Map<String, CategoryDetail> existingDetailsMap = category.getCategoryDetails().stream()
                    .collect(Collectors.toMap(CategoryDetail::getName, detail -> detail));

            // Cập nhật các giá trị của category
            for (String value : categoryRequest.getValues()) {
                if (!existingDetailsMap.containsKey(value)) {
                    // Nếu giá trị chưa tồn tại, tạo mới
                    CategoryDetail newDetail = categoryDetailService.createCategoryDetail(category, value);
                    log.info("Added new category detail: {} - {}", category.getName(), value);
                }
            }
        }
    }

    /**
     * Cập nhật chi tiết phân loại sản phẩm (giá, số lượng)
     * 
     * @param tool            Sản phẩm cần cập nhật
     * @param categoryDetails Danh sách chi tiết phân loại
     */
    @Transactional
    public void updateCategoryDetails(Tool tool, List<CategoryDetailRequest> categoryDetails)
            throws IdInvalidException {
        log.info("Updating category details for tool ID: {}", tool.getToolId());

        // Tạo map các variant hiện tại theo cặp categoryDetail ID để dễ truy cập
        Map<String, ProductVariant> existingVariantsMap = productVariantRepository.findByTool(tool).stream()
                .collect(Collectors.toMap(
                        variant -> {
                            // Tạo key từ cặp category detail id từ variant details
                            List<VariantDetail> details = variantDetailService.findByProductVariant(variant);
                            if (details.size() == 2) {
                                String id1 = details.get(0).getCategoryDetail().getId();
                                String id2 = details.get(1).getCategoryDetail().getId();
                                return id1.compareTo(id2) < 0 ? id1 + "|" + id2 : id2 + "|" + id1;
                            } else if (details.size() == 1) {
                                return details.get(0).getCategoryDetail().getId();
                            }
                            return "";
                        },
                        variant -> variant));

        // Cập nhật từng chi tiết phân loại
        for (CategoryDetailRequest detailRequest : categoryDetails) {
            if (detailRequest.getCategoryId0() != null) {
                String variantKey = detailRequest.getCategoryId1() != null
                        ? (detailRequest.getCategoryId0().compareTo(detailRequest.getCategoryId1()) < 0
                                ? detailRequest.getCategoryId0() + "|" + detailRequest.getCategoryId1()
                                : detailRequest.getCategoryId1() + "|" + detailRequest.getCategoryId0())
                        : detailRequest.getCategoryId0();

                ProductVariant variant;

                // Kiểm tra xem variant có tồn tại không
                if (existingVariantsMap.containsKey(variantKey)) {
                    // Cập nhật variant hiện có
                    variant = existingVariantsMap.get(variantKey);
                    variant.setPrice(detailRequest.getPrice());
                    variant.setStock(detailRequest.getStock());
                    productVariantRepository.save(variant);
                    log.info("Updated existing variant: {}, price={}, stock={}",
                            variantKey, detailRequest.getPrice(), detailRequest.getStock());
                } else {
                    // Tạo mới variant nếu chưa tồn tại
                    variant = new ProductVariant();
                    variant.setTool(tool);
                    variant.setPrice(detailRequest.getPrice());
                    variant.setStock(detailRequest.getStock());
                    ProductVariant newVariant = productVariantRepository.save(variant);

                    // Tạo liên kết với categoryDetail
                    VariantDetail variantDetail1 = new VariantDetail();
                    variantDetail1.setProductVariant(newVariant);
                    variantDetail1.setCategoryDetail(categoryDetailService.findById(detailRequest.getCategoryId0()));
                    variantDetailService.createVariantDetail(variantDetail1);

                    if (detailRequest.getCategoryId1() != null) {
                        VariantDetail variantDetail2 = new VariantDetail();
                        variantDetail2.setProductVariant(newVariant);
                        variantDetail2
                                .setCategoryDetail(categoryDetailService.findById(detailRequest.getCategoryId1()));
                        variantDetailService.createVariantDetail(variantDetail2);
                    }

                    log.info("Created new variant: {}, price={}, stock={}",
                            variantKey, detailRequest.getPrice(), detailRequest.getStock());
                }
            }
        }
    }

    public Category getCategoryByCategoryDetailId(String categoryDetailId) throws IdInvalidException {
        CategoryDetail categoryDetail = categoryDetailRepository.findById(categoryDetailId)
                .orElseThrow(() -> new IdInvalidException("CategoryDetail not found"));
        return categoryDetail.getCategory();
    }
}
