from fastapi import FastAPI, APIRouter
from app.api.endpoints import recommendations, llm, greet, image_search
from app.core.logger_config import LoggerConfig
from fastapi.middleware.cors import CORSMiddleware

class Application:
    def __init__(self):
        self.app = FastAPI(title="Python API", version="1.0")

        # Thêm CORS Middleware
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # Cho phép frontend Vite
            allow_credentials=True,
            allow_methods=["*"], 
            allow_headers=["*"], 
        )

        self._register_routes()

    def _register_routes(self):
        # Tạo một APIRouter trung gian với prefix chung
        api_router = APIRouter(prefix="/python/api/v1")

        # Include các endpoint vào router trung gian
        api_router.include_router(recommendations.router)
        api_router.include_router(llm.router)
        api_router.include_router(greet.router)
        api_router.include_router(image_search.router)
        # api_router.include_router(evaluate_recommender.router)
        
        # Gắn router trung gian vào ứng dụng
        self.app.include_router(api_router)

    def get_app(self):
        return self.app

# Cấu hình logging trước khi khởi chạy ứng dụng
LoggerConfig().configure()  # Đảm bảo rằng cấu hình logging được thực hiện trước khi chạy ứng dụng

# Tạo biến toàn cục app để uvicorn có thể load
app = Application().get_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
