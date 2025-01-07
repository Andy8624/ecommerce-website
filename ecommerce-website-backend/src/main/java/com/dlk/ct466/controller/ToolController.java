package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.Tool;
import com.dlk.ct466.domain.request.tool.ReqToolDTO;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.tool.ResCreateToolDTO;
import com.dlk.ct466.domain.response.tool.ResToolDTO;
import com.dlk.ct466.domain.response.tool.ResUpdateToolDTO;
import com.dlk.ct466.service.ToolService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
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
    public ResponseEntity<ResCreateToolDTO> create(@Valid @RequestBody ReqToolDTO tool) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(toolService.createTool(tool));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a tool")
    public ResponseEntity<ResUpdateToolDTO> update(@PathVariable("id") long id, @Valid @RequestBody ReqToolDTO tool) throws IdInvalidException {
        return ResponseEntity.ok(toolService.updateTool(tool, id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a tool")
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
            Pageable pageable
    ) {
        return ResponseEntity.ok(toolService.getAllTool(pageable));
    }

    @GetMapping("/user-tools/{id}")
    @ApiMessage("Get tool owner by user")
    public ResponseEntity<ResPaginationDTO> getByUserId(
            Pageable pageable,
            @PathVariable("id") String id
    ) throws IdInvalidException {
        return ResponseEntity.ok(toolService.getToolByUserId(pageable, id));
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

}
