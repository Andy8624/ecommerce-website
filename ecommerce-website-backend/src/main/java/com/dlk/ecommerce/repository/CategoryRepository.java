package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Category;
import com.dlk.ecommerce.domain.entity.CategoryDetail;
import com.dlk.ecommerce.domain.entity.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findByToolsContaining(Tool tool);
}
