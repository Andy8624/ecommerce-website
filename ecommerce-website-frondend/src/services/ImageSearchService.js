import axios from "axios";
import { setImageSearchError, setImageSearchResults, startImageSearch } from "../redux/slices/imageSearchSlice";
import { message } from "antd";

// const API_BASE_URL = "http://localhost:8000/python/api/v1";


export const callSearchProductByImage = async (file, dispatch) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        dispatch(startImageSearch());
        const response = await axios.post("http://localhost:8000/python/api/v1/image-search-api", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        dispatch(setImageSearchResults(response?.data?.results));
        message.success("Tìm kiếm ảnh thành công!");
    } catch (error) {
        dispatch(setImageSearchError(error.message));
        message.error("Lỗi khi tìm kiếm ảnh.");
        console.error("API error:", error);
    }
};