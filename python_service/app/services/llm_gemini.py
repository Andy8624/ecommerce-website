import asyncio
from app.services.gemini_handler import GeminiHandler, GenerationConfig


class LLMGemini:
    def __init__(self):
        # Tạo cấu hình tối ưu cho tác vụ chuẩn hóa văn bản
        self.generation_config = GenerationConfig(
            temperature=0.1,        # Giảm temperature để có kết quả nhất quán hơn
            top_p=0.95,             # Giảm top_p để tăng tính xác định
            top_k=20,               # Giảm top_k để tập trung vào các từ phổ biến
            max_output_tokens=512   # Giảm max_output_tokens vì chuẩn hóa chỉ cần câu ngắn
        )
        
        # System instruction giúp Gemini hiểu rõ nhiệm vụ
        self.system_instruction = """
        Bạn là một công cụ chuẩn hóa truy vấn tìm kiếm chuyên nghiệp:
        - Nhiệm vụ chính: sửa lỗi chính tả, làm rõ ý nghĩa của các câu tìm kiếm
        - Khi mở rộng truy vấn, hãy đảm bảo giữ lại từ khóa quan trọng xuất hiện trong truy vấn gốc
        - Với các sản phẩm cụ thể (gôm, bút bi, bút chì...), đảm bảo các biến thể vẫn giữ đúng loại sản phẩm
        - Trả về câu đã chuẩn hóa ngắn gọn, không thêm giải thích
        - Tránh thêm các từ khóa chung chung vào kết quả chuẩn hóa
        """

    async def get_response(self, query: str):
        handler = GeminiHandler(
            config_path="app/core/config.yaml",
            generation_config=self.generation_config,
            system_instruction=self.system_instruction
        )
        response = handler.generate_content(query)  
        return response["text"]

    async def normalize_search_query(self, query: str):
        """
        Hàm chuyên biệt để chuẩn hóa query tìm kiếm
        """
        normalize_prompt = f"""
        Chuẩn hóa câu tìm kiếm sau đây, 
        sửa lỗi chính tả và làm rõ nghĩa và mở rộng truy vấn dài hơn 
        để có thể tìm được các sản phẩm đúng với yêu cầu:
        '{query}'
        
        CHỈ TRẢ VỀ CÂU ĐÃ CHUẨN HÓA, không thêm bất kỳ giải thích nào.
        """
        return await self.get_response(normalize_prompt)