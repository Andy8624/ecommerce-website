import axios from "./axios-customize"

export const callCreateOrder = async (order) => {
    const path = `/api/v1/orders`;
    const res = await axios.post(path, order);
    return res?.data;
}

export const callGetOrdersByUserId = async (userId) => {
    const path = `/api/v1/orders/user-order/${userId}`;
    const res = await axios.get(path);
    return res?.data;
}

export const callUpdateOrderByOrderId = async (orderId, orderUpdate) => {
    const path = `/api/v1/orders/${orderId}`;
    const res = await axios.put(path, orderUpdate);
    return res?.data;
}

export const callGetOrderByShopId = async (shopId) => {
    const path = `/api/v1/orders/shop-order/${shopId}?size=100&page=0&sort=createdAt,desc`;
    const res = await axios.get(path);
    return res?.data?.result;
}

export const callUpdateOrderStatus = async (orderId, status) => {
    const path = `/api/v1/orders/status/${orderId}`;
    const res = await axios.put(path, { status });
    return res?.data;
}
