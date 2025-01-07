import axios from "./axios-customize"

export const callCreateOrderTool = async (order) => {
    const path = `/api/v1/ordertools`;
    const res = await axios.post(path, order);
    // console.log(res);
    return res?.data?.result;
}

export const callGetOrderToolByOrderId = async (orderId) => {
    const path = `/api/v1/ordertools/order/${orderId}`;
    const res = await axios.get(path);
    // console.log(res);
    return res?.data?.result;
}

export const callGetOrderToolByToolId = async (toolId) => {
    const path = `/api/v1/ordertools/tool/${toolId}`;
    const res = await axios.get(path);
    // console.log(res);
    return res?.data?.result;
}