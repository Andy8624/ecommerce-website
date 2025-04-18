import asyncio
import httpx
import logging
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
from transformers import pipeline

logging.basicConfig(level=logging.DEBUG)

class UserBasedCollaborativeFiltering:
    def __init__(self, 
                    cf_data_url="http://host.docker.internal:8080/api/v1/recommendation/cf-data",
                    model_path = '5CD-AI/Vietnamese-Sentiment-visobert'
                 ):
        self.cf_data_url = cf_data_url
        self.model_path = model_path
        
        # Khởi tạo mô hình phân tích cảm xúc
        self.sentiment_analyzer = pipeline("sentiment-analysis", model=self.model_path, device=0)  # Sử dụng GPU nếu có
        

    async def fetch_cf_data(self):
        """
            Gọi API để lấy dữ liệu Collaborative Filtering (tương tác người dùng và sản phẩm).
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.cf_data_url)
                response.raise_for_status()  # Báo lỗi nếu request không thành công (status code != 2xx)
                logging.debug("Successfully fetched CF data")
                return response.json()
            except Exception as e:
                logging.error(f"Error fetching CF data from {self.cf_data_url}: {e}")
                raise  # Re-raise exception để thông báo lỗi cho caller

    def build_user_item_matrix(self, interactions):
        """
            Xây dựng ma trận user-item từ danh sách tương tác của người dùng.
            Mỗi hàng đại diện cho một người dùng, mỗi cột đại diện cho một sản phẩm,
            và giá trị trong ô là trọng số tương tác (dựa trên loại tương tác).

            Giá trị của mỗi ô thể hiện trọng số tương tác của người dùng với sản phẩm tương ứng
        """
        weight_map = {
            "VIEW": 1,          # Trọng số cho hành động xem sản phẩm
            "ADD_CART": 2,      # Trọng số cho hành động thêm vào giỏ hàng
            "PURCHASE": 3,      # Trọng số cho hành động mua hàng
        }

        data = []
        for inter in interactions:
            user_id = inter["userId"]
            tool_id = inter["toolId"]
            interaction_type = inter["interactionType"]
            
            # Lấy trọng số dựa trên loại tương tác, mặc định là 0
            weight = weight_map.get(interaction_type, 0) 

            # Thêm dữ liệu vào bảng tương tác
            data.append([user_id, tool_id, weight])

        
        # data sẽ có dạng:
        # [
        #   [user_id_1, tool_id_a, weight_1],
        #   [user_id_1, tool_id_b, weight_2],
        #   [user_id_2, tool_id_a, weight_3],
        #   ...
        # ]

        # So với dữ liệu mẫu:
        # data = [
        #     ['user1', 1, 0],
        #     ['user1', 2, 3,5],
        #     ['user2', 1, 2.5],
        # ]

        df = pd.DataFrame(data, columns=["userId", "toolId", "weight"])
        # Chuyển đổi danh sách thành DataFrame
        # df sẽ có dạng:
        #    userId  toolId  weight
        # 0  user1   1       1
        # 1  user1   2       3
        # 2  user2   1       2

        user_item_matrix = df.pivot_table(index="userId", columns="toolId", values="weight", aggfunc="sum", fill_value=0)
        # Xây dựng ma trận user-item từ DataFrame
        # user_item_matrix sẽ có dạng:
        # toolId  1   2
        # user1   1   3
        # user2   2   0
        
        return user_item_matrix

    def normalize_matrix(self, user_item_matrix):
        """
            Chuẩn hóa ma trận user-item theo từng hàng (từng người dùng) về khoảng [0, 1]
            sử dụng phương pháp Min-Max Scaling.
            Công thức chuẩn hóa: (x - min) / (max - min)
            Trong đó:
            - x là giá trị gốc
            - min là giá trị nhỏ nhất trong hàng
            - max là giá trị lớn nhất trong hàng
        """
        min_user = user_item_matrix.min(axis=1).values.reshape(-1, 1)  # Giá trị tương tác nhỏ nhất của mỗi người dùng
        max_user = user_item_matrix.max(axis=1).values.reshape(-1, 1)  # Giá trị tương tác lớn nhất của mỗi người dùng

        # Tránh lỗi chia cho 0 nếu max == min (người dùng chỉ tương tác một kiểu hoặc không tương tác)
        denominator = max_user - min_user
        denominator[denominator == 0] = 1  # Nếu max == min thì đặt mẫu số thành 1

        normalized_matrix = (user_item_matrix - min_user) / denominator
        # logging.debug(f"Min-Max Normalized Matrix:\n{normalized_matrix}")

        return normalized_matrix

    def integrate_reviews(self, user_item_matrix, reviews, scaling_factor=1.0):
        """
            Tích hợp thông tin đánh giá (reviews) vào ma trận user-item.
            Sử dụng mô hình '5CD-AI/Vietnamese-Sentiment-visobert'
            để phân tích cảm xúc của bình luận và điều chỉnh trọng số tương tác.
        """
        # Chuyển đổi ma trận user-item thành định dạng float để có thể cộng thêm trọng số
        user_item_matrix = user_item_matrix.astype(float)
        # logging.debug(f"User-item matrix before integrating reviews:\n{user_item_matrix}")

        for review in reviews:
            user_id = review.get("userId")
            tool_id = review.get("toolId")
            comment = review.get("comment", "") 
            
            # Kiểm tra xem người dùng có bình luận không
            if not comment.strip():
                continue

            # Sử dụng mô hình sentiment analysis để đánh giá bình luận
            sentiment_result = self.sentiment_analyzer(comment)[0]
            sentiment_label = sentiment_result['label']
            sentiment_score = sentiment_result['score']
            logging.debug(f"Sentiment analysis for '{comment}': Label={sentiment_label}, Score={sentiment_score}")

            # Ánh xạ nhãn sentiment về một giá trị số trong khoảng [-1, 1]
            sentiment_value = 0.0
            if sentiment_label == "POS":
                # Bình luận tích cực cần có ảnh hưởng tích cực cao
                sentiment_value = sentiment_score
            elif sentiment_label == "NEG":
                # Bình luận tiêu cực cần có ảnh hưởng tiêu cực
                sentiment_value = -sentiment_score
            elif sentiment_label == "NEU":
                # Bình luận trung tính nên có ảnh hưởng nhỏ hơn bình luận tích cực
                sentiment_value = sentiment_score * 0.3 

            #  Nhân với scale để tăng giảm ảnh hưởng của bình luận
            weight = sentiment_value * scaling_factor

            # Cập nhật ma trận user-item với trọng số mới (Them diem danh gia cam xuc)
            if user_id in user_item_matrix.index:
                # Nếu người dùng đã có trong ma trận, cộng thêm trọng số 
                user_item_matrix.at[user_id, tool_id] += weight
            else:
                # Nếu người dùng chưa có trong ma trận, thêm một hàng mới với trọng số 
                user_item_matrix.loc[user_id] = [0] * len(user_item_matrix.columns)
                user_item_matrix.at[user_id, tool_id] = weight

        return user_item_matrix, csr_matrix(user_item_matrix)

    def recommend_by_user_based(self, user_id, user_item_matrix_df, csr_matrix, top_k=3):
        """
            Tìm Top_K người dùng tương tự và gợi ý các sản phẩm mà họ đã tương tác
        """

        # VD: user_item_matrix_df
        #             Item_1  Item_2  Item_3  Item_4  Item_5
        # User_A      5       3       0       2       1
        # User_B      4       0       3       1       2  
        # User_C      1       2       5       0       0
        # User_D      0       5       4       2       1
        # User_E      2       0       1       4       5

        if user_id not in user_item_matrix_df.index:
            # Trả về danh sách sản phẩm mặc định (ví dụ: sản phẩm phổ biến) nếu không có dữ liệu người dùng
            return [f"default_product_for_user_{user_id}_1"]

        # Tìm vị trí (index) của người dùng trong ma trận user-item
        # VD: user_id = "User_A"
        # user_idx = 0
        user_idx = user_item_matrix_df.index.get_loc(user_id)

        # Sử dụng NearestNeighbors để tìm top_k người dùng có hành vi tương tác, tương tự với người dùng hiện tại
        # dựa trên độ tương đồng cosine
        knn = NearestNeighbors(n_neighbors=top_k + 1, metric='cosine')
        knn.fit(csr_matrix)

        # Tìm khoảng cách và chỉ số của top_k + 1 người dùng gần nhất (bao gồm cả chính người dùng)
        # VD: distances = [[0.0, 0.15, 0.25, 0.6]]
        # indices = [[0, 1, 4, 2]]
        distances, indices = knn.kneighbors(csr_matrix[user_idx, :], n_neighbors=top_k + 1)

        # Lấy chỉ số của những người dùng tương tự (bỏ qua chính mình)
        similar_users_indices = indices[0][1:] 
        # similar_users_indices = [1, 4, 2]
        logging.debug(f"Người dùng tương tự cho {user_id}: {similar_users_indices}")

        # Lấy khoảng cách (cosine distance) đến người dùng hiện tại
        user_distances = distances[0]
        # user_distances = [0.0, 0.15, 0.25, 0.6]

        # Tính toán điểm số dự đoán cho các sản phẩm dựa trên sự tương tác của người dùng tương tự
        weighted_scores = {}
        for i, other_user_idx in enumerate(similar_users_indices):
            # Lấy khoảng cách (cosine distance) đến người dùng tương tự
            user_distance = user_distances[i + 1] # +1 vì bỏ qua chính mình 

            # Chuyển khoảng cách thành độ tương đồng 
            # Lý do phải chuyển đổi
            # NearestNeighbors trả về khoảng cách: Giá trị càng thấp thì người dùng càng giống nhau
            # Nhưng thuật toán gợi ý cần độ tương đồng: Giá trị càng cao thì người dùng càng giống nhau
            similarity = 1 - user_distance

            # Lấy ma trận tương tác của người dùng tương tự
            other_user_interactions = csr_matrix[other_user_idx].toarray()[0]

            # Duyệt qua các sản phẩm mà người dùng tương tự đã tương tác
            for item_idx, interaction_value in enumerate(other_user_interactions):
                # Chỉ xem xét các sản phẩm có tương tác dương
                if interaction_value > 0: 
                    tool_id = user_item_matrix_df.columns[item_idx]
                    
                    # Kiểm tra xem NGƯỜI DÙNG HIỆN TẠI đã tương tác với sản phẩm này chưa
                    if user_item_matrix_df.loc[user_id, tool_id] > 0:
                        # Giảm điểm số nếu NGƯỜI DÙNG HIỆN TẠI đã tương tác (tránh gợi ý lại)
                        weighted_scores[str(tool_id)] = weighted_scores.get(str(tool_id), 0) + similarity * 0.2
                    else:
                        # Cộng điểm số dựa trên độ tương đồng và mức độ tương tác của người dùng tương tự
                        weighted_scores[str(tool_id)] = weighted_scores.get(str(tool_id), 0) + similarity * interaction_value

        # Sắp xếp các sản phẩm theo điểm số dự đoán giảm dần
        recommended_items = sorted(weighted_scores.items(), key=lambda x: x[1], reverse=True)

        # Trả về danh sách top_k sản phẩm được gợi ý
        return [(tool_id, score) for tool_id, score in recommended_items[:top_k]]

    async def get_popular_items(self, cf_data, top_k=5):
        """
            Lấy các sản phẩm phổ biến nhất dựa trên số lượng tương tác và đánh giá.
            Dược sử dụng cho người dùng mới (cold start).
        """
        interactions = cf_data.get("interactions", [])
        reviews = cf_data.get("reviews", [])
        
        # Tổng hợp tất cả tương tác theo sản phẩm
        item_popularity = {}
        
        # Tính điểm phổ biến từ tương tác
        for interaction in interactions:
            tool_id = str(interaction["toolId"])
            interaction_type = interaction["interactionType"]
            
            # Gán trọng số cho từng loại tương tác
            weight = 1
            if interaction_type == "PURCHASE":
                weight = 3
            elif interaction_type == "ADD_CART":
                weight = 2
            elif interaction_type == "VIEW":
                weight = 1
                
            item_popularity[tool_id] = item_popularity.get(tool_id, 0) + weight
        
        # Tính thêm điểm phổ biến từ đánh giá
        for review in reviews:
            tool_id = str(review.get("toolId"))
            rating = review.get("rating", 3)
            
            # Đánh giá cao có trọng số lớn hơn
            item_popularity[tool_id] = item_popularity.get(tool_id, 0) + rating
        
        # Sắp xếp theo độ phổ biến giảm dần
        popular_items = sorted(item_popularity.items(), key=lambda x: x[1], reverse=True)
        
        return popular_items[:top_k]
    
    async def get_recommendations(self, user_id: str, top_k=12):
        """
            Hàm chính để lấy danh sách các sản phẩm gợi ý cho một người dùng
        """
        # Gọi API để lấy dữ liệu CF
        data = await self.fetch_cf_data()
        cf_data = data.get("data", {})
        interactions = cf_data.get("interactions", [])
        reviews = cf_data.get("reviews", [])

        # Kiểm tra xem user_id có trong danh sách tương tác không
        user_exists = any(interaction["userId"] == user_id for interaction in interactions)
        
        # Nếu là người dùng mới (không có tương tác), sử dụng gợi ý phổ biến
        if not user_exists:
            logging.debug("Người dùng mới, sử dụng gợi ý phổ biến.")
            return await self.get_popular_items(cf_data, top_k)

        # Nếu người dùng đã có tương tác
        # Xây dựng ma trận user-item từ dữ liệu tương tác
        user_item_matrix_df = self.build_user_item_matrix(interactions)

        # Chuẩn hóa ma trận user-item
        user_item_matrix_df = self.normalize_matrix(user_item_matrix_df)

        # Chuyển đổi ma trận thành định dạng sparse matrix (CSR)
        # Tich hợp thông tin đánh giá vào ma trận user-item
        user_item_matrix_df, csr_matrix = self.integrate_reviews(user_item_matrix_df, reviews)

        # Gọi hàm gợi ý sản phẩm dựa trên User-Based Collaborative Filtering
        recommended_products = self.recommend_by_user_based(user_id, user_item_matrix_df, csr_matrix, top_k)
        return recommended_products
