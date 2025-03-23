package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.ImageTool;
import com.dlk.ecommerce.domain.response.imageTool.ImageToolDTO;
import com.dlk.ecommerce.service.ImageToolService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/image-tools")
public class ImageToolController {
    private final ImageToolService imageToolService;

    @GetMapping("/{id}")
    @ApiMessage("Get image tool by id")
    public ResponseEntity<ImageTool> getById(@PathVariable("id") long id) throws IdInvalidException {
        return ResponseEntity.ok(imageToolService.getImageToolById(id));
    }

    @GetMapping
    @ApiMessage("Get all images for tools")
    public ResponseEntity<List<ImageToolDTO>> getAll() {
        return ResponseEntity.ok(imageToolService.getAllImageTools());
    }

    @GetMapping("/tool/{toolId}")
    @ApiMessage("Get All Image By ToolID")
    public ResponseEntity<List<ImageTool>> getImageByToolID(@PathVariable("toolId") Long id) {
        return ResponseEntity.ok(imageToolService.getImageToolByToolId(id));
    }

    @PostMapping
    @ApiMessage("Create a new image for tool")
    public ResponseEntity<ImageTool> create(@Valid @RequestBody ImageTool imageTool) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imageToolService.createImageTool(imageTool));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update an existing image for tool")
    public ResponseEntity<ImageTool> update(@PathVariable("id") long id, @Valid @RequestBody ImageTool imageTool) throws IdInvalidException {
        return ResponseEntity.ok(imageToolService.updateImageTool(id, imageTool));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete an image tool permanently")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        imageToolService.deleteImageTool(id);
        return ResponseEntity.noContent().build();
    }
}
