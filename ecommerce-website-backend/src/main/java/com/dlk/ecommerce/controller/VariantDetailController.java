package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.response.productvariant.VariantDetailResponse;
import com.dlk.ecommerce.service.VariantDetailService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/variant-detail")
public class VariantDetailController {
    private final VariantDetailService variantDetailService;

    @GetMapping("/{id}")
    @ApiMessage("Get variant detail by id")
    public ResponseEntity<VariantDetailResponse> getVariantDetailById(@PathVariable String id) throws IdInvalidException {
        return ResponseEntity.ok(variantDetailService.getVariantDetailById(id));
    }
}
