package com.dlk.ct466.controller;

import com.dlk.ct466.domain.response.file.ResDownloadFile;
import com.dlk.ct466.domain.response.file.ResUploadFileDTO;
import com.dlk.ct466.service.FileService;
import com.dlk.ct466.util.error.StorageException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @Value("${dlk.upload-file.base-uri}")
    private String baseUri;

    @PostMapping
    public ResponseEntity<ResUploadFileDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folderName
    ) throws URISyntaxException, IOException, StorageException {
        return ResponseEntity.ok().body(fileService.handleUploadFile(file, folderName));
    }

    @GetMapping
    public ResponseEntity<Resource> downloadFile(
            @RequestParam("fileName") String fileName,
            @RequestParam("folder") String folderName
    ) throws URISyntaxException, FileNotFoundException, StorageException {
        ResDownloadFile res = fileService.handleDownloadFile(fileName, folderName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + res.getResource().getFilename() + "\"")
                .contentLength(res.getFileLength())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(res.getResource());
    }
}
