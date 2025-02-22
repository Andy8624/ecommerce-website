# app/core/config.py
class Config:
    # Cấu hình database
    DB_HOST = "localhost"
    DB_PORT = 3306
    DB_USER = "username"
    DB_PASSWORD = "password"
    DB_NAME = "database_name"

    # Cấu hình Kafka
    KAFKA_BOOTSTRAP_SERVERS = ["localhost:9092"]
    KAFKA_TOPIC = "your_topic_name"
