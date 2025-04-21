package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.address.ResCreateAddressDTO;
import com.dlk.ecommerce.domain.response.address.ResUpdateAddressDTO;
import com.dlk.ecommerce.service.AddressService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/addresses")
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/{id}")
    @ApiMessage("Get address by id")
    public ResponseEntity<ResUpdateAddressDTO> getById(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(addressService.getAddressByIdDTO(id));
    }

    @PostMapping
    @ApiMessage("Create a address")
    public ResponseEntity<ResCreateAddressDTO> create(@Valid @RequestBody Address address) throws IdInvalidException, JsonProcessingException {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(address));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a address")
    public ResponseEntity<ResUpdateAddressDTO> update(@PathVariable("id") String id, @Valid @RequestBody Address address) throws IdInvalidException {
        return ResponseEntity.ok(addressService.updateAddress(address, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a address")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(addressService.deleteAddress(id));
    }

    @PatchMapping("{id}")
    @ApiMessage("Restore a address")
    public ResponseEntity<Void> restore(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(addressService.restoreAddress(id));
    }

    @GetMapping
    @ApiMessage("Get all addresses")
    public ResponseEntity<ResPaginationDTO> getAllAddress(
            Pageable pageable
    ) {
        return ResponseEntity.ok(addressService.getAllAddress(pageable));
    }

    @GetMapping("/user-address/{id}")
    @ApiMessage("Get user address by user ID")
    public ResponseEntity<ResPaginationDTO> getUserAddress(
            Pageable pageable,
            @PathVariable("id") String userId
    ) throws IdInvalidException {
        return ResponseEntity.ok(addressService.getAddressByUserId(pageable, userId));
    }
}
