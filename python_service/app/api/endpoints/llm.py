# app/api/endpoints/llm.py
from fastapi import APIRouter, Query
from app.services.llm_gemini import LLMGemini

router = APIRouter()
llm_service = LLMGemini()

@router.get("/llm")
async def get_llm_response(query: str = Query(..., description="Câu hỏi hoặc truy vấn cho LLM Gemini")):
    response = await llm_service.get_response(query)
    return {"query": query, "response": response}
