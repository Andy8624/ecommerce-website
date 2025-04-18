from fastapi import APIRouter, Query
from app.services.llm_gemini import LLMGemini
from app.services.cbf import ContentBasedFiltering
from typing import Optional

router = APIRouter()
llm_service = LLMGemini()
cbf_service = ContentBasedFiltering()

@router.get("/llm")
async def get_llm_response(query: str = Query(..., description="Câu hỏi hoặc truy vấn cho LLM Gemini")):
    response = await llm_service.get_response(query)
    return {"query": query, "response": response}

@router.get("/search")
async def semantic_search(
    query: str = Query(..., description="Từ khóa tìm kiếm sản phẩm"),
    top_k: Optional[int] = Query(5, description="Số lượng kết quả muốn lấy")
):
    """
    API tìm kiếm ngữ nghĩa sản phẩm dựa trên từ khóa người dùng nhập vào.
    Sử dụng Gemini để chuẩn hóa và mở rộng câu truy vấn, sau đó dùng BERT để tìm kiếm ngữ nghĩa.
    """
    search_results = await cbf_service.hybrid_search(query, top_k)
    return {
        "query": query,
        "results_count": len(search_results),
        "results": search_results
    }

