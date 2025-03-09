package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.response.file.ResDownloadFile;
import com.dlk.ecommerce.domain.response.file.ResUploadFileDTO;
import com.dlk.ecommerce.service.FileService;
import com.dlk.ecommerce.util.error.StorageException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
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

    @PostMapping("/upload-multiple")
    public ResponseEntity<List<ResUploadFileDTO>> uploadMultipleFiles(
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("folderName") String folderName) {
        try {
            if (files.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            List<ResUploadFileDTO> response = fileService.handleUploadMultipleFiles(files, folderName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(String.valueOf(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



//    @GetMapping
//    public ResponseEntity<Resource> downloadFile(
//            @RequestParam("fileName") String fileName,
//            @RequestParam("folder") String folderName
//    ) throws URISyntaxException, FileNotFoundException, StorageException {
//        ResDownloadFile res = fileService.handleDownloadFile(fileName, folderName);
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + res.getResource().getFilename() + "\"")
//                .contentLength(res.getFileLength())
//                .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                .body(res.getResource());
//    }
}
