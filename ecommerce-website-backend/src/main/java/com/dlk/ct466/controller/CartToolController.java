package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.CartTool;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.service.CartToolService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart-tools")
public class CartToolController {
    private final CartToolService cartToolService;

    @GetMapping("/{id}")
    @ApiMessage("Get cart tool by ID")
    public ResponseEntity<CartTool> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(cartToolService.getCartToolById(id));
    }

    @PostMapping
    @ApiMessage("Create a cart tool")
    public ResponseEntity<CartTool> create(@RequestBody CartTool cartTool) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartToolService.createCartTool(cartTool));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a cart tool")
    public ResponseEntity<CartTool> update(@PathVariable("id") long id, @RequestBody CartTool cartTool) throws IdInvalidException {
        return ResponseEntity.ok(cartToolService.updateCartTool(id, cartTool));
    }

    @GetMapping("/tool-of-cart/{id}")
    @ApiMessage("Get all cart tools by Cart ID")
    public ResponseEntity<ResPaginationDTO> getAllCartTools(Pageable pageable, @PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(cartToolService.getAllCartTools(pageable, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Hard delete cart tool by ID")
    public ResponseEntity<Void> deleteCartTool(@PathVariable("id") long cartToolId) throws IdInvalidException {
        cartToolService.deleteCartTool(cartToolId);
        return ResponseEntity.ok(null);
    }

    @PostMapping("/isExist")
    @ApiMessage("Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa")
    //    Trả về cartToolId
    public ResponseEntity<Long> isExist(@RequestBody CartTool cartTool) {
        return ResponseEntity.ok(cartToolService.isExist(cartTool));
    }

}
