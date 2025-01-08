package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Cart;
import com.dlk.ecommerce.domain.entity.CartTool;
import com.dlk.ecommerce.domain.entity.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartToolRepository extends JpaRepository<CartTool, Long>,
        JpaSpecificationExecutor<CartTool> {
    Optional<CartTool> findByCartAndTool(Cart cart, Tool tool);

}
