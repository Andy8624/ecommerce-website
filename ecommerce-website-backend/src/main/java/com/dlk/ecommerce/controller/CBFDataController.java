package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.response.recommendation.CBFResponse;
import com.dlk.ecommerce.service.ToolService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendation/cbf-data")
@RequiredArgsConstructor
@Slf4j
public class CBFDataController {
    private final ToolService toolService;

    @GetMapping
    public List<CBFResponse> getCBFTools() {
        return toolService.getCBFResponseList();
    }
}
