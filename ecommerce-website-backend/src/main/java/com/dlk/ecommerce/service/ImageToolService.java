package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ImageTool;
import com.dlk.ecommerce.repository.ImageToolRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageToolService {

    private final ImageToolRepository imageToolRepository;

    public ImageTool getImageToolById(long id) throws IdInvalidException {
        return imageToolRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("ImageTool with id: " + id + " not found"));
    }

    public List<ImageTool> getAllImageTools() {
        return imageToolRepository.findAll();
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
