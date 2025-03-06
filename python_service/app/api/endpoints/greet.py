from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_handler import GeminiHandler

router = APIRouter()

# Định nghĩa schema cho body request
class GreetRequest(BaseModel):
    text: str  

@router.post("/greet")
async def greet(request: GreetRequest):
    try:
        handler = GeminiHandler(config_path="app/core/config.yaml")
        response = handler.generate_content(request.text)  

        if not response.get("success", False):
            raise HTTPException(
                status_code=500, 
                detail=response.get("error", "Lỗi không xác định")
            )

        return {"message": response["text"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
