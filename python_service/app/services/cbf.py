import asyncio
import httpx
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import logging
from transformers import BertTokenizer, BertModel, AutoTokenizer, AutoModel
import torch
        
# Khởi tạo LLMGemini để chuẩn hóa và mở rộng query
from app.services.llm_gemini import LLMGemini
gemini = LLMGemini()
class ContentBasedFiltering:
    def __init__(self,
                    cf_data_url="http://host.docker.internal:8080/api/v1/recommendation/cbf-data",
                    bert_model_name='dangvantuan/vietnamese-embedding'
                ):
        # --- Khởi tạo ---
        self.cf_data_url = cf_data_url  # URL của API lấy dữ liệu sản phẩm
        self.tokenizer = AutoTokenizer.from_pretrained(bert_model_name)  # Tokenizer của BERT để xử lý văn bản
        self.model = AutoModel.from_pretrained(bert_model_name)  # Mô hình BERT đã được huấn luyện trước
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
                f"{product['name']} {product['toolType']} {product['brand']}"
                # f"Tên sản phẩm: {product['name']}. Thương hiệu: {product['brand']}. Loại sản phẩm: {product['toolType']}"
                # f"Tên sản phẩm: {product['name']}. Loại sản phẩm: {product['toolType']}"
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
        similar_indices = np.argsort(similarity_scores)[::-1][0:top_k + 1]

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
    
    async def semantic_search(self, query: str, top_k=5):
        """
        Thực hiện tìm kiếm ngữ nghĩa thuần túy dựa trên mô hình BERT.
        """
        try:
            # Đảm bảo dữ liệu sản phẩm đã được tải
            if not await self._load_cbf_data_and_embeddings():
                return []
            
            # Chuẩn hóa query bằng Gemini
            normalized_query = await gemini.normalize_search_query(query)
            logging.info(f"Query chuẩn hóa: {normalized_query}")
            
            # Tạo 2 biến thể truy vấn bổ sung
            expand_prompt = f"""
            Dựa trên câu tìm kiếm sản phẩm sau: '{normalized_query}'
            
            Hãy tạo ra 2 biến thể truy vấn tìm kiếm khác nhau có nghĩa tương tự.
            PHẢI GIỮ ĐÚNG LOẠI SẢN PHẨM gốc, nhưng có thể thêm mô tả hoặc các tính từ tương đồng.
            Ví dụ: 'bút chì' có thể thành 'bút chì màu' hoặc 'bút chì vẽ', nhưng KHÔNG được thành 'bút bi'.
            
            Trả về 5 biến thể, mỗi biến thể trên một dòng riêng biệt, không đánh số, không thêm giải thích.
            """
            
            expanded_queries_text = await gemini.get_response(expand_prompt)
            expanded_queries = expanded_queries_text.strip().split('\n')
            # Đảm bảo chỉ lấy tối đa 2 biến thể
            expanded_queries = expanded_queries[:5]
            
            all_queries = [normalized_query] + expanded_queries
            logging.info(f"Các biến thể query: {all_queries}")
            
            # --- PHẦN 1: TÌM KIẾM NGỮ NGHĨA ---
            # Vector hóa tất cả các query
            query_embeddings = self.get_bert_embeddings(all_queries)
            
            # Tính độ tương đồng giữa các query vectors và product embeddings
            similarity_scores_list = []
            for query_embedding in query_embeddings:
                query_embedding_reshaped = query_embedding.reshape(1, -1)
                scores = cosine_similarity(query_embedding_reshaped, self.product_embeddings_cache)[0]
                similarity_scores_list.append(scores)
                
            # Tính điểm trung bình từ tất cả các biến thể query
            average_scores = np.mean(similarity_scores_list, axis=0)

            # --- PHẦN 2: TẠO KẾT QUẢ ---
            # Lấy top_k kết quả dựa trên điểm trung bình
            semantic_indices = np.argsort(average_scores)[::-1][:top_k]
            
            # Tạo danh sách kết quả
            results = []
            for index in semantic_indices:
                product = self.product_data_cache[index]
                results.append({
                    'toolId': str(product['toolId']),
                    'score': float(average_scores[index]),
                    'name': product['name'],
                    'price': product['price'],
                    'imageUrl': product['imageUrl'],
                    'toolType': product['toolType']
                })
            
            return results
        
        except Exception as e:
            logging.error(f"Lỗi trong tìm kiếm ngữ nghĩa: {str(e)}")
            return []
