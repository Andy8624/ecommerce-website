import { useSelector } from 'react-redux';
import { useGetOrderByUserId } from '../hooks/orders/useGetOrderByUserId';
import { Badge, Card, Collapse, List, Image, Descriptions, Spin, Empty, Button, Space } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { TOOL_URL } from '../../../utils/Config';
import { useUpdateOrderStatus } from '../../seller/hooks/useUpdateOrderStatus';

const formatVietnamDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'yellow';
        case 'CONFIRMED':
            return 'cyan';
        case 'SHIPPING':
            return 'purple';
        case 'COMPLETED':
            return 'green';
        case 'CANCELLED':
            return 'red';
        default:
            return 'default';
    }
};

const OrderHistory = () => {
    const userId = useSelector(state => state?.account?.user?.id);
    const { orders, isLoading } = useGetOrderByUserId(userId);
    const { updateOrderStatus } = useUpdateOrderStatus();

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ orderId, status: newStatus });
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const renderOrderProducts = (order) => (
        <List
            className="mt-4"
            dataSource={order.orderTools}
            renderItem={(item) => (
                <List.Item>
                    <div className="flex items-center w-full">
                        <Image
                            src={`${TOOL_URL}${item.tool.imageUrl}`}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover rounded-md"
                        />
                        <div className="ml-4 flex-grow">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-gray-500">
                                {item.category_name_1 && `${item.category_name_1}: ${item.category_detail_name_1}`}
                                {item.category_name_2 && `, ${item.category_name_2}: ${item.category_detail_name_2}`}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-red-500 font-medium">
                                    {item.price.toLocaleString()}đ
                                </span>
                                <span>x{item.quantity}</span>
                            </div>
                        </div>
                    </div>
                </List.Item>
            )}
        />
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
    }

    if (!orders?.length) {
        return <Empty className='py-[180px]' description="Bạn chưa có đơn hàng nào" />;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>
            <List
                dataSource={orders}
                renderItem={(order) => (
                    <Card key={order.orderId} className="mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-gray-500">Mã đơn hàng: </span>
                                <span className="font-medium">{order.orderId}</span>
                            </div>
                            <Badge color={getStatusColor(order.status)} text={order.status} />
                        </div>

                        <Descriptions bordered size="small" column={2} className="mb-4">
                            <Descriptions.Item label="Cửa hàng">
                                {order?.orderTools[0]?.tool?.user?.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt"
                                className="w-[200px]">
                                {formatVietnamDate(order.createdAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ giao hàng">
                                {`${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán"
                                className="w-[200px]">
                                {order.paymentMethod.name}
                            </Descriptions.Item>
                        </Descriptions>

                        <Collapse
                            className="bg-white border-gray-200"
                            items={[{
                                key: '1',
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <ShoppingOutlined />
                                        <span>{`Danh sách sản phẩm (${order.orderTools.length})`}</span>
                                    </div>
                                ),
                                children: renderOrderProducts(order),
                            }]}
                        />

                        <div className="mt-4 flex justify-between items-center">
                            <Space>
                                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                    <Button
                                        danger
                                        onClick={() => handleUpdateStatus(order.orderId, 'CANCELLED')}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                )}
                                {order.status === 'SHIPPING' && (
                                    <Button
                                        type="primary"
                                        onClick={() => handleUpdateStatus(order.orderId, 'COMPLETED')}
                                    >
                                        Đã nhận được hàng
                                    </Button>
                                )}
                            </Space>

                            <div className="text-right">
                                <span className="text-gray-500 mr-2">Phí vận chuyển:</span>
                                <span className="font-medium">{order.shippingCost.toLocaleString()}đ</span>
                                <span className="text-gray-500 mx-2">|</span>
                                <span className="text-gray-500 mr-2">Tổng tiền:</span>
                                <span className="text-xl font-bold text-red-500">
                                    {(order.orderTools.reduce((total, item) => total + (item.price * item.quantity), 0) + order.shippingCost).toLocaleString()}đ
                                </span>
                            </div>
                        </div>
                    </Card>
                )}
            />
        </div>
    );
};

export default OrderHistory;
