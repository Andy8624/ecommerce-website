import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { formatDurationToString } from "../hooks/formatDuration";

const CourseOverlay = ({ navigateToDetailPage, updatedAt, publishedAt, totalVideos, duration, onAddToCartClick, name, description }) => {
    const time = formatDurationToString(duration);
    const publicDate = new Date(updatedAt || publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })


    return (
        <div className="z-50 duration-100 bg-slate-100 hover:scale-105 absolute inset-0 bg-white flex flex-col p-4 items-center justify-between text-black rounded-lg shadow-lg shadow-xl shadow-2xl"
            style={{
                transform: "translateX(102%)",
                background: "linear-gradient(135deg, #f0f4f8, #dbeafe, #b0c6ff)"
            }}
        >
            <div className="mb-6 space-y-2">
                <p
                    className="text-base font-bold cursor-pointer transition-transform duration-200 hover:scale-105 hover:text-blue-500"
                    onClick={() => navigateToDetailPage()}
                >
                    {name}
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Cập nhật: </span>{publicDate}
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Số video: </span>{totalVideos}
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Tổng số: </span>{time}
                </p>

                {description && (
                    <p className="text-sm mt-2 text-gray-600">
                        <span className="font-semibold">Mô tả: </span>
                        {description.length > 150 ? `${description.substring(0, 80)}...` : description}
                    </p>
                )}
            </div>
            <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={onAddToCartClick}
                size="small"
                className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold shadow-md shadow-teal-500/50"
            >
                Thêm vào giỏ hàng
            </Button>
        </div>
    );
};

export default CourseOverlay;
