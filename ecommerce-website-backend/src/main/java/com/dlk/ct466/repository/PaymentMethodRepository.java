package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long>,
        JpaSpecificationExecutor<PaymentMethod> {
    Optional<PaymentMethod> findByName(String name);
    @Query("SELECT pm FROM PaymentMethod pm WHERE pm.paymentMethodId = :id AND pm.deleted = false")
    Optional<PaymentMethod> findByIdIfNotDeleted(@Param("id") Long id);
}
