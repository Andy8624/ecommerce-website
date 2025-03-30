package com.dlk.ecommerce.repository;


import com.dlk.ecommerce.domain.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, String> {
}
