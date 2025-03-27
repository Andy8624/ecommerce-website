package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.OrderTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderToolRepository extends JpaRepository<OrderTool, String>,
        JpaSpecificationExecutor<OrderTool> {
    Optional<OrderTool> findByOrderOrderIdAndToolToolId(String orderId, Long toolId);

    @Query("SELECT SUM(ot.quantity) FROM OrderTool ot WHERE ot.tool.toolId = :toolId AND ot.order.status = 'SUCCESS'")
    Integer sumQuantityByToolIdAndOrderStatusSuccess(@Param("toolId") Long toolId);
}
