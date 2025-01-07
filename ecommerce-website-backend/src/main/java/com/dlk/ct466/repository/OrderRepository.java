package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.Order;
import com.dlk.ct466.util.constant.OrderStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderRepository extends JpaRepository<Order, String>,
        JpaSpecificationExecutor<Order> {
    List<Order> findByUserUserId(String userId);

    List<Order> findByAddressAddressId(String addressId);

    List<Order> findByPaymentMethodPaymentMethodId(long id);

    List<Order> findByStatus(OrderStatusEnum status);
}
