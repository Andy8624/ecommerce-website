package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.request.ghn.*;
import com.dlk.ecommerce.domain.request.user.ReqCreateShop;
import com.dlk.ecommerce.service.GhnService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ghn")
@RequiredArgsConstructor
public class GhnController {
    private final GhnService ghnService;

    // Sử dụng API này để lấy danh sách các tỉnh/thành phố từ GHN API.
    @PostMapping("/provinces")
    @ApiMessage("Provinces retrieved successfully")
    public ResponseEntity<Object> getProvinces() {
        return ResponseEntity.ok(ghnService.getProvinces());
    }

    // Sử dụng API này để lấy danh sách các quận/huyện thuộc một tỉnh từ GHN API.
    @PostMapping("/districts/{provinceId}")
    @ApiMessage("Districts retrieved successfully")
    public ResponseEntity<Object> getDistricts(@PathVariable int provinceId) {
        return ResponseEntity.ok(ghnService.getDistricts(provinceId));
    }

    // Sử dụng API này để lấy danh sách các phường/xã thuộc một quận từ GHN API.
    @PostMapping("/wards/{districtId}")
    @ApiMessage("Wards retrieved successfully")
    public ResponseEntity<Object> getWards(@PathVariable int districtId) {
        return ResponseEntity.ok(ghnService.getWards(districtId));
    }

    // Sử dụng API này để tính phí vận chuyển.
    @PostMapping("/calculate-shipping-cost")
    @ApiMessage("Shipping cost calculated successfully")
    public ResponseEntity<Object> calculateShippingCost(@RequestBody CalculateShippingCostRequest data) {
        return ResponseEntity.ok(ghnService.calculateShippingCost(data));
    }

    // Sử dụng API này để tạo shop mới.
    @PostMapping("/shops")
    @ApiMessage("Shop created successfully")
    public ResponseEntity<Object> createShop(@RequestBody ReqCreateShop data) {
        return ResponseEntity.ok(ghnService.createShop(data));
    }

    // Sử dụng API này để lấy danh sách các shop đã tạo.
    @GetMapping("/shops")
    @ApiMessage("Shops retrieved successfully")
    public ResponseEntity<Object> getShops(@RequestBody Object data) {
        return ResponseEntity.ok(ghnService.getShops(data));
    }

    // Sử dụng API này để tạo đơn hàng
    @PostMapping("/orders")
    @ApiMessage("Order created successfully")
    public ResponseEntity<Object> createOrder(@RequestBody @Valid ReqCreateOrderGHN data) {
        return ResponseEntity.ok(ghnService.createOrder(data));
    }

    // Sử dụng API này để hủy đơn hàng
    @PostMapping("/orders/cancel-orders")
    @ApiMessage("Order canceled successfully")
    public ResponseEntity<Object> cancelOrder(@RequestBody Object data) {
        return ResponseEntity.ok(ghnService.cancelOrder(data));
    }

    // Sử dụng API này để trả lại hàng khi người gửi muốn hủy giao.
    @PostMapping("/orders/return-orders")
    @ApiMessage("Order returned successfully")
    public ResponseEntity<Object> returnOrder(@RequestBody Object data) {
        return ResponseEntity.ok(ghnService.returnOrder(data));
    }

    // Sử dụng API này để tính được thời gian dự kiến giao hàng tới người nhận.
    @PostMapping("/orders/delivery-time")
    @ApiMessage("Estimated delivery time calculated successfully")
    public ResponseEntity<Object> getEstimatedDeliveryTime(@RequestBody DeliveryTimeRequest data) {
        return ResponseEntity.ok(ghnService.getEstimatedDeliveryTime(data));
    }

    // Sử dụng API này để lấy thông tin chi tiết của một đơn hàng.
    @PostMapping("/orders/details")
    @ApiMessage("Order details retrieved successfully")
    public ResponseEntity<Object> getOrderDetails(@RequestBody Object data) {
        return ResponseEntity.ok(ghnService.getOrderDetails(data));
    }

    // Sử dụng API này để yêu cầu giao lại đơn hàng
    @PostMapping("/orders/re-delivery")
    @ApiMessage("Order redelivered successfully")
    public ResponseEntity<Object> reDeliveryOrder(@RequestBody Object data) {
        return ResponseEntity.ok(ghnService.reDeliveryOrder(data));
    }

    // API này sẽ trả về `province_id` từ tên tỉnh/thành phố
    @PostMapping("/provinces/id")
    @ApiMessage("Province ID retrieved successfully")
    public ResponseEntity<Integer> getProvinceIdByName(@RequestBody GetProvinceIDRequest request) {
            return ResponseEntity.ok(ghnService.getProvinceIdByName(request));
    }

    // API này sẽ trả về `district_id` từ tên tỉnh và tên quận
    @PostMapping("/districts/id")
    @ApiMessage("District ID retrieved successfully")
    public ResponseEntity<Integer> getDistrictIdByName(@RequestBody GetDistrictIDRequest request) {
        return ResponseEntity.ok(ghnService.getDistrictIdByName(request));
    }

    // API này sẽ trả về `ward_id` từ tên tỉnh, quận và phường/xã
    @PostMapping("/wards/id")
    @ApiMessage("Ward ID retrieved successfully")
    public ResponseEntity<Integer> getWardIdByName(@RequestBody GetWardIDRequest request) {
            return ResponseEntity.ok(ghnService.getWardIdByName(request));
    }
}
