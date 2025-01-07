package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.Cart;
import com.dlk.ct466.domain.response.cart.ResCartDTO;
import com.dlk.ct466.service.CartService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/carts")
public class CartController {
    private final CartService cartService;

    @GetMapping("/{id}")
    @ApiMessage("Get cart by id")
    public ResponseEntity<ResCartDTO> getById(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(cartService.getCartById(id));
    }

    @PostMapping
    @ApiMessage("Create a cart")
    public ResponseEntity<ResCartDTO> create(@RequestBody Cart cart) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.createCart(cart));
    }
//
//    @PutMapping("/{id}")
//    @ApiMessage("Update a cart")
//    public ResponseEntity<Cart> update(@PathVariable("id") String id, @RequestBody Cart cart) throws IdInvalidException {
//        return ResponseEntity.ok(cartService.updateCart(cart, id));
//    }

//    @GetMapping
//    @ApiMessage("Get all carts")
//    public ResponseEntity<ResPaginationDTO> getAllCarts(Pageable pageable) {
//        return ResponseEntity.ok(cartService.getAllCarts(pageable));
//    }

    @GetMapping("/user-cart/{id}")
    @ApiMessage("Get cart by user ID")
    public ResponseEntity<ResCartDTO> getCartByUserId(@PathVariable("id") String userId) throws IdInvalidException {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }
}
