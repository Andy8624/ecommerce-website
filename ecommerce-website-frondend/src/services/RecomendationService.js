import axios from "axios";

export const getSimilarProductList_CBF = async (toolId, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/cbf/product/${toolId}?top_k=${quantity}`);
    return res?.data?.recommendations;
}

export const sematicSearch = async (query, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/search?query=${query}&top_k=${quantity}`);
    return res?.data;
}