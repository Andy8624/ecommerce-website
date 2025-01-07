package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.Permission;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.service.PermissionService;
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
@RequestMapping("/api/v1/permissions")
public class PermissionController {
    private final PermissionService permissionService;


    @GetMapping("/{id}")
    @ApiMessage("Get permission by id")
    public ResponseEntity<Permission> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(permissionService.fetchById(id));
    }

    @PostMapping
    @ApiMessage("Create a permission")
    public ResponseEntity<Permission> create(@Valid @RequestBody Permission permission) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(permissionService.createPermission(permission));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a permission")
    public ResponseEntity<Permission> update(@PathVariable("id") long id, @Valid @RequestBody Permission permission) throws IdInvalidException {
        return ResponseEntity.ok(permissionService.update(permission, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a permission")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(permissionService.delete(id));
    }

    @PatchMapping("{id}")
    @ApiMessage("Restore a permission")
    public ResponseEntity<Void> restore(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(permissionService.restore(id));
    }

    @GetMapping
    @ApiMessage("Get all permissions")
    public ResponseEntity<ResPaginationDTO> getAllPermission(
            Pageable pageable
    ) {
        return ResponseEntity.ok(permissionService.getAllPermission(pageable));
    }

}
