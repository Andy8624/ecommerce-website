from fastapi import APIRouter, HTTPException, Path, Query
from app.schemas.recommendation import RecommendationRequest, UBCE_DetailResponse, UBCF_Response, CBF_SimilarProductsByToolIdResponse, CBF_Response
from app.services.ubcf import UserBasedCollaborativeFiltering
from app.services.cbf import ContentBasedFiltering
import logging

router = APIRouter()

logging.basicConfig(level=logging.DEBUG)

ubcf_service = UserBasedCollaborativeFiltering()
cbf_service = ContentBasedFiltering()

"""
    Lấy danh sách các sản phẩm gợi ý dựa trên User-Based Collaborative Filtering cho một user_id cụ thể.
"""
@router.get("/ubcf/user/{user_id}", response_model=UBCF_Response)
async def get_ubcf_recommendations(
        user_id: str = Path(..., title="The ID of the user to get recommendations for"),
        top_k: int = Query(5, description="Maximum number of similar products to return")
    ):
    try:
        recommendations = await ubcf_service.get_recommendations(user_id, top_k)
        logging.debug(f"Recommendations for user {user_id}: {recommendations}")

        # Điều chỉnh cách truy cập dữ liệu trong recommendations (tuples)
        recommendation_details = [
            UBCE_DetailResponse(
                toolId=str(rec[0]),  # rec[0] là toolId
                score=rec[1]         # rec[1] là score
            )
            for rec in recommendations
        ]
        logging.debug(f"Recommendation details for user {user_id}: {recommendation_details}")

        # Trả về kết quả dạng list của UBCE_DetailResponse
        return UBCF_Response(
            user_id=user_id,
            recommendations=recommendation_details
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/cbf/user", response_model=Response)
# async def get_cbf_recommendations(request: RecommendationRequest):
#     try:
#         recommendations = await cbf_service.get_recommendations_byuser(request.user_id, 7)

#         # Chuyển đổi danh sách sản phẩm thành DetailResponse model
#         recommendation_details = [
#             DetailResponse(
#                 toolId=str(rec['toolId']),
#                 score=rec['score']
#             )
#             for rec in recommendations
#         ]


#         return Response(
#             user_id=request.user_id,
#             recommendations=recommendation_details
#         )

#     except Exception as e:
#         logging.error(f"Error in CBF recommendations: {e}")
#         raise HTTPException(status_code=500, detail="An error occurred while fetching CBF recommendations.")

"""
    Tìm các sản phẩm tương đồng với một sản phẩm dựa trên toolId
"""
@router.get("/cbf/product/{tool_id}", response_model=CBF_Response)
async def get_similar_products(
            tool_id: int = Path(..., title="The ID of the tool to find similar products for"),
            top_k: int = Query(5, description="Maximum number of similar products to return")
        ):
    try:
        similar_products = await cbf_service.get_similar_products(str(tool_id), top_k)

        recommendation_details = [
            CBF_SimilarProductsByToolIdResponse(
                toolId=rec['toolId'],
                score=rec['score'],
                name=rec.get('name'),
                price=rec.get('price'),
                imageUrl=rec.get('imageUrl')
            )
            for rec in similar_products
        ]

        return CBF_Response(
            recommendations=recommendation_details
        )
    except Exception as e:
        logging.error(f"Error in get_similar_products: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching similar products.")