package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.ProductVariant;
import com.dlk.ecommerce.domain.entity.VariantDetail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VariantDetailRepository extends JpaRepository<VariantDetail, String> {
    List<VariantDetail> findByProductVariant(ProductVariant productVariant);

}
