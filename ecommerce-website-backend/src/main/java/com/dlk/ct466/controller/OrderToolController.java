package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.OrderTool;
import com.dlk.ct466.domain.request.orderTool.ReqOrderToolDTO;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.orderTool.ResCreateOrderToolDTO;
import com.dlk.ct466.domain.response.orderTool.ResOrderToolDTO;
import com.dlk.ct466.domain.response.orderTool.ResUpdateOrderToolDTO;
import com.dlk.ct466.service.OrderToolService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ordertools")
public class OrderToolController {
    private final OrderToolService orderToolService;

    @GetMapping("/{id}")
    @ApiMessage("Get order tool by id")
    public ResponseEntity<ResOrderToolDTO> getById(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(orderToolService.getOrderToolByIdDTO(id));
    }

    @PostMapping
    @ApiMessage("Create an order tool")
    public ResponseEntity<ResCreateOrderToolDTO> create(@Valid @RequestBody ReqOrderToolDTO orderTool) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderToolService.createOrderTool(orderTool));
    }

    @PutMapping("/{orderToolId}")
    @ApiMessage("Update an order tool")
    public ResponseEntity<ResUpdateOrderToolDTO> update(@PathVariable("orderToolId") String id, @Valid @RequestBody ReqOrderToolDTO orderTool) throws IdInvalidException {
        return ResponseEntity.ok(orderToolService.updateOrderTool(orderTool, id));
    }

    @GetMapping
    @ApiMessage("Get all order tools")
    public ResponseEntity<ResPaginationDTO> getAllOrderTools(Pageable pageable) {
        return ResponseEntity.ok(orderToolService.getAllOrderTools(pageable));
    }

    @GetMapping("/order/{orderId}")
    @ApiMessage("Get order tools by order ID")
    public ResponseEntity<ResPaginationDTO> getOrderToolsByOrderId(Pageable pageable, @PathVariable("orderId") String orderId) throws IdInvalidException {
        return ResponseEntity.ok(orderToolService.getOrderToolsByOrderId(pageable, orderId));
    }

    @GetMapping("/tool/{toolId}")
    @ApiMessage("Get order tools by order ID")
    public ResponseEntity<ResPaginationDTO> getOrderToolsByToolId(Pageable pageable,
                                                               @PathVariable("toolId")  long toolId) throws IdInvalidException {
        return ResponseEntity.ok(orderToolService.getOrderToolsByToolId(pageable, toolId));
    }
}
