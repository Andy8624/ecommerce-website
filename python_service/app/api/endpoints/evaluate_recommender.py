# # app/api/endpoints/recommendations.py
# from fastapi import APIRouter
# from app.services.ubcf import UserBasedCollaborativeFiltering
# from app.services.recommender_evaluator import RecommenderEvaluator
# import logging 

# router = APIRouter()

# @router.get("/recommendation/evaluate")
# async def evaluate_recommender():
#     try:
#         # Khởi tạo recommender system
#         user_cf = UserBasedCollaborativeFiltering()
        
#         # Lấy dữ liệu từ API
#         cf_data = user_cf.read_csv_data()
#         logging.debug(f"Read {len(cf_data)} rows from {user_cf.cf_data_file}")
#         logging.debug(f"First row: {cf_data[0]}")
#         # Khởi tạo evaluator và tính toán metrics
#         evaluator = RecommenderEvaluator(user_cf)
#         # metrics = evaluator.evaluate(cf_data)
        
#         return {
#             "statusCode": 200,
#             "error": None,
#             "message": "Evaluation completed successfully",
#             "data": metrics
#         }
        
#     except Exception as e:
#         logging.error(f"Error in evaluate_recommender: {str(e)}")
#         return {
#             "statusCode": 500,
#             "error": str(e),
#             "message": "Failed to evaluate recommender system",
#             "data": None
#         }