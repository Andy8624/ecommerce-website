package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ImageTool;
import com.dlk.ecommerce.domain.response.imageTool.ImageToolDTO;
import com.dlk.ecommerce.repository.ImageToolRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageToolService {

    private final ImageToolRepository imageToolRepository;

    public ImageTool getImageToolById(long id) throws IdInvalidException {
        return imageToolRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("ImageTool with id: " + id + " not found"));
    }

    public List<ImageToolDTO> getAllImageTools() {
        List<ImageTool> imageTools = imageToolRepository.findAll();

        return imageTools.stream()
                .map(imageTool -> ImageToolDTO.builder()
                        .imageId(imageTool.getImageId())
                        .fileName(imageTool.getFileName())
                        .featureVector(imageTool.getFeatureVector())
                        .toolId(imageTool.getTool().getToolId())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ImageTool> getImageToolByToolId(Long toolId) {
        return imageToolRepository.findByTool_ToolId(toolId);
    }

    public ImageTool createImageTool(ImageTool imageTool) {
        return imageToolRepository.save(imageTool);
    }

    public ImageTool updateImageTool(long id, ImageTool updatedImageTool) throws IdInvalidException {
        ImageTool existingImageTool = getImageToolById(id);
        existingImageTool.setFileName(updatedImageTool.getFileName());
        existingImageTool.setTool(updatedImageTool.getTool());
        return imageToolRepository.save(existingImageTool);
    }

    public void deleteImageTool(long id) throws IdInvalidException {
        if (!imageToolRepository.existsById(id)) {
            throw new IdInvalidException("ImageTool with id: " + id + " not found");
        }
        imageToolRepository.deleteById(id);
    }


}
