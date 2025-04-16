package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.user.ReqCreateUser;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.user.ResCreateUserDTO;
import com.dlk.ecommerce.domain.response.user.ResUpdateUserDTO;
import com.dlk.ecommerce.domain.response.user.ResUserDTO;
import com.dlk.ecommerce.repository.UserRepository;
import com.dlk.ecommerce.service.GhnService;
import com.dlk.ecommerce.service.Impl.GhnServiceImpl;
import com.dlk.ecommerce.service.UserService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final GhnService ghnService;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/{id}")
    @ApiMessage("Get User by id")
    public ResponseEntity<ResUserDTO> getById(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(userService.getUserByIdDTO(id));
    }

    @PostMapping
    @ApiMessage("Create a user")
    public ResponseEntity<ResCreateUserDTO> create(@Valid @RequestBody ReqCreateUser user) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a user")
    public ResponseEntity<ResUpdateUserDTO> update(@PathVariable("id") String id, @RequestBody User user) throws IdInvalidException {
        log.info(user.getImageUrl());
        return ResponseEntity.ok(userService.updateUser(user, id));
    }

    @PostMapping("/user-role/{userId}")
    @ApiMessage("Update user role")
    public ResponseEntity<Void> updateUserRole(@PathVariable String userId, @RequestBody User user) throws IdInvalidException {
        return ResponseEntity.ok(userService.updateUserRole(userId, user));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @PatchMapping("/{id}")
    @ApiMessage("Restore a user")
    public ResponseEntity<Void> restore(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(userService.restoreUser(id));
    }

    @GetMapping
    @ApiMessage("Get all users")
    public ResponseEntity<ResPaginationDTO> getAllUser(
            Pageable pageable
    ) {
        return ResponseEntity.ok(userService.getAllUser(pageable));
    }

    @PostMapping("/shop")
    @ApiMessage("Create shop info")
    public ResponseEntity<User> createShopInfo(@RequestBody User user) throws IdInvalidException,
            JsonProcessingException {
        return ResponseEntity.ok(ghnService.createShopInfo(user));
    }

    @PutMapping("/tax-identity/{userId}")
    @ApiMessage("Update user tax-identity number")
    public ResponseEntity<User> updateUserTaxIdentityInfo(
            @PathVariable("userId") String userId,
            @RequestBody User user) throws IdInvalidException {
        return ResponseEntity.ok(userService.updateUserTaxNumber(user, userId));
    }

    @GetMapping("/check-phone/{phone}/{userId}")
    @ApiMessage("Check phone number exists")
    public ResponseEntity<Boolean> checkPhoneExists(@PathVariable("phone") String phone, @PathVariable("userId") String userId) {
        return ResponseEntity.ok(userService.checkPhoneExists(phone, userId));
    }

    @PostMapping("/check-shopname/{shopname}")
    @ApiMessage("Check shop name exists")
    public ResponseEntity<Boolean> checkShopNameExists(@PathVariable String shopname) {
        return ResponseEntity.ok(userService.checkShopNameExists(shopname));
    }

    @PatchMapping("/patch/{id}")
    @ApiMessage("Update a user (PATCH)")
    public ResponseEntity<ResUpdateUserDTO> partialUpdateUser(
            @PathVariable("id") String id,
            @RequestBody ResUpdateUserDTO reqUpdateUser) throws IdInvalidException {
        return ResponseEntity.ok(userService.partialUpdateUser(id, reqUpdateUser));
    }

    @PostMapping("/shipping-method/{userId}")
    @ApiMessage("Update shipping method")
    public ResponseEntity<Map<String, Object>> updateShippingMethod(
            @PathVariable String userId,
            @RequestBody Map<String, Object> shippingMethod
    ) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userService.updateShippingMethod(userId, shippingMethod));
    }

    @ApiMessage("Get shipping method")
    @GetMapping("/shipping-method/{userId}")
    public ResponseEntity<Map<String, Object>> getShippingMethod(@PathVariable String userId) throws IdInvalidException {
        return ResponseEntity.ok(userService.getShippingMethodService(userId));
    }

    @GetMapping("/total-products/{userId}")
    @ApiMessage("Get total products")
    public ResponseEntity<Long> getTotalProducts(@PathVariable String userId) throws IdInvalidException {
        return ResponseEntity.ok(userService.getTotalProducts(userId));
    }

    @GetMapping("/total-sold-products/{userId}")
    @ApiMessage("Get total sold products")
    public ResponseEntity<Long> getTotalSoldProducts(@PathVariable String userId) throws IdInvalidException {
        return ResponseEntity.ok(userService.getTotalSoldProducts(userId));
    }

    @GetMapping("/total-rated-products/{userId}")
    @ApiMessage("Get total rated products")
    public ResponseEntity<Long> getTotalRatedProducts(@PathVariable String userId) throws IdInvalidException {
        return ResponseEntity.ok(userService.getTotalRatedProducts(userId));
    }
}
