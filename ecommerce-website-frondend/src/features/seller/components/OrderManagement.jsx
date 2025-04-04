/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Tag, Card, List, Image, Descriptions, Space, Badge, Collapse, Segmented, Input } from "antd";
import { useOrder } from "../hooks/useOrder";
import { TOOL_URL } from "../../../utils/Config";
import { ShoppingOutlined, SearchOutlined } from "@ant-design/icons";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const formatVietnamDate = (dateString) => {
    const date = new Date(dateString);
    // Add 7 hours for Vietnam timezone
    date.setHours(date.getHours());
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const OrderManagement = () => {
    const userId = useSelector(state => state?.account?.user?.id);
    const { orders } = useOrder(userId);
    const { updateOrderStatus } = useUpdateOrderStatus();
    const [filter, setFilter] = useState("Tất cả");
    const [searchText, setSearchText] = useState("");

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


    const queryClient = useQueryClient();
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            updateOrderStatus({ orderId, status: newStatus });
            queryClient.invalidateQueries(["order", userId]);
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

    const filteredOrders = orders?.filter((order) => {
        const matchesSearch =
            order.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
            order.user.fullName.toLowerCase().includes(searchText.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === "Tất cả") return true;
        if (filter === "Chờ xác nhận") return order.status === 'PENDING';
        if (filter === "Đã xác nhận") return order.status === 'CONFIRMED';
        if (filter === "Đang giao") return order.status === 'SHIPPING';
        if (filter === "Hoàn thành") return order.status === 'COMPLETED';
        if (filter === "Đã hủy") return order.status === 'CANCELLED';
        return true;
    });

    return (
        <div className="space-y-4">
            <Segmented
                options={["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"]}
                value={filter}
                onChange={setFilter}
                className="rounded-lg p-2 shadow-md border border-gray-300"
            />

            <div className="flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc tên người mua..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <List
                dataSource={filteredOrders}
                renderItem={(order) => (
                    <Card key={order.orderId} className="mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-gray-500">Mã đơn hàng: </span>
                                <span className="font-medium">{order.orderId}</span>
                            </div>
                            <Badge
                                color={getStatusColor(order.status)}
                                text={order.status}
                            />
                        </div>

                        <Descriptions bordered size="small" column={2}>
                            <Descriptions.Item label="Người mua">
                                {order.user.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Ngày đặt"
                                className="w-[200px]"
                            >
                                {formatVietnamDate(order.createdAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">
                                {`${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Phương thức thanh toán"
                                className="w-[200px]"
                            >
                                {order.paymentMethod.name}
                            </Descriptions.Item>
                        </Descriptions>

                        <Collapse
                            className="mt-4 bg-white border-gray-200"
                            items={[
                                {
                                    key: '1',
                                    label: (
                                        <div className="flex items-center space-x-2">
                                            <ShoppingOutlined />
                                            <span>{`Danh sách sản phẩm (${order.orderTools.length})`}</span>
                                        </div>
                                    ),
                                    children: renderOrderProducts(order),
                                },
                            ]}
                        />

                        <div className="mt-4 flex justify-between items-center">
                            <div className="text-right">
                                <span className="text-gray-500">Phí vận chuyển: </span>
                                <span className="font-medium">{order.shippingCost.toLocaleString()}đ</span>
                            </div>
                            <Space>
                                {order.status === 'PENDING' && (
                                    <>
                                        <Button
                                            type="primary"
                                            onClick={() => handleUpdateStatus(order.orderId, 'CONFIRMED')}
                                        >
                                            Xác nhận
                                        </Button>
                                        <Button
                                            danger
                                            onClick={() => handleUpdateStatus(order.orderId, 'CANCELLED')}
                                        >
                                            Hủy
                                        </Button>
                                    </>
                                )}
                                {order.status === 'CONFIRMED' && (
                                    <Button
                                        type="primary"
                                        onClick={() => handleUpdateStatus(order.orderId, 'SHIPPING')}
                                    >
                                        Giao hàng
                                    </Button>
                                )}
                            </Space>
                        </div>
                    </Card>
                )}
            />
        </div>
    );
};

export default OrderManagement;
