import { Tag, Typography } from "antd"
import { getStatusColor, getStatusContent } from "../OrderHistoryHelper";
const { Title, Text } = Typography;

const OrderDetailContent = ({ order, totalAmount }) => {
    return (
        <div className="flex justify-between items-center mb-2">
            <Title level={5} className="text-lg">
                Mã đơn hàng: {order.orderId}
                <Text className="block text-gray-400 text-sm">
                    Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                    <Tag className="text-sm ml-2" color={getStatusColor(order.status)}>
                        {getStatusContent(order.status)}
                    </Tag>
                </Text>
            </Title>
            <div className="w-48">
                <Text className="block text-gray-700">Phí vận chuyển: {order.shippingCost.toLocaleString()}₫</Text>
                <Text className="block text-gray-700 font-bold">Tổng tiền: {totalAmount.toLocaleString()}₫</Text>
            </div>
        </div>)
}

export default OrderDetailContent