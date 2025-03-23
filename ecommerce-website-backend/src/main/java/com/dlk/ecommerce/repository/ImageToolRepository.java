package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.ImageTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageToolRepository extends JpaRepository<ImageTool, Long> {
    Optional<ImageTool> findByFileName(String fileName);
    List<ImageTool> findByTool_ToolId(Long toolId);
}
