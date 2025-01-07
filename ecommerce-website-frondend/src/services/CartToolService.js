import axios from "./axios-customize";

export const getToolOfCart = async (id) => {
    const path = `/api/v1/cart-tools/tool-of-cart/${id}`;
    const res = await axios.get(path);
    // console.log(res);
    return res?.data?.result;
}

export const getCartTool = async (id) => {
    const path = `/api/v1/cart-tools/${id}`;
    const res = await axios.get(path);
    return res?.data;
}

export const createCartTool = async (data) => {
    const path = `/api/v1/cart-tools`;
    const res = await axios.post(path, data);
    return res?.data;
}

export const checkExistCartTool = async (data) => {
    const path = `/api/v1/cart-tools/isExist`;
    const res = await axios.post(path, data);
    return res?.data;
}

export const updateCartTool = async (data, cartToolId) => {
    const path = `/api/v1/cart-tools/${cartToolId}`;
    const res = await axios.put(path, data);
    // console.log(res);
    return res?.data;
}

export const callDeleteCartTool = async (cartToolId) => {
    const path = `/api/v1/cart-tools/${cartToolId}`;
    const res = await axios.delete(path);
    return res?.data;
}