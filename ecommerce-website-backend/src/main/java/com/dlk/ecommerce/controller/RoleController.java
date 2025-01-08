package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.Role;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.service.RoleService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/roles")
public class RoleController {
    private final RoleService roleService;

    @GetMapping("/{id}")
    @ApiMessage("Get role by id")
    public ResponseEntity<Role> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(roleService.fetchById(id));
    }

    @PostMapping
    @ApiMessage("Create a role")
    public ResponseEntity<Role> create(@Valid @RequestBody Role role) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.createRole(role));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a role")
    public ResponseEntity<Role> update(@PathVariable("id") long id, @Valid @RequestBody Role role) throws IdInvalidException {
        return ResponseEntity.ok(roleService.update(role, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a role")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(roleService.delete(id));
    }

    @PatchMapping("/{id}")
    @ApiMessage("Restore a role")
    public ResponseEntity<Void> restore(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(roleService.restore(id));
    }

    @GetMapping
    @ApiMessage("Get all roles")
    public ResponseEntity<ResPaginationDTO> getAllRoles(Pageable pageable) {
        return ResponseEntity.ok(roleService.getAllRoles(pageable));
    }
}
