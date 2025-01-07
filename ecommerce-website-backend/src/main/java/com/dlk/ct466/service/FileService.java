package com.dlk.ct466.service;

import com.dlk.ct466.domain.response.file.ResDownloadFile;
import com.dlk.ct466.domain.response.file.ResUploadFileDTO;
import com.dlk.ct466.util.error.StorageException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    @Value("${dlk.upload-file.base-uri}")
    private String baseUri;

    public ResUploadFileDTO handleUploadFile(MultipartFile file, String folderName) throws URISyntaxException, IOException, StorageException {
        // check valid file
        checkValidFile(file);

        // tạo thư mục nếu chưa tồn tại
        createDirectory(baseUri + folderName);

        // lưu file
        String fileName = store(file, folderName);

        return new ResUploadFileDTO(fileName, Instant.now());
    }

    public void createDirectory(String folderName) throws URISyntaxException {
        // tạo thư mục nếu chưa tồn tại
        URI uri = new URI(folderName);
        Path path = Paths.get(uri);
        File tmpFolder = new File(path.toString());
        if (!tmpFolder.isDirectory()) {
            try {
                Files.createDirectory(tmpFolder.toPath());
                System.out.println("Created folder successful , Folder path:  " + tmpFolder.toPath());
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("Folder existed");
        }
    }

    public String store(MultipartFile file, String folderName) throws URISyntaxException, IOException {
        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();

        URI uri = new URI(baseUri + folderName + "/" + fileName);
        Path path = Paths.get(uri);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
        }

        return fileName;
    }

    public Boolean checkValidFile(MultipartFile file) throws StorageException {
        // kiểm tra rỗng
        if (file.isEmpty()) {
            throw new StorageException("File is empty...");
        }

        // kiểm ra extension file
        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "webp", "mp4");

        boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));
        if (!isValid) {
            throw new StorageException("File extension is not valid... Only support " + allowedExtensions);
        }

        return true;
    }


    public ResDownloadFile handleDownloadFile(String fileName, String folder) throws StorageException, FileNotFoundException,
            URISyntaxException {
        if (fileName == null || folder == null) {
            throw new StorageException("File name or folder name is null...");
        }

        long fileLength = getFileLength(fileName, folder);
        if (fileLength == 0) {
            throw new StorageException("File not found...");
        }

        InputStreamResource resource = getResource(fileName, folder);
        return new ResDownloadFile(resource, fileLength);
    }

    public long getFileLength(String fileName, String folder) throws URISyntaxException {
        URI uri = new URI(baseUri + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File tmpFolder = new File(path.toString());

        if (!tmpFolder.exists() || tmpFolder.isDirectory()) {
            return 0;
        }

        return tmpFolder.length();
    }

    public InputStreamResource getResource(String fileName, String folder) throws FileNotFoundException, URISyntaxException {
        URI uri = new URI(baseUri + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File file = new File(path.toString());
        return new InputStreamResource(new FileInputStream(file));
    }
}

























