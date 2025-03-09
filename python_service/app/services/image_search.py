import os
import numpy as np
import faiss
import torch
import logging
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
        self.index = self._build_index()

    def _extract_features(self, image: Image.Image) -> np.ndarray:
        """Trích xuất đặc trưng của hình ảnh, trả về vector 768 chiều"""
        inputs = self.processor(images=image, return_tensors="pt")
        with torch.no_grad():
            features = self.model.get_image_features(inputs.pixel_values)
        vector = features.cpu().numpy().flatten()
        assert vector.shape[0] == 768, f"Vector phải có 768 chiều, nhưng nhận {vector.shape[0]}."
        logging.debug("Vector {}", vector)
        return vector

    def _build_index(self):
        """Tạo chỉ mục FAISS từ các ảnh trong thư mục sản phẩm"""
        index = faiss.IndexFlatL2(768)
        product_images_dir = "app/assets/product_images"

        for filename in os.listdir(product_images_dir):
            if filename.endswith((".jpg", ".png")):
                image_path = os.path.join(product_images_dir, filename)
                image = Image.open(image_path).convert("RGB")
                image_vector = self._extract_features(image)
                index.add(np.array([image_vector]))

        logging.debug("FAISS index đã được xây dựng với tất cả ảnh sản phẩm.")
        logging.debug("Index {}", index)
        return index

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
