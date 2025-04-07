import axios from "axios";

export const getSimilarProductList_CBF = async (toolId, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/cbf/product/${toolId}?top_k=${quantity}`);
    console.log("call");
    return res?.data?.recommendations;
}