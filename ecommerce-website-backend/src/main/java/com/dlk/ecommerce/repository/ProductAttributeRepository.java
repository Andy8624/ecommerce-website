package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Cart;
import com.dlk.ecommerce.domain.entity.ProductAttributes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttributes, String>, JpaSpecificationExecutor<Cart> {

    List<ProductAttributes> findByTool_ToolId(Long toolId);
}
