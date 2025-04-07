import asyncio
import httpx
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import logging
from transformers import BertTokenizer, BertModel
import torch

class ContentBasedFiltering:
    def __init__(self,
                    cf_data_url="http://host.docker.internal:8080/api/v1/recommendation/cbf-data",
                    bert_model_name='bert-base-uncased'
                ):
        # --- Khởi tạo ---
        self.cf_data_url = cf_data_url  # URL của API lấy dữ liệu sản phẩm
        self.tokenizer = BertTokenizer.from_pretrained(bert_model_name)  # Tokenizer của BERT để xử lý văn bản
        self.model = BertModel.from_pretrained(bert_model_name)  # Mô hình BERT đã được huấn luyện trước
        self.model.eval()  # Chuyển mô hình sang chế độ đánh giá (không huấn luyện)
        self.product_data_cache = None  # Bộ nhớ cache cho dữ liệu sản phẩm
        self.product_embeddings_cache = None  # Bộ nhớ cache cho embeddings của sản phẩm

    # --- Tải dữ liệu và tạo embeddings ---
    async def _load_cbf_data_and_embeddings(self):
        """
        Tải dữ liệu sản phẩm từ API và tạo embeddings BERT cho chúng (nếu chưa có trong cache).
        """
        if self.product_data_cache is None:
            self.product_data_cache = await self.fetch_cbf_data()  # Lấy dữ liệu sản phẩm
            if not self.product_data_cache:
                return False

            # Tạo chuỗi mô tả kết hợp từ các thuộc tính của sản phẩm
            descriptions = [
                f"Tên sản phẩm: {product['name']}. Mô tả sản phẩm:{product['description']}. Thương hiệu: {product['brand']}. Loại sản phẩm: {product['toolType']}"
                for product in self.product_data_cache
            ]
            self.product_embeddings_cache = self.get_bert_embeddings(descriptions)  # Tạo embeddings BERT
        return True

    async def fetch_cbf_data(self):
        """
        Gọi API để lấy dữ liệu sản phẩm (dưới dạng dictionary).
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.cf_data_url)
                response.raise_for_status()  # Báo lỗi nếu request không thành công
                return response.json()["data"]
            except Exception as e:
                print(f"Lỗi khi lấy dữ liệu CBF: {e}")
                return []

    """
        Chuyển đổi danh sách các đoạn văn bản (mô tả sản phẩm) thành embeddings bằng mô hình BERT.
    """
    def get_bert_embeddings(self, descriptions):
        # Token hóa các mô tả sản phẩm
        # max_length = 512 là độ dài tối đa của chuỗi đầu vào cho BERT
        # Padding = true và truncation = true để đảm bảo tất cả các chuỗi đều có cùng độ dài
        # return_tensors = 'pt' để chuyển đổi thành tensor PyTorch
        encoded_input = self.tokenizer(descriptions, padding=True, truncation=True, return_tensors='pt')

        with torch.no_grad():  # Tắt tính toán gradient để tăng tốc độ
            outputs = self.model(**encoded_input)  # Truyền dữ liệu qua mô hình BERT

        # Lấy embedding của lớp cuối cùng của token [CLS] làm biểu diễn cho toàn bộ chuỗi
        embeddings = outputs.pooler_output.numpy()
        return embeddings
    
    """
        Tính toán ma trận độ tương đồng cosine giữa các embeddings sản phẩm.
    """
    def calculate_similarity(self, embeddings):
        
        similarity_matrix = cosine_similarity(embeddings)
        return similarity_matrix

    """
        Tìm các sản phẩm tương đồng nhất với sản phẩm có toolId cho trước.
        Trả về danh sách các sản phẩm tương đồng (toolId, score, tên SP, giá SP, ảnh SP).
    """
    async def get_similar_products(self, tool_id: str, top_k=5):
        
        # Kiểm tra xem dữ liệu và embeddings đã được tải chưa
        # Nếu chưa, gọi hàm _load_cbf_data_and_embeddings để tải dữ liệu và tạo embeddings
        if not await self._load_cbf_data_and_embeddings():
            return []

        try:
            #  Tìm chỉ số của sản phẩm cần tìm trong danh sách sản phẩm
            target_product_index = next(i for i, product in enumerate(self.product_data_cache) if str(product['toolId']) == tool_id)
        except StopIteration:
            logging.warning(f"Không tìm thấy sản phẩm với toolId: {tool_id}")
            return []

        # Lấy embedding của sản phẩm cần tìm
        target_embedding = self.product_embeddings_cache[target_product_index].reshape(1, -1)

        # Tính toán độ tương đồng COSINE giữa sản phẩm mục tiêu và tất cả các sản phẩm khác
        similarity_scores = cosine_similarity(target_embedding, self.product_embeddings_cache)[0]

        # Sắp xếp các sản phẩm theo độ tương đồng giảm dần và lấy top_k sản phẩm tương tự (bỏ qua chính nó)
        similar_indices = np.argsort(similarity_scores)[::-1][1:top_k + 1]

        similar_products = []
        for index in similar_indices:
            similar_products.append({
                'toolId': str(self.product_data_cache[index]['toolId']),
                'score': float(similarity_scores[index]),
                'name': self.product_data_cache[index]['name'],
                'price': self.product_data_cache[index]['price'],
                'imageUrl': self.product_data_cache[index]['imageUrl']
            })

        return similar_products

    async def get_recommendations_byuser(self, user_id: str, top_k=3):
        """
        Trả về danh sách sản phẩm gợi ý cho một user_id dựa trên lịch sử tương tác (ví dụ: đã xem).
        """
        if not await self._load_cbf_data_and_embeddings():
            return []

        # Giả định đây là danh sách toolId của các sản phẩm mà user đã tương tác gần đây
        interacted_products_id = [120, 231, 252, 111, 101]
        # Lọc ra thông tin chi tiết của các sản phẩm đã tương tác
        interacted_products = [
            product for product in self.product_data_cache if str(product['toolId']) in interacted_products_id
        ]

        if not interacted_products:
            logging.info(f"Không tìm thấy sản phẩm đã tương tác cho user {user_id}")
            return []

        # Lấy embeddings của các sản phẩm đã tương tác
        interacted_embeddings = [
            self.product_embeddings_cache[self.product_data_cache.index(product)]
            for product in interacted_products
        ]

        # Tính toán độ tương đồng trung bình giữa embedding của từng sản phẩm đã tương tác
        # với embeddings của tất cả các sản phẩm khác
        aggregated_similarity = np.zeros(len(self.product_data_cache))
        for interacted_embedding in interacted_embeddings:
            similarity_scores = cosine_similarity(interacted_embedding.reshape(1, -1), self.product_embeddings_cache)[0]
            aggregated_similarity += similarity_scores

        # Tính trung bình độ tương đồng nếu có sản phẩm đã tương tác
        if interacted_embeddings:
            aggregated_similarity /= len(interacted_embeddings)

        # Sắp xếp các sản phẩm theo độ tương đồng trung bình giảm dần
        sorted_indices = np.argsort(aggregated_similarity)[::-1]

        recommended_products = []
        seen_tool_ids = set()
        count = 0
        for index in sorted_indices:
            product = self.product_data_cache[index]
            tool_id = str(product['toolId'])
            # Chỉ gợi ý các sản phẩm chưa tương tác và chưa được gợi ý trước đó
            if tool_id not in [str(p['toolId']) for p in interacted_products] and tool_id not in seen_tool_ids:
                recommended_products.append({
                    'toolId': tool_id,
                    'score': float(aggregated_similarity[index])
                })
                seen_tool_ids.add(tool_id)
                count += 1
                if count >= top_k:
                    break

        logging.debug(f"CBF recommendations for user {user_id} (using BERT): {recommended_products}")
        return recommended_products