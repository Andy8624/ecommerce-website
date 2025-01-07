package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.Tool;
import com.dlk.ct466.domain.entity.ToolType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ToolTypeRepository extends JpaRepository<ToolType, Long>,
        JpaSpecificationExecutor<ToolType> {

    @Query("SELECT tt FROM ToolType tt WHERE tt.toolTypeId = :id AND tt.deleted = false")
    Optional<ToolType> findByIdIfNotDeleted(@Param("id") Long id);

    // Tìm kiếm ToolType theo tên trong những tên chưa bị xóa
    @Query("SELECT tt FROM ToolType tt WHERE tt.name = :name AND tt.deleted = false")
    Optional<ToolType> findByNameNotDeleted(String name);
}
