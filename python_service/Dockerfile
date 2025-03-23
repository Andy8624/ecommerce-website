FROM python:3.9-slim

# Cài đặt công cụ cần thiết
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    libatlas-base-dev \
    && apt-get clean

WORKDIR /app

# Sử dụng volume cache để lưu thư viện Python
ENV PIP_CACHE_DIR=/root/.cache/pip
ENV HF_HOME=/root/.cache/huggingface  

# Copy requirements.txt trước
COPY requirements.txt .

# Cài đặt thư viện với cache
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt

# Copy toàn bộ mã nguồn
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--log-level", "debug"]
