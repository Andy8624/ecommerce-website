package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductReviewRepository extends
        JpaRepository<ProductReview, Long>,
        JpaSpecificationExecutor<ProductReview> {
    List<ProductReview> findByTool_ToolId(Long toolId);

    List<ProductReview> findByTool_ToolIdAndUser_UserId(long tool_toolId, String user_userId);
}
