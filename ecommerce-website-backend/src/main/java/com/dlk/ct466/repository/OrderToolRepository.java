package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.OrderTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface OrderToolRepository extends JpaRepository<OrderTool, String>,
        JpaSpecificationExecutor<OrderTool> {
    Optional<OrderTool> findByOrderOrderIdAndToolToolId(String orderId, Long toolId);

}
