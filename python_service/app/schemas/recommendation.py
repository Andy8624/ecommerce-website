from pydantic import BaseModel
from typing import List, Optional

class RecommendationRequest(BaseModel):
    user_id: str

class UBCE_DetailResponse(BaseModel):
    toolId: str
    score: float

class UBCF_Response(BaseModel):
    user_id: Optional[str] = None
    recommendations: List[UBCE_DetailResponse]

# --------- CBF RECOMMENDATIONS ---------
class CBF_SimilarProductsByToolIdResponse(BaseModel):
    toolId: str
    score: float
    name: Optional[str] = None
    price: Optional[float] = None
    imageUrl: Optional[str] = None

class CBF_Response(BaseModel):
    recommendations: List[CBF_SimilarProductsByToolIdResponse]