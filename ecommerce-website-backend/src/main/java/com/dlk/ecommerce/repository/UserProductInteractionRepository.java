package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.UserProductInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProductInteractionRepository extends JpaRepository<UserProductInteraction, Long> {
    List<UserProductInteraction> findByUser_UserId(String userId);

    List<UserProductInteraction> findByTool_ToolId(Long toolId);
}