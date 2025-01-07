package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.Cart;
import com.dlk.ct466.domain.entity.CartTool;
import com.dlk.ct466.domain.entity.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartToolRepository extends JpaRepository<CartTool, Long>,
        JpaSpecificationExecutor<CartTool> {
    Optional<CartTool> findByCartAndTool(Cart cart, Tool tool);

}
