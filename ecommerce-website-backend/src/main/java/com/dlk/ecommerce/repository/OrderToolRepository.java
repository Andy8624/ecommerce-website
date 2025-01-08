package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.OrderTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface OrderToolRepository extends JpaRepository<OrderTool, String>,
        JpaSpecificationExecutor<OrderTool> {
    Optional<OrderTool> findByOrderOrderIdAndToolToolId(String orderId, Long toolId);

}
