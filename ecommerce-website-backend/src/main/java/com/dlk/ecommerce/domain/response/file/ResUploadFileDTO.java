package com.dlk.ecommerce.domain.response.file;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ResUploadFileDTO {
    private String fileName;
    private Instant uploadedAt;
    private byte[] featureVector;

}
