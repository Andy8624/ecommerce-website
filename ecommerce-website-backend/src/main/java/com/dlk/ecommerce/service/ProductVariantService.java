package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ProductVariant;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.VariantDetail;
import com.dlk.ecommerce.domain.request.category.CategoryDetailRequest;
import com.dlk.ecommerce.repository.ProductVariantRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;

    public ProductVariant getById(String id) throws IdInvalidException {
        return productVariantRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Không tìm thấy categoryDetail")
        );
    }
}
