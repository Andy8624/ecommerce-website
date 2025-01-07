package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.RolePermission;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.rolePermission.ResRolePermissionDTO;
import com.dlk.ct466.service.RolePermissionService;
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
@RequestMapping("/api/v1/roles-permissions")
public class RolePermissionController {
    private final RolePermissionService rolePermissionService;

    @GetMapping("/{id}")
    @ApiMessage("Get role-permission by id")
    public ResponseEntity<ResRolePermissionDTO> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(rolePermissionService.fetchByIdDTO(id));
    }

    @PostMapping
    @ApiMessage("Create a role-permission")
    public ResponseEntity<RolePermission> create(@Valid @RequestBody RolePermission rolePermission) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(rolePermissionService.createRolePermission(rolePermission));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a role-permission")
    public ResponseEntity<RolePermission> update(@PathVariable("id") long id, @Valid @RequestBody RolePermission rolePermission) throws IdInvalidException {
        return ResponseEntity.ok(rolePermissionService.update(rolePermission, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a role-permission")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(rolePermissionService.delete(id));
    }

    @PatchMapping("/{id}")
    @ApiMessage("Restore a role-permission")
    public ResponseEntity<Void> restore(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(rolePermissionService.restore(id));
    }

    @GetMapping
    @ApiMessage("Get all role-permissions")
    public ResponseEntity<ResPaginationDTO> getAllRolePermissions(Pageable pageable) {
        return ResponseEntity.ok(rolePermissionService.getAllRolePermissions(pageable));
    }

    @GetMapping("/role-owner/{id}")
    @ApiMessage("Get role-permissions by roleId")
    public ResponseEntity<ResPaginationDTO> getPermissionOfRole(
            @PathVariable("id") long id,
            Pageable pageable
    ) {
        return ResponseEntity.ok(rolePermissionService.getPermissionsByRoleIdDTO(id, pageable));
    }
}
