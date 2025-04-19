import axios from "axios";

export const getSimilarProductList_CBF = async (toolId, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/cbf/product/${toolId}?top_k=${quantity}`);
    return res?.data?.recommendations;
}

export const sematicSearch = async (query, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/search?query=${query}&top_k=${quantity}`);
    return res?.data;
}

export const getRecommendationList = async (userId, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/ubcf/user/${userId}?top_k=${quantity}`);
    console.log(res.data.recommendations);
    return res?.data?.recommendations;
}