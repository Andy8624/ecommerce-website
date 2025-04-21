import os
import numpy as np
import faiss
import torch
import logging
import base64
import httpx
import asyncio
import json
from PIL import Image
from io import BytesIO
from transformers import AutoModel, AutoImageProcessor

logging.basicConfig(level=logging.DEBUG)

class ImageSearchService:
    def __init__(self):
        # Khởi tạo tên mô hình
        self.model_name = "google/siglip2-base-patch16-224"
        
        # Tải mô hình và processor
        self.model = AutoModel.from_pretrained(self.model_name, torch_dtype=torch.float32).eval()
        self.processor = AutoImageProcessor.from_pretrained(self.model_name, use_fast=True)
        
        # Tạo chỉ mục FAISS
        # self.index = self._build_index()

    def _extract_features(self, image: Image.Image) -> np.ndarray:
        """Trích xuất đặc trưng của hình ảnh, trả về vector 768 chiều"""
        inputs = self.processor(images=image, return_tensors="pt")
        with torch.no_grad():
            features = self.model.get_image_features(inputs.pixel_values)
        vector = features.cpu().numpy().flatten()
        assert vector.shape[0] == 768, f"Vector phải có 768 chiều, nhưng nhận {vector.shape[0]}."
        # logging.debug("Vector {}", vector)
        return vector

    # HAM NAY KHONG SU DUNG (CHI DE TEST MO HINH)
    async def search_similar_images(self, image_content: bytes):
        """Tìm tất cả ảnh có khoảng cách < 150 từ chỉ mục FAISS"""
        query_image = Image.open(BytesIO(image_content)).convert("RGB")
        query_vector = self._extract_features(query_image)

        # Tìm kiếm với số lượng tối đa (nếu dữ liệu lớn có thể dùng k = 1000 hoặc lớn hơn)
        D, I = self.index.search(np.array([query_vector]), k=50)

        product_images_dir = "app/assets/product_images"
        image_files = os.listdir(product_images_dir)
        
        # Chỉ lấy ảnh có khoảng cách < 100
        results = [
            {"image_path": os.path.join(product_images_dir, image_files[I[0][i]]), "distance": float(D[0][i])}
            for i in range(len(I[0])) if D[0][i] < 100 and I[0][i] != -1
        ]

        logging.debug(f"Tìm thấy {len(results)} hình ảnh tương tự với khoảng cách < 100.")
        return results

    def calculate_distance(self, vector1: np.ndarray, vector2: np.ndarray) -> float:
        """Tính khoảng cách Euclidean giữa hai vector đặc trưng"""
        assert vector1.shape == vector2.shape, "Hai vector phải có cùng kích thước."
        distance = np.linalg.norm(vector1 - vector2)  # Tính L2 Distance (Euclidean Distance)
        logging.debug(f"Khoảng cách giữa hai ảnh: {distance}")
        return distance

    def base64_to_floats(self, base64_str):
        """Giải mã base64 và chuyển thành mảng số thực"""
        try:
            decoded = base64.b64decode(base64_str)
            float_array = np.frombuffer(decoded, dtype=np.float32)
            return float_array
        except Exception as e:
            raise ValueError(f"Lỗi chuyển đổi base64: {str(e)}")
        
    async def search_similar_products_api(self, image_content: bytes):
        """Tìm sản phẩm tương tự dựa trên ảnh người dùng tải lên, sử dụng API (httpx)."""
        try:
            query_image = Image.open(BytesIO(image_content)).convert("RGB")
            query_vector = self._extract_features(query_image)
        except Exception as e:
            logging.error(f"❌ Lỗi xử lý ảnh tải lên: {e}")
            return []

        api_url = "http://host.docker.internal:8080/api/v1/image-tools"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(api_url)
                response.raise_for_status()
                image_data = response.json()

                if not isinstance(image_data, dict) or "data" not in image_data or not isinstance(image_data["data"], list):
                    logging.warning("⚠️ API trả về dữ liệu không hợp lệ!")
                    return []
            except httpx.HTTPStatusError as http_err:
                logging.error(f"❌ Lỗi HTTP từ API: {http_err.response.status_code}")
                return []
            except Exception as e:
                logging.error(f"❌ Lỗi gọi API: {e}")
                return []

        product_distances = {}

        for item in image_data["data"]:
            try:
                image_id = item.get("imageId", "unknown")
                tool_id = item.get("toolId", "unknown")
                feature_vector_base64 = item.get("featureVector")

                if not feature_vector_base64:
                    logging.warning(f"⚠️ Bỏ qua ảnh {image_id} vì thiếu featureVector")
                    continue

                feature_vector = self.base64_to_floats(feature_vector_base64)
                assert feature_vector.shape[0] == 768, f"Feature vector có kích thước sai: {feature_vector.shape[0]}"
                logging.debug(f"Vector từ API (toolId={tool_id}): {feature_vector[:5]}...") 
                distance = self.calculate_distance(query_vector, feature_vector)

                if tool_id not in product_distances:
                    product_distances[tool_id] = {"distances": [], "image_ids": []}

                product_distances[tool_id]["distances"].append(distance)
                product_distances[tool_id]["image_ids"].append(image_id)

                logging.debug(f"📌 ImageId: {image_id}, ToolId: {tool_id}, Distance: {distance}")
                logging.debug("-" * 50)
            except Exception as e:
                logging.error(f"❌ Lỗi xử lý ảnh {item.get('imageId', 'unknown')}: {e}")

        results = []

        for tool_id, data in product_distances.items():
            try:
                distances = data.get("distances", [])
                avg_distance = float(np.mean(distances)) if distances else float('inf')

                results.append({
                    "toolId": tool_id,
                    "avgDistance": avg_distance,
                    "imageIds": data.get("image_ids", [])
                })
            except Exception as e:  
                logging.error(f"❌ Lỗi tính toán avgDistance cho toolId={tool_id}: {e}")

        results.sort(key=lambda x: x["avgDistance"])

        return results
