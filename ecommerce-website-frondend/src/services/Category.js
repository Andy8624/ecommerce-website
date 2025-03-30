import axios from "./axios-customize";

export const getCategoryByCategoryDetailId = async (id) => {
    const path = `/api/v1/categories/category-detail/${id}`;
    const res = await axios.get(path);
    return res?.data;
}

