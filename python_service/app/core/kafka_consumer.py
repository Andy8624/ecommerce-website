# app/core/kafka_consumer.py
import asyncio
from aiokafka import AIOKafkaConsumer
from app.core.config import Config

class KafkaConsumerService:
    def __init__(self):
        self.consumer = AIOKafkaConsumer(
            Config.KAFKA_TOPIC,
            bootstrap_servers=Config.KAFKA_BOOTSTRAP_SERVERS,
            group_id="recommendation-group"
        )

    async def consume(self):
        await self.consumer.start()
        try:
            async for msg in self.consumer:
                # Xử lý message (bạn có thể gọi service xử lý ở đây)
                print(f"Nhận được message: {msg.value.decode()}")
        finally:
            await self.consumer.stop()

# Ví dụ chạy consumer trên một task riêng (bạn có thể khởi tạo từ main nếu cần)
if __name__ == "__main__":
    consumer_service = KafkaConsumerService()
    asyncio.run(consumer_service.consume())
