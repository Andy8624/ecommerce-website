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
                    tool_data_url="http://host.docker.internal:8080/api/v1/tools",
                    model_path = '5CD-AI/Vietnamese-Sentiment-visobert'
                 ):
        self.cf_data_url = cf_data_url
        self.tool_data_url = tool_data_url
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
                logging.debug("---------------------------------------------------")
                logging.debug(response.json())
                return response.json()
            except Exception as e:
                logging.error(f"Error fetching CF data from {self.cf_data_url}: {e}")
                raise  # Re-raise exception để thông báo lỗi cho caller

    def build_user_item_matrix(self, interactions):
        """
        Xây dựng ma trận user-item từ danh sách tương tác với xử lý tương tác trùng lặp thông minh.
        """
        # Các trọng số cơ bản cho từng loại tương tác
        weight_map = {
            "VIEW": 1,          
            "ADD_CART": 2,     
            "PURCHASE": 3,      
        }

        # Gộp các tương tác trùng lặp theo người dùng, sản phẩm và loại tương tác
        grouped_interactions = {}
        for inter in interactions:
            user_id = inter["userId"]
            tool_id = str(inter["toolId"])
            interaction_type = inter["interactionType"]
            
            # Tạo khóa duy nhất cho mỗi cặp user-item-type
            key = (user_id, tool_id, interaction_type)
            
            if key in grouped_interactions:
                # Đã tồn tại tương tác này, tăng số lượng
                grouped_interactions[key]["count"] += 1
                # Cập nhật thời gian nếu tương tác mới hơn
                if inter.get("createdAt", "") > grouped_interactions[key]["last_time"]:
                    grouped_interactions[key]["last_time"] = inter.get("createdAt", "")
            else:
                # Tương tác mới
                grouped_interactions[key] = {
                    "count": 1,
                    "last_time": inter.get("createdAt", "")
                }

        # Xử lý dữ liệu để tạo ma trận
        data = []
        for (user_id, tool_id, interaction_type), info in grouped_interactions.items():
            # Lấy trọng số cơ bản dựa trên loại tương tác
            base_weight = weight_map.get(interaction_type, 0)
            
            # Tính trọng số bổ sung dựa trên số lần tương tác
            # Sử dụng log để giảm ảnh hưởng của nhiều lần tương tác
            repetition_factor = 1 + 0.5 * (info["count"] - 1) / info["count"] if info["count"] > 1 else 1
            
            # Trọng số cuối cùng
            final_weight = base_weight * repetition_factor
            
            # Thêm dữ liệu
            data.append([user_id, tool_id, final_weight])

        # Chuyển đổi danh sách thành DataFrame
        df = pd.DataFrame(data, columns=["userId", "toolId", "weight"])
        
        # Xây dựng ma trận user-item
        user_item_matrix = df.pivot_table(index="userId", columns="toolId", values="weight", aggfunc="max", fill_value=0)
        
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
        try:
            # Chuyển đổi ma trận user-item thành định dạng float để có thể cộng thêm trọng số
            user_item_matrix = user_item_matrix.astype(float)
            # logging.debug(f"User-item matrix before integrating reviews:\n{user_item_matrix}")

            for review in reviews:
                try:
                    user_id = review.get("userId")
                    tool_id = str(review.get("toolId"))  # Chuyển đổi thành string
                    comment = review.get("comment", "") 
                    rating = review.get("rating", 3)  # Lấy rating với giá trị mặc định là 3
                    
                    # Kiểm tra dữ liệu hợp lệ
                    if not user_id or tool_id is None:
                        logging.warning(f"Bỏ qua review với dữ liệu không hợp lệ: user_id={user_id}, tool_id={tool_id}")
                        continue
                    
                    # Kiểm tra xem tool_id có trong các cột của ma trận không
                    if tool_id not in user_item_matrix.columns:
                        logging.warning(f"Tool ID {tool_id} không tồn tại trong ma trận, thêm cột mới")
                        # Thêm cột mới với giá trị mặc định là 0
                        user_item_matrix[tool_id] = 0
                    
                    # Khởi tạo trọng số từ rating (thang điểm 1-5 chuyển thành -0.4 đến 0.4)
                    weight = (rating - 3) * 0.2
                    
                    # Kiểm tra xem người dùng có bình luận không
                    if comment.strip():
                        try:
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
                            weight += sentiment_value * scaling_factor
                        except Exception as e:
                            logging.error(f"Lỗi khi phân tích cảm xúc cho bình luận: {e}")

                    # Cập nhật ma trận user-item với trọng số mới (Thêm điểm đánh giá cảm xúc)
                    if user_id in user_item_matrix.index:
                        # Nếu người dùng đã có trong ma trận, cộng thêm trọng số 
                        user_item_matrix.at[user_id, tool_id] += weight
                    else:
                        # Nếu người dùng chưa có trong ma trận, thêm một hàng mới với trọng số
                        # Tạo một Series mới với các giá trị 0 cho tất cả các cột
                        new_row = pd.Series(0, index=user_item_matrix.columns)
                        new_row[tool_id] = weight
                        # Gán Series vào ma trận
                        user_item_matrix.loc[user_id] = new_row
                except Exception as inner_e:
                    logging.error(f"Lỗi khi xử lý một review: {inner_e}", exc_info=True)
                    continue  # Bỏ qua review này và tiếp tục với review tiếp theo

            return user_item_matrix, csr_matrix(user_item_matrix)
        
        except Exception as e:
            logging.error(f"Lỗi trong integrate_reviews: {e}", exc_info=True)
            # Trả về ma trận gốc nếu có lỗi để không làm hỏng luồng xử lý
            return user_item_matrix, csr_matrix(user_item_matrix)
        
    def recommend_by_user_based(self, user_id, user_item_matrix_df, csr_matrix, top_k=3):
        """
            Tìm Top_K người dùng tương tự và gợi ý các sản phẩm mà họ đã tương tác
        """
        try:
            # Kiểm tra xem user_id có trong ma trận không
            if user_id not in user_item_matrix_df.index:
                logging.warning(f"User ID {user_id} không tồn tại trong ma trận")
                return []
            
            # Kiểm tra kích thước ma trận
            num_users = csr_matrix.shape[0]
            logging.debug(f"Số lượng người dùng trong ma trận: {num_users}")
            if num_users <= 1:
                logging.warning("Không đủ người dùng để thực hiện recommendation")
                return []
            
            # Tìm vị trí (index) của người dùng trong ma trận user-item
            user_idx = user_item_matrix_df.index.get_loc(user_id)
            logging.debug("1")
            
            # Điều chỉnh số lượng neighbors dựa trên số lượng người dùng
            actual_neighbors = min(top_k + 1, num_users)
            logging.debug(f"Số láng giềng thực tế: {actual_neighbors}")
            
            # Sử dụng NearestNeighbors để tìm top_k người dùng có hành vi tương tác tương tự
            knn = NearestNeighbors(n_neighbors=actual_neighbors, metric='cosine')
            knn.fit(csr_matrix)
            logging.debug("2")
            
            # Kiểm tra ma trận đầu vào cho kneighbors
            user_vector = csr_matrix[user_idx].toarray().reshape(1, -1)
            if user_vector.sum() == 0:
                logging.warning(f"User {user_id} có vector toàn 0, không thể tìm láng giềng")
                return []
            
            # Tìm khoảng cách và chỉ số của top_k + 1 người dùng gần nhất
            distances, indices = knn.kneighbors(user_vector, n_neighbors=actual_neighbors)
            logging.debug("3")
            
            # Kiểm tra xem có đủ người dùng tương tự không
            if len(indices[0]) <= 1:
                logging.warning("Không tìm thấy đủ người dùng tương tự")
                return []
            
            # Lấy chỉ số của những người dùng tương tự (bỏ qua chính mình)
            similar_users_indices = indices[0][1:]
            logging.debug(f"Người dùng tương tự cho {user_id}: {similar_users_indices}")
            
            # Lấy khoảng cách (cosine distance) đến người dùng hiện tại
            user_distances = distances[0][1:]  # Bỏ qua chính mình
            
            # Tính toán điểm số dự đoán cho các sản phẩm dựa trên sự tương tác của người dùng tương tự
            weighted_scores = {}
            for i, other_user_idx in enumerate(similar_users_indices):
                # Lấy khoảng cách (cosine distance) đến người dùng tương tự
                user_distance = user_distances[i]
                
                # Chuyển khoảng cách thành độ tương đồng 
                similarity = 1 - user_distance
                
                # Lấy ma trận tương tác của người dùng tương tự
                other_user_interactions = csr_matrix[other_user_idx].toarray()[0]
                
                # Duyệt qua các sản phẩm mà người dùng tương tự đã tương tác
                for item_idx, interaction_value in enumerate(other_user_interactions):
                    # Chỉ xem xét các sản phẩm có tương tác dương
                    if interaction_value > 0:
                        tool_id = user_item_matrix_df.columns[item_idx]
                        
                        # Kiểm tra xem NGƯỜI DÙNG HIỆN TẠI đã tương tác với sản phẩm này chưa
                        user_item_value = 0
                        if user_id in user_item_matrix_df.index and tool_id in user_item_matrix_df.columns:
                            user_item_value = user_item_matrix_df.loc[user_id, tool_id]
                        
                        if user_item_value > 0:
                            # Giảm điểm số nếu NGƯỜI DÙNG HIỆN TẠI đã tương tác (tránh gợi ý lại)
                            weighted_scores[str(tool_id)] = weighted_scores.get(str(tool_id), 0) + similarity * 0.2
                        else:
                            # Cộng điểm số dựa trên độ tương đồng và mức độ tương tác của người dùng tương tự
                            weighted_scores[str(tool_id)] = weighted_scores.get(str(tool_id), 0) + similarity * interaction_value

            # Sắp xếp các sản phẩm theo điểm số dự đoán giảm dần
            recommended_items = sorted(weighted_scores.items(), key=lambda x: x[1], reverse=True)

            # Trả về danh sách top_k sản phẩm được gợi ý
            return [(tool_id, score) for tool_id, score in recommended_items[:top_k]]
        
        except Exception as e:
            logging.error(f"Lỗi trong recommend_by_user_based: {e}", exc_info=True)
            return []

    async def get_popular_items(self, cf_data, top_k=5):
        """
            Lấy các sản phẩm phổ biến nhất dựa trên số lượng tương tác và đánh giá.
            Được sử dụng cho người dùng mới (cold start).
        """
        interactions = cf_data.get("interactions", [])
        reviews = cf_data.get("reviews", [])
        
        # # Nếu cả interactions và reviews đều rỗng, lấy sản phẩm mới nhất
        # if not interactions and not reviews:
        #     logging.info("Không có dữ liệu tương tác và đánh giá, lấy sản phẩm mới nhất")
        #     return await self.get_latest_items(top_k)
        
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
        try:
            # Gọi API để lấy dữ liệu CF
            data = await self.fetch_cf_data()
            
            cf_data = data.get("data", {})
            interactions = cf_data.get("interactions", [])
            reviews = cf_data.get("reviews", [])

            # Kiểm tra xem user_id có trong danh sách tương tác không
            user_exists = any(interaction["userId"] == user_id for interaction in interactions)

            # Nếu là người dùng mới (không có tương tác), sử dụng gợi ý phổ biến
            if not user_exists:
                logging.info("Người dùng mới, sử dụng gợi ý phổ biến.")
                return await self.get_popular_items(cf_data, top_k)

            # Xây dựng ma trận user-item từ dữ liệu tương tác
            user_item_matrix_df = self.build_user_item_matrix(interactions)
            logging.info("After build matrix:")

            # Chuẩn hóa ma trận user-item
            user_item_matrix_df = self.normalize_matrix(user_item_matrix_df)
            
            # Chuyển đổi ma trận thành định dạng sparse matrix (CSR)
            # Tích hợp thông tin đánh giá vào ma trận user-item
            user_item_matrix_df, csr_mat = self.integrate_reviews(user_item_matrix_df, reviews)
            
            logging.info("After review integration:")

            # Gọi hàm gợi ý sản phẩm dựa trên User-Based Collaborative Filtering
            recommended_products = self.recommend_by_user_based(user_id, user_item_matrix_df, csr_mat, top_k)
            
            # Kiểm tra nếu không có sản phẩm nào được gợi ý, sử dụng gợi ý phổ biến
            if not recommended_products:
                logging.info("Không có sản phẩm được gợi ý từ UBCF, sử dụng gợi ý phổ biến thay thế.")
                return await self.get_popular_items(cf_data, top_k)
                
            return recommended_products
            
        except Exception as e:
            logging.error(f"Lỗi trong get_recommendations: {e}", exc_info=True)
            # Trong trường hợp lỗi, trả về danh sách rỗng hoặc gọi get_popular_items
            try:
                logging.info("Lỗi xử lý UBCF, sử dụng gợi ý phổ biến thay thế.")
                return await self.get_popular_items(data.get("data", {}), top_k)
            except Exception as inner_e:
                logging.error(f"Lỗi khi lấy gợi ý phổ biến: {inner_e}", exc_info=True)
                return []
