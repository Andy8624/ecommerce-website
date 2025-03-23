from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_handler import GeminiHandler
import base64
import struct
import numpy as np

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
        # Chuỗi byte array (ví dụ, giả sử là base64-encoded)
        byte_string = "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"

        # Giải mã chuỗi base64 thành byte array
        byte_data = base64.b64decode(byte_string)

        # Chuyển đổi byte array thành mảng float
        # Giả sử mỗi số float là 4 byte (định dạng IEEE 754 single-precision)
        float_array = np.frombuffer(byte_data, dtype=np.float32)

        print(float_array)
        return {"message": response["text"]}
    

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
