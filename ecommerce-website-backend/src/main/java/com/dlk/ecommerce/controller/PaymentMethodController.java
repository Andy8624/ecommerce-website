package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.PaymentMethod;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.service.PaymentMethodService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/paymentmethods")
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @GetMapping("/{id}")
    @ApiMessage("Get payment method by id")
    public ResponseEntity<PaymentMethod> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethodById(id));
    }

    @PostMapping
    @ApiMessage("Create a payment method")
    public ResponseEntity<PaymentMethod> create(@Valid @RequestBody PaymentMethod paymentMethod) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMethodService.createPaymentMethod(paymentMethod));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a payment method")
    public ResponseEntity<PaymentMethod> update(@PathVariable("id") long id, @Valid @RequestBody PaymentMethod paymentMethod) throws IdInvalidException {
        return ResponseEntity.ok(paymentMethodService.updatePaymentMethod(paymentMethod, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a payment method success")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(paymentMethodService.deletePaymentMethod(id));
    }

    @PatchMapping("{id}")
    @ApiMessage("Restore a payment method success")
    public ResponseEntity<Void> restore(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(paymentMethodService.restorePaymentMethod(id));
    }

    @GetMapping
    @ApiMessage("Get all payment methods")
    public ResponseEntity<ResPaginationDTO> getAllTool(
            Pageable pageable
    ) {
        return ResponseEntity.ok(paymentMethodService.getAllPaymentMethod(pageable));
    }
}
