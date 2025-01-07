import { Button, Card, List, Tag } from 'antd';
import OrderDetailContent from './OrderDetailContent';
import OrderDetailCollapse from './OrderDetailCollapse';
import { calculateTotalAmount } from '../OrderHistoryHelper';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistoryList = ({ filteredOrders, orderItemsMap, handleCancelOrder, handleReceiveOrder, handleReturnRequest }) => {
    const totalAmountsMap = useMemo(() => {
        const amounts = {};
        filteredOrders.forEach(order => {
            const orderItems = orderItemsMap[order.orderId] || [];
            amounts[order.orderId] = calculateTotalAmount(orderItems) + (order.shippingCost || 0);
        });
        return amounts;
    }, [filteredOrders, orderItemsMap]);


    const navigate = useNavigate();
    return (
        <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={filteredOrders}
            renderItem={(order) => {
                const orderItems = orderItemsMap[order.orderId] || [];
                const totalAmount = totalAmountsMap[order.orderId];

                return (
                    <Card
                        className="order-card shadow-md rounded-lg p-3 mb-4"
                        key={order.orderId}
                        hoverable
                    >
                        <OrderDetailContent order={order} totalAmount={totalAmount} />

                        {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                            <Button
                                type="primary"
                                danger
                                className="mt-2"
                                onClick={() => handleCancelOrder(order.orderId, order)}
                            >
                                Hủy đơn hàng
                            </Button>
                        )}
                        {order.status === 'DELIVERED' && (
                            <>
                                <Button
                                    type="primary"
                                    className="mt-2 bg-green-500 border-none hover:bg-green-600"
                                    onClick={() => handleReceiveOrder(order.orderId, order)}
                                >
                                    Đã nhận được hàng
                                </Button>
                                <Button
                                    type="default"
                                    className="ml-2 mt-2 border-red-500 text-red-500"
                                    onClick={() => handleReturnRequest(order.orderId, order)}
                                >
                                    Yêu cầu hoàn trả
                                </Button>
                            </>
                        )}

                        {orderItems[0]?.order.type !== "COURSE" ? (
                            <OrderDetailCollapse orderItems={orderItems} />
                        ) : (
                            <>
                                <Tag color="blue"
                                    className="text-sm cursor-pointer hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all duration-300"
                                    onClick={() => navigate("/course-detail", { state: { courseHistory: orderItems[0]?.course } })
                                    }
                                >
                                    Xem ngay
                                </Tag>
                            </>
                        )
                        }
                    </Card >
                );
            }}
        />
    );
}

export default OrderHistoryList;
