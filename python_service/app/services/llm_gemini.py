# app/services/llm_gemini.py
import asyncio

class LLMGemini:
    def __init__(self):
        # Khởi tạo cấu hình, API key hoặc kết nối đến LLM Gemini nếu cần
        pass

    async def get_response(self, query: str):
        await asyncio.sleep(0.1)  # Giả lập tác vụ I/O
        # Trả về kết quả dummy
        return f"Kết quả của LLM Gemini cho truy vấn: '{query}'"
