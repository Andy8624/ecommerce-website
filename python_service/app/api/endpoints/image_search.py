# app/api/endpoints/image_search.py
from fastapi import APIRouter, File, UploadFile
from app.services.image_search import ImageSearchService
from PIL import Image
from io import BytesIO

router = APIRouter()
image_search_service = ImageSearchService()

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