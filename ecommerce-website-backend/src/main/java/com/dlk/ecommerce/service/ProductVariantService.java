package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ProductVariant;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.VariantDetail;
import com.dlk.ecommerce.domain.request.category.CategoryDetailRequest;
import com.dlk.ecommerce.repository.ProductVariantRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;

    public ProductVariant getById(String id) throws IdInvalidException {
        return productVariantRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Không tìm thấy categoryDetail")
        );
    }

    public Integer getStockById(String id) throws IdInvalidException {
        ProductVariant productVariant = getById(id);
        return productVariant.getStock();
    }

    public Integer getStockByIdForUpdate(String id) throws IdInvalidException {
        ProductVariant productVariant = productVariantRepository.findByIdForUpdate(id).orElse(null);
        assert productVariant != null;
        return productVariant.getStock();
    }


    public void reduceStock(String productVariantId, int quantity) throws IdInvalidException {
        ProductVariant productVariant = productVariantRepository.findByIdForUpdate(productVariantId).orElseThrow(
                () -> new IdInvalidException("Không tìm thấy categoryDetail")
        );
        productVariant.setStock(productVariant.getStock() - quantity);
        productVariantRepository.save(productVariant);
    }
}
