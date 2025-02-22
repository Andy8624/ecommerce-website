from pydantic import BaseModel
from typing import List

class RecommendationRequest(BaseModel):
    user_id: str

class DetailResponse(BaseModel):
    toolId: str
    score: float

class Response(BaseModel):
    user_id: str
    recommendations: List[DetailResponse]
