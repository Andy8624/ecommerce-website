package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.ImageTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageToolRepository extends JpaRepository<ImageTool, Long> {
}
