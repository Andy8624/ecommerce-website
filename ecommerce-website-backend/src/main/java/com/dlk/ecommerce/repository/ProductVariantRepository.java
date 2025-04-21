package com.dlk.ecommerce.repository;


import com.dlk.ecommerce.domain.entity.ProductVariant;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, String> {
    Integer getStockById(String id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "100000")})
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.id = :id")
    Optional<ProductVariant> findByIdForUpdate(@Param("id") String id);

}
