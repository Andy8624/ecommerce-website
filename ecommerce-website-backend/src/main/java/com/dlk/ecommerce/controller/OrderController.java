package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.Order;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.request.order.CreateOrderRequest;
import com.dlk.ecommerce.domain.request.order.OrderStatusRequest;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.order.ResCreateOrderDTO;
import com.dlk.ecommerce.domain.response.order.ResOrderDTO;
import com.dlk.ecommerce.domain.response.order.ResUpdateOrderDTO;
import com.dlk.ecommerce.service.OrderService;
import com.dlk.ecommerce.util.annotation.ApiMessage;

import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;


    @GetMapping("/{id}")
    @ApiMessage("Get order by id")
    public ResponseEntity<ResOrderDTO> getById(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(orderService.getOrderByIdDTO(id));
    }

    @PostMapping
    @ApiMessage("Create a order")
    public ResponseEntity<CreateOrderRequest> create(@Valid @RequestBody CreateOrderRequest order) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(order));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a order")
    public ResponseEntity<ResUpdateOrderDTO> update(@PathVariable("id") String id, @Valid @RequestBody Order order) throws IdInvalidException {
        return ResponseEntity.ok(orderService.updateOrder(order, id));
    }

    @GetMapping
    @ApiMessage("Get all orders")
    public ResponseEntity<ResPaginationDTO> getAllOrder(
            Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.getAllOrder(pageable));
    }

    @GetMapping("/user-order/{userId}")
    @ApiMessage("Get user-order by user ID")
    public ResponseEntity<List<Order>> getUserOrder(@PathVariable("userId") String id) throws IdInvalidException {
        return ResponseEntity.ok(orderService.getOrderByUserId(id));
    }

    @GetMapping("/address-order/{addressId}")
    @ApiMessage("Get address-order by address ID")
    public ResponseEntity<List<ResOrderDTO>> getAddressOrder(@PathVariable("addressId") String id) throws IdInvalidException {
        return ResponseEntity.ok(orderService.getOrderByAddressId(id));
    }

    @GetMapping("/payment-method-order/{paymentMethodId}")
    @ApiMessage("Get payment-method-order by payment-method ID")
    public ResponseEntity<List<ResOrderDTO>> getPaymentMethodOrder(@PathVariable("paymentMethodId") long id) throws IdInvalidException {
        return ResponseEntity.ok(orderService.getOrderByPaymentMethodId(id));
    }

    @PostMapping("/status-order")
    @ApiMessage("Get status-order by status")
    public ResponseEntity<List<ResOrderDTO>> getOrderByStatus(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.getOrderByStatus(order.getStatus()));
    }

    @GetMapping("/shop-order/{shopId}")
    @ApiMessage("Get orders by shop id")
    public ResponseEntity<ResPaginationDTO> getOrderByShopId(
            @Filter Specification<Order> spec,
            Pageable pageable,
            @PathVariable String shopId
    ) {
        return ResponseEntity.ok(orderService.getOrderByShopId(spec, pageable, shopId));
    }

    @PutMapping("/status/{orderId}")
    @ApiMessage("Update order status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody OrderStatusRequest status) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.updateOrderStatus(orderId, status));
    }
}
