import axios from './axios-customize';

export const uploadFile = async (file, folderName) => {
    try {
        // Tạo formData để gửi file và thông tin folder
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folderName);

        // Gọi API để upload file
        const response = await axios.post('/api/v1/files', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        // Kiểm tra kết quả trả về từ backend
        if (response.data && response.data.fileName) {
            // Trả về tên file được lưu ở server (sẽ lưu vào imageUrl của sản phẩm)
            return response.data.fileName;
        } else {
            throw new Error("File upload failed!");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export const uploadMultipleFiles = async (files, folderName, toolId) => {
    try {
        const formData = new FormData();

        // Thêm từng file vào FormData
        files.forEach((file) => {
            formData.append("files", file);
        });

        // 🛠️ Thêm folderName dưới dạng `append()`
        formData.append("folderName", folderName);

        // 🛠️ Thêm toolId dưới dạng `append()
        formData.append("toolId", toolId.toString());

        // Gửi request với `multipart/form-data`
        const response = await axios.post("/api/v1/files/upload-multiple", formData);


        console.log(response);
        // if (response.data && Array.isArray(response.data)) {
        //     return response.data.map(file => file.fileName);
        // } else {
        //     throw new Error("Multiple file upload failed!");
        // }
    } catch (error) {
        console.error("Error uploading multiple files:", error);
        throw error;
    }
};
