/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllToolByUserId } from "../hooks/useGetAllToolByUserId";
import { useUniqueOrderIds } from "../hooks/useUniqueOrderIds";
import { useGetOrderToolByOrderId } from "../../checkout/hooks/useGetOrderToolByOrderId";
import { Button, Tag } from "antd";
import { useUpdateOrder } from "../hooks/useUpdateOrder";

const OrderManagement = () => {
    const userId = useSelector(state => state?.account?.user?.id);

    // Lấy ra các sản phẩm của chủ shop
    const { tools } = useGetAllToolByUserId(userId);

    // Lấy ra các orderId đã mua sản phẩm của chủ shop
    const uniqueOrderIds = useUniqueOrderIds(tools);

    // Hàm lấy ra các sản phẩm của 1 order
    const { getOrderToolByOrderId } = useGetOrderToolByOrderId();

    const [ordersWithTools, setOrdersWithTools] = useState({});
    const [expandedOrders, setExpandedOrders] = useState({});

    useEffect(() => {
        const fetchOrderTools = async () => {
            const result = {};

            for (const orderId of uniqueOrderIds) {
                // Lấy ra các sản phẩm của order
                const orderTools = await getOrderToolByOrderId(orderId);

                // Lọc các sản phẩm có trong danh sách sản phẩm của chủ shop
                const filteredTools = orderTools?.filter(orderTool =>
                    tools.some(tool => tool.toolId === orderTool.tool.toolId)
                );

                // Thêm danh sách tool vào đối tượng theo từng orderId
                if (filteredTools?.length > 0) {
                    result[orderId] = filteredTools;
                }
            }

            setOrdersWithTools(result);
        };

        if (uniqueOrderIds.length > 0 && tools.length > 0) {
            fetchOrderTools();
        }
    }, [uniqueOrderIds, tools, getOrderToolByOrderId]);

    // Hàm toggle để hiển thị chi tiết đơn hàng
    const handleToggleOrderDetails = (orderId) => {
        // console.log(expandedOrders);
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    // Các hàm xử lý trạng thái đơn hàng
    const getOrderStatusButton = (orderStatus) => {
        switch (orderStatus) {
            case "PENDING":
                return "Duyệt đơn hàng";
            case "CONFIRMED":
                return "Giao cho Shipper";
            case "SHIPPED":
                return "Đang giao hàng";
            case "DELIVERED":
                return "Giao hàng thành công";
            case "CANCELLED":
                return "Đơn hàng đã hủy";
            case "SUCCESS":
                return "Đơn hàng thực hiện thành công"
            case "RETURN_SUCCEEDED":
                return "Đơn hàng đã hoàn trả"
            default:
                return "Trạng thái không xác định";
        }
    };

    const getOrderStatusTitle = (orderStatus) => {
        switch (orderStatus) {
            case "PENDING":
                return "Đơn hàng đang chờ duyệt";
            case "CONFIRMED":
                return "Bạn đã xác nhận đơn hàng hãy chuẩn bị hàng và giao cho Shipper";
            case "SHIPPED":
                return "Đơn hàng đang được giao";
            case "DELIVERED":
                return "Đơn hàng đã được giao";
            case "RETURN_REQUESTED":
                return "Khách hàng yêu cầu trả hàng";
            case "CANCELLED":
                return "Đơn hàng đã bị hủy bởi khách hàng";
            case "RETURN_SUCCEEDED":
                return "Bạn đã chấp nhận yêu cầu hoàn trả"
            case "RETURN_REFUSED":
                return "Bạn đã từ chối yêu cầu hoàn trả"
            case "SUCCESS":
                return "Đơn hàng thực hiện thành công"
            default:
                return "Trạng thái không xác định";
        }
    };

    const getOrderStatusButtonClass = (orderStatus) => {
        switch (orderStatus) {
            case "PENDING":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "CONFIRMED":
                return "bg-blue-500 hover:bg-blue-600";
            case "SHIPPED":
                return "bg-orange-500 hover:bg-orange-600";
            case "DELIVERED":
                return "bg-green-500 hover:bg-green-600";
            case "RETURN_REQUESTED":
                return "bg-purple-500 hover:bg-purple-600";
            case "CANCELLED":
                return "bg-gray-400 cursor-not-allowed";
            case "SUCCESS":
                return "bg-green-500 hover:bg-green-600";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SHIPPED': return 'blue';
            case 'PENDING': return 'orange';
            case 'CONFIRMED': return 'purple';
            case 'DELIVERED': return 'green';
            case 'RETURN_REQUESTED': return 'yellow';
            case 'CANCELLED': return 'gray';
            case 'SUCCESS': return 'green'
            case 'RETURN_SUCCEEDED': return 'green';
            case 'RETURN_REFUSED': return 'orange';

            default: return 'default';
        }
    };


    const { updateOrder } = useUpdateOrder();

    const handleApproveOrder = (orderId, orderTools) => {
        const currentStatus = orderTools[0].order.status;
        let newStatus = "";
        if (currentStatus === "PENDING") {
            newStatus = "CONFIRMED";
        } else if (currentStatus === "CONFIRMED") {
            newStatus = "SHIPPED";
        } else if (currentStatus === "SHIPPED") {
            newStatus = "DELIVERED";
        }

        const orderUpdate = {
            status: newStatus,
            shippingCost: orderTools[0].order.shippingCost,
            user: {
                userId: orderTools[0].order.user.userId
            },
            paymentMethod: {
                paymentMethodId: orderTools[0].order.paymentMethod.paymentMethodId
            },
            address: {
                addressId: orderTools[0].order.address.addressId
            }
        };

        updateOrder({ orderId, orderUpdate });

        // Cập nhật trạng thái thủ công trong UI
        setOrdersWithTools(prevOrder => ({
            ...prevOrder,
            [orderId]: prevOrder[orderId].map(orderTool => ({
                ...orderTool,
                order: { ...orderTool.order, status: newStatus }
            }))
        }));
    };

    const handleAccept = (orderId, orderTools) => {
        const orderUpdate = {
            status: "RETURN_SUCCEEDED",
            shippingCost: orderTools[0].order.shippingCost,
            user: {
                userId: orderTools[0].order.user.userId
            },
            paymentMethod: {
                paymentMethodId: orderTools[0].order.paymentMethod.paymentMethodId
            },
            address: {
                addressId: orderTools[0].order.address.addressId
            }
        };

        updateOrder({ orderId, orderUpdate });

        // Cập nhật trạng thái thủ công trong UI
        setOrdersWithTools(prevOrder => ({
            ...prevOrder,
            [orderId]: prevOrder[orderId].map(orderTool => ({
                ...orderTool,
                order: { ...orderTool.order, status: "RETURN_SUCCEEDED" }
            }))
        }));
    }

    const handleRefuse = (orderId, orderTools) => {
        const orderUpdate = {
            status: "RETURN_REFUSED",
            shippingCost: orderTools[0].order.shippingCost,
            user: {
                userId: orderTools[0].order.user.userId
            },
            paymentMethod: {
                paymentMethodId: orderTools[0].order.paymentMethod.paymentMethodId
            },
            address: {
                addressId: orderTools[0].order.address.addressId
            }
        };

        updateOrder({ orderId, orderUpdate });

        // Cập nhật trạng thái thủ công trong UI
        setOrdersWithTools(prevOrder => ({
            ...prevOrder,
            [orderId]: prevOrder[orderId].map(orderTool => ({
                ...orderTool,
                order: { ...orderTool.order, status: "RETURN_REFUSED" }
            }))
        }));
    }





    // Tính tổng doanh thu chỉ cho các đơn hàng có trạng thái DELIVERED
    const totalRevenue = Object.entries(ordersWithTools).reduce((total, [orderId, orderTools]) => {
        const orderStatus = orderTools[0].order.status; // Lấy trạng thái của đơn hàng
        if (orderStatus === "DELIVERED") { // Chỉ tính nếu trạng thái là DELIVERED
            const orderTotal = orderTools.reduce((total, orderTool) => {
                const price = orderTool.tool.discountedPrice || orderTool.tool.price;
                return total + orderTool.quantity * price;
            }, 0);
            return total + orderTotal;
        }
        return total;
    }, 0);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4 text-center">Quản lý đơn hàng</h1>

            <h2 className="text-xl font-semibold mb-4 text-center">
                Tổng doanh thu: <span className="text-red-500">{totalRevenue.toLocaleString()}đ</span>
            </h2>

            {Object.entries(ordersWithTools).map(([orderId, orderTools]) => {
                const totalAmount = orderTools.reduce((total, orderTool) => {
                    const price = orderTool.tool.discountedPrice || orderTool.tool.price;
                    return total + orderTool.quantity * price;
                }, 0);

                const orderStatus = orderTools[0].order.status;

                return (
                    <div key={orderId} className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold flex justify-between items-center">
                            Đơn hàng: {orderId}
                            <Button onClick={() => handleToggleOrderDetails(orderId)} className="ml-2">
                                {expandedOrders[orderId] ? "Ẩn chi tiết" : "Xem chi tiết"}
                            </Button>
                        </h2>
                        <p><strong>Người mua:</strong> {orderTools[0].order.user.fullName}</p>
                        <p>
                            <strong>Ngày tạo:</strong> {new Date(orderTools[0].createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })}
                        </p>
                        <p className="font-semibold">
                            Tổng tiền đơn hàng: <span className="text-red-500">{totalAmount.toLocaleString()}đ</span>
                        </p>

                        {expandedOrders[orderId] && (
                            <div className="space-y-4 mt-2">
                                {orderTools.map(orderTool => (
                                    <div key={orderTool.orderToolId} className="p-4 border rounded-md shadow">
                                        <p><strong>Tên sản phẩm:</strong> {orderTool.tool.name}</p>
                                        <p>
                                            <strong>Giá: </strong>
                                            {(orderTool.tool.discountedPrice || orderTool.tool.price).toLocaleString()}đ
                                            (x{orderTool.quantity})
                                        </p>
                                        <p><strong>Tổng tiền:</strong> {(orderTool.quantity * (orderTool.tool.discountedPrice || orderTool.tool.price)).toLocaleString()}đ</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            {
                                (
                                    orderStatus === "SUCCESS" || orderStatus === "SHIPPED" ||
                                    orderStatus === "DELIVERED" || orderStatus === "CANCELLED" ||
                                    orderStatus === 'RETURN_REQUESTED' || orderStatus === 'RETURN_SUCCEEDED' ||
                                    orderStatus === 'RETURN_REFUSED'

                                )
                                ||
                                (
                                    <Button
                                        type="primary"
                                        className={"mt-2 " + getOrderStatusButtonClass(orderStatus)}
                                        onClick={() => handleApproveOrder(orderId, orderTools)}
                                    >
                                        {getOrderStatusButton(orderStatus)}
                                    </Button>
                                )
                            }
                            {
                                (orderStatus === "RETURN_REQUESTED")
                                &&
                                (
                                    <div>
                                        <Button
                                            type="primary"
                                            className={"mt-2 " + getOrderStatusButtonClass(orderStatus) + " bg-green-500 hover:bg-green-700"}
                                            onClick={() => handleAccept(orderId, orderTools)}
                                        >
                                            Chấp nhận
                                        </Button>
                                        <Button
                                            type="primary"
                                            className={"ml-2 mt-2 " + getOrderStatusButtonClass(orderStatus) + " bg-red-500 hover:bg-red-700"}
                                            onClick={() => handleRefuse(orderId, orderTools)}
                                        >
                                            Từ chối
                                        </Button>
                                    </div>

                                )
                            }

                            <Tag className="text-sm mt-2" color={getStatusColor(orderStatus)}>
                                {getOrderStatusTitle(orderStatus)}
                            </Tag>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderManagement;
