package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByTool_ToolIdAndUser_UserId(Long toolId, String userId);

    List<ProductReview> findByTool_ToolId(Long toolId);

    List<ProductReview> findByUser_UserId(String userId);
}
