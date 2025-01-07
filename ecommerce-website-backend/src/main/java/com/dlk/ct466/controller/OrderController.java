package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.Order;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.order.ResCreateOrderDTO;
import com.dlk.ct466.domain.response.order.ResOrderDTO;
import com.dlk.ct466.domain.response.order.ResUpdateOrderDTO;
import com.dlk.ct466.service.OrderService;
import com.dlk.ct466.util.annotation.ApiMessage;

import com.dlk.ct466.util.error.IdInvalidException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<ResCreateOrderDTO> create(@Valid @RequestBody Order order) throws IdInvalidException {
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
    public ResponseEntity<List<ResOrderDTO>> getUserOrder(@PathVariable("userId") String id) throws IdInvalidException {
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
}
