package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.request.tool.ReqToolDTO;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.tool.ResCreateToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResUpdateToolDTO;
import com.dlk.ecommerce.service.ToolService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/v1/tools")
public class ToolController {
    private final ToolService toolService;

    @GetMapping("/{id}")
    @ApiMessage("Get tool by id")
    public ResponseEntity<ResToolDTO> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(toolService.getToolByIdDTO(id));
    }

    @PostMapping
    @ApiMessage("Create a tool")
    public ResponseEntity<ResCreateToolDTO> create(@Valid @RequestBody ReqToolDTO tool) throws IdInvalidException, JsonProcessingException {
        return ResponseEntity.status(HttpStatus.CREATED).body(toolService.createTool(tool));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a tool")
    public ResponseEntity<ResUpdateToolDTO> update(@PathVariable("id") long id, @Valid @RequestBody ReqToolDTO tool) throws IdInvalidException {
        return ResponseEntity.ok(toolService.updateTool(tool, id));
    }

    @DeleteMapping("/hard-delete/{id}")
    @ApiMessage("HARD Delete a tool")
    public ResponseEntity<Void> hardDelete(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(toolService.hardDeleteTool(id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("SOFT Delete a tool")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(toolService.deleteTool(id));
    }

    @PatchMapping("{id}")
    @ApiMessage("Restore a tool")
    public ResponseEntity<Void> restore(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(toolService.restoreTool(id));
    }

    @GetMapping
    @ApiMessage("Get all tools")
    public ResponseEntity<ResPaginationDTO> getAllTool(
            @Filter Specification<Tool> spec,
            Pageable pageable
    ) {
        return ResponseEntity.ok(toolService.getAllTool(spec, pageable));
    }

    @GetMapping("/user-tools/{id}")
    @ApiMessage("Get tool owner by user")
    public ResponseEntity<ResPaginationDTO> getByUserId(
            @Filter Specification<Tool> spec,
            Pageable pageable,
            @PathVariable("id") String id
    ) throws IdInvalidException {
        return ResponseEntity.ok(toolService.getToolByUserId(spec, pageable, id));
    }

    @GetMapping("/type-tools/{id}")
    @ApiMessage("Get tool by tool type id")
    public ResponseEntity<ResPaginationDTO> getByToolTypeId(
            Pageable pageable,
            @PathVariable("id") long id
    ) throws IdInvalidException {
        return ResponseEntity.ok(toolService.getToolByTypeId(pageable, id));
    }

    @GetMapping("/name")
    @ApiMessage("Get tool by name")
    public ResponseEntity<ResPaginationDTO> getByName(
            @Filter Specification<Tool> spec,
            Pageable pageable
    ) {
        return ResponseEntity.ok(toolService.getToolByName(spec, pageable));
    }

    @PostMapping("/toolIds")
    @ApiMessage("Get tools by list of IDs")
    public ResponseEntity<List<ResToolDTO>> getToolsByIds(@RequestBody List<Long> toolIds) {
        return ResponseEntity.ok(toolService.getToolsByIds(toolIds));
    }

    @GetMapping("/stock/{toolId}")
    @ApiMessage("Get stock product")
    public ResponseEntity<Integer> getStockByToolId(@PathVariable long toolId) {
        return ResponseEntity.status(HttpStatus.OK).body(toolService.getStockByToolId(toolId));
    }
}
