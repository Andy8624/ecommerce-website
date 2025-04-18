package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Order;
import com.dlk.ecommerce.util.constant.OrderStatusEnum;
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

    List<Order> findByShopId(String shopId);
}
