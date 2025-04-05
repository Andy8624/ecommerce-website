import asyncio
import httpx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import logging


class ContentBasedFiltering:
    def __init__(self, cf_data_url="http://host.docker.internal:8080/api/v1/recommendation/cbf-data"):
        self.cf_data_url = cf_data_url

    async def fetch_cbf_data(self):
        """
        Gọi API để lấy dữ liệu CBF (bao gồm thông tin sản phẩm).
        Trả về dữ liệu dưới dạng dictionary.
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.cf_data_url)
                response.raise_for_status()
                return response.json()["data"]
            except Exception as e:
                print(f"Error fetching CBF data: {e}")
                return []

    def calculate_similarity(self, product_data):
        """
        Tính toán sự tương đồng giữa các sản phẩm dựa trên tên, mô tả, và các thông tin khác.
        Sử dụng TF-IDF vectorizer để chuyển mô tả sản phẩm thành vector và tính toán cosine similarity.
        """
        # Tạo một danh sách các mô tả sản phẩm kết hợp với tên và thương hiệu
        descriptions = [
            f"{product['name']} {product['description']} {product['brand']} {product['toolType']}" 
            for product in product_data
        ]
        
        # Sử dụng TF-IDF Vectorizer để chuyển đổi mô tả thành vector
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(descriptions)
        
        # Tính toán cosine similarity giữa các sản phẩm
        similarity_matrix = cosine_similarity(tfidf_matrix)
        
        return similarity_matrix

    async def get_recommendations(self, user_id: str, top_k=3):
        """
        Trả về danh sách sản phẩm gợi ý cho user_id dựa trên CBF.
        """
        cbf_data = await self.fetch_cbf_data()

        if not cbf_data:
            return []

        # Tính toán sự tương đồng giữa các sản phẩm
        similarity_matrix = self.calculate_similarity(cbf_data)

        # Từ user_id lấy ra tối đa 5 sản phẩm tương tác gần nhất theo createdat
        interacted_products_id = [120, 231, 252, 111, 101]
        interacted_products = [product for product in cbf_data if product['toolId'] in interacted_products_id]

        # Danh sách chung để lưu tất cả các sản phẩm gợi ý
        all_recommended_products = []
        seen_tool_ids = set()  # Tập để theo dõi các toolId đã thêm vào

        for product in interacted_products:
            product_idx = cbf_data.index(product)
            similar_scores = similarity_matrix[product_idx]
            similar_indices = np.argsort(similar_scores)[::-1][1:4]  # Lấy 4 sản phẩm tương tự trừ chính nó
            
            for i in similar_indices:
                tool_id = str(cbf_data[i]['toolId'])
                if tool_id not in seen_tool_ids:
                    all_recommended_products.append({
                        'toolId': tool_id,
                        'score': similar_scores[i]
                    })
                    seen_tool_ids.add(tool_id)  # Thêm toolId vào tập

        logging.debug(f"CBF recommendations for user {user_id}: {all_recommended_products}")
        
        # Trả về tất cả các sản phẩm gợi ý sau khi vòng lặp kết thúc
        return all_recommended_products

