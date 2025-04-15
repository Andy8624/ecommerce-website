package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.ProductReview;
import com.dlk.ecommerce.domain.request.product_review.ProductReviewRequest;
import com.dlk.ecommerce.service.ProductReviewService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/product-reviews")
public class ProductReviewController {
    private final ProductReviewService productReviewService;

    @PostMapping
    @ApiMessage("Create product review")
    public ResponseEntity<Void> createProductPreview(@RequestBody ProductReviewRequest productReview) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(productReviewService.createProductReview(productReview));
    }

    // Lay productreview tu buyerId va toolId
    @GetMapping("/{buyerId}/{toolId}")
    @ApiMessage("Get product review of buyer")
    public ResponseEntity<List<ProductReview>> getByBuyerIdAndToolId(@PathVariable String buyerId,
                                                                  @PathVariable Long toolId) {
        return ResponseEntity.status(HttpStatus.OK).body(productReviewService.fetchProductReviewByBuyerAndTool(buyerId, toolId));
    }

    @GetMapping("/tools/{toolId}")
    @ApiMessage("Get all review of product")
    public ResponseEntity<List<ProductReview>> getAllProductReviewByProductId(@PathVariable Long toolId) {
        return ResponseEntity.status(HttpStatus.OK).body(productReviewService.getAllByProductId(toolId));
    }
}
