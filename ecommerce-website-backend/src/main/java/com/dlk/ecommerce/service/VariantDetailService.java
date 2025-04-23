package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.CategoryDetail;
import com.dlk.ecommerce.domain.entity.ProductVariant;
import com.dlk.ecommerce.domain.entity.VariantDetail;
import com.dlk.ecommerce.domain.response.productvariant.VariantDetailResponse;
import com.dlk.ecommerce.repository.VariantDetailRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Var;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VariantDetailService {
    private final VariantDetailRepository variantDetailRepository;
    private final ProductVariantService productVariantService;
    private final CategoryDetailService categoryDetailService;

    public void createVariantDetail(VariantDetail variantDetail) {
        variantDetailRepository.save(variantDetail);
    }

    public VariantDetailResponse getVariantDetailById(String id) throws IdInvalidException {
        VariantDetail variantDetail = variantDetailRepository.findById(id).orElse(null);
        if (variantDetail == null) {
            return null;
        }
        String product_variant_id = variantDetail.getProductVariant().getId();
        String category_detail_id = variantDetail.getCategoryDetail().getId();

        ProductVariant productVariant = productVariantService.getById(product_variant_id);
        CategoryDetail categoryDetail = categoryDetailService.findById(category_detail_id);
        return VariantDetailResponse.builder()
                .id(variantDetail.getId())
                .product_variant_id(product_variant_id)
                .price(productVariant.getPrice())
                .stock(productVariant.getStock())

                .category_detail_id(category_detail_id)
                .category_detail_name(categoryDetail.getName())
                .category_name(categoryDetail.getCategory().getName())
                .build();
    }

    // And this method in VariantDetailService
    public List<VariantDetail> findByProductVariant(ProductVariant productVariant) {
        return variantDetailRepository.findByProductVariant(productVariant);
    }
}
