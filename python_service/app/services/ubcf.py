import asyncio      
import httpx
import logging
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
from app.services.gemini_handler import GeminiHandler

logging.basicConfig(level=logging.DEBUG)

class UserBasedCollaborativeFiltering:
    def __init__(self, cf_data_url="http://host.docker.internal:8080/api/v1/recommendation/cf-data"):
        self.cf_data_url = cf_data_url

    async def fetch_cf_data(self):
        # logging.debug(f"Fetching CF data from {self.cf_data_url}")
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.cf_data_url)
                response.raise_for_status() 
                logging.debug("Successfully fetched CF data")
                return response.json()
            except Exception as e:
                logging.error(f"Error fetching CF data from {self.cf_data_url}: {e}")
                raise

    def build_user_item_matrix(self, interactions):
        weight_map = {
            "VIEW": 1,          # giữ
            "ADD_CART": 2,      # giữ    
            "REMOVE_CART": -1,
            "PURCHASE": 3,      # giữ
            "RATING": 3,        # giữ
            "COMMENT": 2,
            "SHARE": 1
        }

        data = []
        for inter in interactions:
            user_id = inter["userId"]
            tool_id = inter["toolId"]
            interaction_type = inter["interactionType"]
            weight = weight_map.get(interaction_type, 0) 

            data.append([user_id, tool_id, weight])
        
        df = pd.DataFrame(data, columns=["userId", "toolId", "weight"])
        user_item_matrix = df.pivot_table(index="userId", columns="toolId", values="weight", aggfunc="sum", fill_value=0)
        return user_item_matrix
    
    def normalize_matrix(self, user_item_matrix):
            min_user = user_item_matrix.min(axis=1).values.reshape(-1, 1)  # Giá trị nhỏ nhất từng hàng
            max_user = user_item_matrix.max(axis=1).values.reshape(-1, 1)  # Giá trị lớn nhất từng hàng

            # Tránh lỗi chia cho 0 nếu max == min
            denominator = max_user - min_user
            denominator[denominator == 0] = 1  # Nếu max == min thì đặt mẫu số thành 1 để tránh chia cho 0

            normalized_matrix = (user_item_matrix - min_user) / denominator
            logging.debug(f"Min-Max Normalized Matrix:\n{normalized_matrix}")
            
            return normalized_matrix                                                                    

    def integrate_reviews(self, user_item_matrix, reviews, scaling_factor=1.0):
        user_item_matrix = user_item_matrix.astype(float)
        # logging.debug(f"User-item matrix before integrating reviews:\n{user_item_matrix}")

        for review in reviews:
            user_id = review.get("userId")
            tool_id = review.get("toolId")
            rating = review.get("rating", 3)  
            comment = review.get("comment", "")
            # logging.debug(f"Comment {comment}")
            handler = GeminiHandler(config_path="app/core/config.yaml")
            response = handler.generate_content(f"Cho điểm mức độ hài lòng về bình luận sản phẩm, chỉ cần trả về 1 con số không giải thích gì thêm, đây là bình luận {comment}")  
            text_value = response.get('text', '').strip()  # Loại bỏ ký tự xuống dòng nếu có
            logging.debug(f"Rating from Gemini: {comment} {text_value}")
            normalized_weight = (rating - 3) / 2  # Normalize review rating to [-1, 1]
            weight = normalized_weight * scaling_factor

            if user_id in user_item_matrix.index:
                user_item_matrix.at[user_id, tool_id] += weight
                # logging.debug(f"User {user_id} has reviewed product {tool_id} with rating {rating}. Weight: {weight}")
            else:
                user_item_matrix.loc[user_id] = [0] * len(user_item_matrix.columns)
                user_item_matrix.at[user_id, tool_id] = weight
                # logging.debug(f"User {user_id} has reviewed product {tool_id} with rating {rating}. Weight: {weight}")

        # logging.debug(f"User-item matrix after integrating reviews:\n{user_item_matrix}")
        return user_item_matrix, csr_matrix(user_item_matrix)  

    def recommend_by_user_based(self, user_id, user_item_matrix_df, csr_matrix, top_k=3):
        if user_id not in user_item_matrix_df.index:
            # Trả về ds sản phẩm trend khi không có dữ liệu người dùng
            return [f"default_product_{user_id}_1"]

        # Tìm vị trí của user trong ma trận
        user_idx = user_item_matrix_df.index.get_loc(user_id)

        # Tìm top_k người dùng tương tự
        knn = NearestNeighbors(n_neighbors=top_k, metric='cosine')
        knn.fit(csr_matrix) 

        # Tìm các người dùng tương tự và khoảng cách
        distances, indices = knn.kneighbors(csr_matrix[user_idx, :], n_neighbors=top_k + 1)
        logging.debug(f"Similar users for user {user_id}: {indices}")

        similar_users = indices[0][1:]  # Bỏ qua chính user hiện tại
        logging.debug(f"Similar except current user {user_id}: {similar_users}")

        # Tính điểm số cho các sản phẩm dựa trên người dùng tương tự
        weighted_scores = {}
        for other_user_idx in similar_users:
            # Lấy DS khoảng cách giữa người dùng hiện tại và các người dùng tương tự
            user_distances = distances[0]
            logging.debug(f"User distances: {user_distances}")
            # Lấy DS chỉ số của các người dùng tương tự 
            similar_users_indices = indices[0].tolist()
            logging.debug(f"Similar users indices: {similar_users_indices}")

            # Tìm vị trí của người dùng tương tự trong DS các người dùng gần nhất
            user_position = similar_users_indices.index(other_user_idx)

            # Lấy khoảng cách giữa người dùng hiện tại và người dùng tương tự
            user_distance = user_distances[user_position]

            # Chúng ta chuyển khoảng cách (cosine distance) thành sự tương đồng (cosine similarity)
            # Vì cosine similarity = 1 - cosine distance, nên công thức tính similarity là 1 trừ đi khoảng cách.
            similarity = 1 - user_distance  


            # Duyệt qua các sản phẩm mà người dùng tương tự đã tương tác
            for item_idx, rating in enumerate(csr_matrix[other_user_idx].toarray()[0]):
                if rating > 0:  # Chỉ xét các sản phẩm mà người dùng tương tự đã tương tác (rating > 0)
                    tool_id = str(user_item_matrix_df.columns[item_idx])
                    # other_user_id = user_item_matrix_df.index[other_user_idx]
                    # Nếu người dùng đã tương tác với sản phẩm, giảm điểm sản phẩm xuống
                    # logging.debug(f"Check {user_item_matrix_df.loc[user_id]}")
                    logging.debug(f"Checkk {user_item_matrix_df.loc[user_id]}")
                    # logging.debug(f"Checkkk {user_item_matrix_df.loc[other_user_id]}")
                    if int(tool_id) in user_item_matrix_df.loc[user_id].index and user_item_matrix_df.loc[user_id, int(tool_id)] > 0:
                        logging.debug(f"User {user_id} has already interacted with product {tool_id}. Lowering the score.")
                        weighted_scores[tool_id] = weighted_scores.get(tool_id, 0) + (similarity * rating) * 0.2  # Giảm điểm đi 80%
                    else:
                        logging.debug(f"User {user_id} has nottttttttt interacted with product {tool_id}. Adding the score.")
                        weighted_scores[tool_id] = weighted_scores.get(tool_id, 0) + similarity * rating


        # Sắp xếp sản phẩm theo điểm số giảm dần và trả về
        recommended_items = sorted(weighted_scores.items(), key=lambda x: x[1], reverse=True)

        # Trả về danh sách các sản phẩm kèm theo điểm số
        return [(tool_id, score) for tool_id, score in recommended_items[:]]



    async def get_recommendations(self, user_id: str):
        data = await self.fetch_cf_data()
        cf_data = data.get("data", {})
        interactions = cf_data.get("interactions", [])
        reviews = cf_data.get("reviews", [])

        # logging.debug(f"Interactions: {interactions}")
        user_item_matrix_df = self.build_user_item_matrix(interactions)
        # logging.debug(f"User-item matrix:\n{user_item_matrix_df}")
        user_item_matrix_df, csr_matrix = self.integrate_reviews(user_item_matrix_df, reviews)
        # logging.debug(f"User-item matrix after integrating reviews:\n{user_item_matrix_df}")
        user_item_matrix_df = self.normalize_matrix(user_item_matrix_df)
        # logging.debug(f"User-item matrix after normalization:\n{user_item_matrix_df}")
        recommended_products = self.recommend_by_user_based(user_id, user_item_matrix_df, csr_matrix, top_k=5)
        return recommended_products
