from fastapi import APIRouter, HTTPException
from app.schemas.recommendation import RecommendationRequest, DetailResponse, Response
from app.services.ubcf import UserBasedCollaborativeFiltering
from app.services.cbf import ContentBasedFiltering
import logging

router = APIRouter()

logging.basicConfig(level=logging.DEBUG)

ubcf_service = UserBasedCollaborativeFiltering()
cbf_service = ContentBasedFiltering()
@router.post("/ubcf", response_model=Response)
async def get_cf_recommendations(request: RecommendationRequest):
    try:
        recommendations = await ubcf_service.get_recommendations(request.user_id)
        logging.debug(f"Recommendations for user {request.user_id}: {recommendations}")
        
        # Điều chỉnh cách truy cập dữ liệu trong recommendations (tuples)
        recommendation_details = [
            DetailResponse(
                toolId=str(rec[0]),  # rec[0] là toolId
                score=rec[1]         # rec[1] là score
            )
            for rec in recommendations
        ]
        logging.debug(f"Recommendation details for user {request.user_id}: {recommendation_details}")

        # Trả về kết quả dạng list của UBCFRecommendationDetail
        return Response(
            user_id=request.user_id, 
            recommendations=recommendation_details
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cbf", response_model=Response)
async def get_cbf_recommendations(request: RecommendationRequest):
    try:
        recommendations = await cbf_service.get_recommendations(request.user_id, 7)
        
        # Chuyển đổi danh sách sản phẩm thành RecommendationDetail model
        recommendation_details = [
            DetailResponse(
                toolId=str(rec['toolId']), 
                score=rec['score']
            )
            for rec in recommendations
        ]
        
        
        return Response(
            user_id=request.user_id, 
            recommendations=recommendation_details
        )
    
    except Exception as e:
        logging.error(f"Error in CBF recommendations: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching CBF recommendations.")
