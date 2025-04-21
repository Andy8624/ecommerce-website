# app/api/endpoints/image_search.py
from fastapi import APIRouter, File, UploadFile
from app.services.image_search import ImageSearchService
from PIL import Image
from io import BytesIO
import numpy as np

router = APIRouter()
image_search_service = ImageSearchService()

# API nay khong su dung (chi de test)
@router.post("/image-search")
async def search_image(
        file: UploadFile = File(..., description="Hình ảnh sản phẩm cần tìm kiếm")
    ):
    image_content = await file.read()
    search_results = await image_search_service.search_similar_images(image_content)
    return {"filename": file.filename, "results": search_results}


# API để trích xuất đặc trưng từ ảnh
@router.post("/extract-feature")
async def extract_feature(
        file: UploadFile = File(..., description="Hình ảnh cần trích xuất đặc trưng")
    ):
    """Nhận ảnh và trả về đặc trưng (vector)"""
     # Đọc ảnh dưới dạng byte
    image_content = await file.read() 
     # Chuyển đổi ảnh thành RGB
    image = Image.open(BytesIO(image_content)).convert("RGB") 
     # Trích xuất đặc trưng từ ảnh
    feature_vector = image_search_service._extract_features(image) 
     # Trả về vector đặc trưng dưới dạng danh sách
    return {"filename": file.filename, "featureVector": feature_vector.tolist()} 

@router.post("/calculate-distance")
async def calculate_distance():
    """API tính khoảng cách giữa hai ảnh"""
    # Đọc ảnh 1
    base64_str1 = "eHqCvnBRgL4kQso+3i3iPh3U8T7A";

    base64_str2 = "hBIFPvyl0b5m9Bw/1NIpPvSIHz9QADQ";

    # Chuyển đổi base64 thành mảng float
    float_array1 = image_search_service.base64_to_floats(base64_str1)
    float_array2 = image_search_service.base64_to_floats(base64_str2)

    # Tính khoảng cách
    distance = image_search_service.calculate_distance(float_array1, float_array2)

    return {
        "distance": float(distance)
    }

@router.post("/image-search-api")
async def search_image_api(
        file: UploadFile = File(..., description="Hình ảnh sản phẩm cần tìm kiếm")
    ):
    image_content = await file.read()

    # Gọi API tìm kiếm
    search_results = await image_search_service.search_similar_products_api(image_content)

    # Chuyển đổi NumPy hoặc dữ liệu không thể JSON-encode
    def convert_result(result):
        if isinstance(result, np.ndarray):
            return result.tolist()  # Chuyển NumPy array thành danh sách
        elif isinstance(result, np.float32) or isinstance(result, np.float64):
            return float(result)  # Chuyển số float của NumPy thành float chuẩn
        return result  # Trả về giá trị bình thường nếu không phải NumPy

    # Áp dụng chuyển đổi cho từng kết quả
    search_results = [convert_result(r) for r in search_results]

    return {"filename": file.filename, "results": search_results}