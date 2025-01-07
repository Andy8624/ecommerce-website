import axios from "./axios-customize";

export const getUserCart = async (id) => {
    const path = `/api/v1/carts/user-cart/${id}`;
    const res = await axios.get(path);
    // console.log(res?.data);
    return res?.data;
}

