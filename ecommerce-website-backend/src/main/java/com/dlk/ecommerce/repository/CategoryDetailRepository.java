package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.CategoryDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryDetailRepository extends JpaRepository<CategoryDetail, String> {
    CategoryDetail findByCategoryId(String categoryDetailId);
}