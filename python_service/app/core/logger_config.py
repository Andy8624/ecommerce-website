import logging
import sys

class LoggerConfig:
    def __init__(self, log_level: int = logging.DEBUG, log_file: str = "app.log"):
        self.log_level = log_level  # Mặc định là DEBUG
        self.log_file = log_file    # Mặc định lưu log vào "app.log"

    def configure(self):
        # Lấy logger gốc
        logger = logging.getLogger()
        logger.setLevel(self.log_level)  # Đảm bảo tất cả log từ DEBUG trở lên

        # Xóa bỏ các handler cũ nếu có
        if logger.hasHandlers():
            logger.handlers.clear()

        # Định nghĩa định dạng cho log
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(name)s - %(message)s'
        )

        # Handler in log ra console
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(self.log_level)
        console_handler.setFormatter(formatter)

        # Handler ghi log ra file
        file_handler = logging.FileHandler(self.log_file)
        file_handler.setLevel(logging.INFO)  # Chỉ ghi log từ INFO trở lên ra file
        file_handler.setFormatter(formatter)

        # Thêm các handler vào logger gốc
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
