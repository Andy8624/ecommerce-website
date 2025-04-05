package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ImageTool;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.response.file.ResUploadFileDTO;
import com.dlk.ecommerce.repository.ImageToolRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.error.StorageException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    @Value("${dlk.upload-file.base-uri}")
    private String baseUri;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    private final ImageToolService imageToolService;
    private final ToolService toolService;

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

    public void checkValidFile(MultipartFile file) throws StorageException {
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
    }

    // Upload 1 file
    public ResUploadFileDTO handleUploadFile(MultipartFile file, String folderName) throws URISyntaxException, IOException, StorageException {
        // check valid file
        checkValidFile(file);

        // tạo thư mục nếu chưa tồn tại
        createDirectory(baseUri + folderName);

        // lưu file
        String fileName = store(file, folderName);

        return new ResUploadFileDTO(fileName, Instant.now(), null);
    }

    // Upload nhiều file cùng một lúc
    public List<ResUploadFileDTO> handleUploadMultipleFiles(
            List<MultipartFile> files, String folderName, Long toolId, Boolean getVectorized
    ) throws URISyntaxException, IOException, StorageException, IdInvalidException {
        List<ResUploadFileDTO> uploadedFiles = new ArrayList<>();

        // Tạo thư mục nếu chưa tồn tại
        createDirectory(baseUri + folderName);

        for (MultipartFile file : files) {
            checkValidFile(file);
            String fileName = store(file, folderName);
            byte[] featureVector = null;
            // Gọi API Python để trích xuất đặc trưng
            if (getVectorized) {
                featureVector = extractFeatureFromPythonAPI(file);
                float[] convert = byteArrayToFloatArray(featureVector);
            }


            uploadedFiles.add(new ResUploadFileDTO(fileName, Instant.now(), featureVector));

            Tool tool = toolService.getToolById(toolId);
            ImageTool imageTool = new ImageTool().toBuilder()
                    .fileName(fileName)
                    .tool(tool)
                    .featureVector(featureVector)
                    .build();
            imageToolService.createImageTool(imageTool);
        }
        return uploadedFiles;
    }

    public boolean deleteFile(String folderName, String fileName) throws URISyntaxException, StorageException {
        URI uri = new URI(baseUri + folderName + "/" + fileName);
        Path path = Paths.get(uri);

        try {
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Lỗi khi xóa file: {}", fileName, e);
            throw new StorageException("Không thể xóa file: " + fileName);
        }
    }

    // Hàm gọi API Python để trích xuất đặc trưng
    private byte[] extractFeatureFromPythonAPI(MultipartFile file) {
        // Tạo URL của API Python
        String apiUrl = "http://localhost:8000/python/api/v1/extract-feature";

        // Tạo MultipartRequest để gửi file
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Gửi yêu cầu POST đến API Python và nhận kết quả
        ResponseEntity<Object> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                requestEntity,
                Object.class
        );

        // Chuyển đổi phản hồi thành JsonNode
        JsonNode jsonNode = objectMapper.convertValue(response.getBody(), JsonNode.class);

        // Truy xuất featureVector từ JsonNode
        JsonNode featureVectorNode = jsonNode.get("featureVector");

        // Chuyển JsonNode thành mảng số thực (float[])
        float[] featureVector = new float[featureVectorNode.size()];
        for (int i = 0; i < featureVectorNode.size(); i++) {
            featureVector[i] = featureVectorNode.get(i).floatValue();
        }

        // Chuyển mảng float[] thành mảng byte (BLOB)
        return convertFloatArrayToByteArray(featureVector);
    }

    // Chuyển từ float array thành byte array
    public static byte[] convertFloatArrayToByteArray(float[] featureVector) {
        ByteBuffer buffer = ByteBuffer.allocate(featureVector.length * 4); // 4 bytes per float
        buffer.order(ByteOrder.LITTLE_ENDIAN);  // Chỉ định byte order (LITTLE_ENDIAN)

        for (float f : featureVector) {
            buffer.putFloat(f); // Ghi giá trị float vào ByteBuffer
        }

        return buffer.array();  // Trả về mảng byte
    }

    // Chuyển từ byte array thành float array
    public static float[] byteArrayToFloatArray(byte[] byteArray) {
        int length = byteArray.length / 4;  // Mỗi float chiếm 4 byte
        float[] floatArray = new float[length];

        ByteBuffer buffer = ByteBuffer.wrap(byteArray);
        buffer.order(ByteOrder.LITTLE_ENDIAN);  // Đảm bảo thứ tự byte

        for (int i = 0; i < length; i++) {
            floatArray[i] = buffer.getFloat();  // Đọc 4 byte và chuyển thành float
        }

        return floatArray;
    }

//    public ResDownloadFile handleDownloadFile(String fileName, String folder) throws StorageException, FileNotFoundException,
//            URISyntaxException {
//        if (fileName == null || folder == null) {
//            throw new StorageException("File name or folder name is null...");
//        }
//
//        long fileLength = getFileLength(fileName, folder);
//        if (fileLength == 0) {
//            throw new StorageException("File not found...");
//        }
//
//        InputStreamResource resource = getResource(fileName, folder);
//        return new ResDownloadFile(resource, fileLength);
//    }

//    public long getFileLength(String fileName, String folder) throws URISyntaxException {
//        URI uri = new URI(baseUri + folder + "/" + fileName);
//        Path path = Paths.get(uri);
//
//        File tmpFolder = new File(path.toString());
//
//        if (!tmpFolder.exists() || tmpFolder.isDirectory()) {
//            return 0;
//        }
//
//        return tmpFolder.length();
//    }

//    public InputStreamResource getResource(String fileName, String folder) throws FileNotFoundException, URISyntaxException {
//        URI uri = new URI(baseUri + folder + "/" + fileName);
//        Path path = Paths.get(uri);
//
//        File file = new File(path.toString());
//        return new InputStreamResource(new FileInputStream(file));
//    }


}

