package com.dlk.ecommerce.domain.response.imageTool;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;


@Data
@AllArgsConstructor
@Builder
public class ImageToolDTO {
    long imageId;
    String fileName;
    byte[] featureVector;
    Long toolId;
}
