package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.ToolType;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.service.ToolTypeService;
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
@RequestMapping("api/v1/tooltypes")
public class ToolTypeController {
    private final ToolTypeService toolTypeService;

    @GetMapping("/{id}")
    @ApiMessage("Get tool type by id")
    public ResponseEntity<ToolType> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(toolTypeService.getToolTypeById(id));
    }

    @PostMapping
    @ApiMessage("Create a tool type")
    public ResponseEntity<ToolType> create(@Valid @RequestBody ToolType toolType) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(toolTypeService.createToolType(toolType));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a tool type")
    public ResponseEntity<ToolType> update(@PathVariable("id") long id, @Valid @RequestBody ToolType toolType) throws IdInvalidException {
        return ResponseEntity.ok(toolTypeService.updateToolType(toolType, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a tool type success")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(toolTypeService.deleteToolType(id));
    }

    @PatchMapping("{id}")
    @ApiMessage("Restore a tool type success")
    public ResponseEntity<Void> restore(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(toolTypeService.restoreToolType(id));
    }

    @GetMapping
    @ApiMessage("Get all tooltypes")
    public ResponseEntity<ResPaginationDTO> getAllToolType(
            Pageable pageable
    ) {
        return ResponseEntity.ok(toolTypeService.getAllToolType(pageable));
    }
}
