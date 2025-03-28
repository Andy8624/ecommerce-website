package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ToolRepository extends JpaRepository<Tool, Long>,
        JpaSpecificationExecutor<Tool> {
    @Query("SELECT t FROM Tool t WHERE t.toolId = :toolId AND t.deleted = true")
    Optional<Tool> getToolDeletedById(@Param("toolId") Long toolId);

    @Query("SELECT t FROM Tool t WHERE t.toolId = :id AND t.deleted = false")
    Optional<Tool> findByIdIfNotDeleted(@Param("id") Long id);
}
