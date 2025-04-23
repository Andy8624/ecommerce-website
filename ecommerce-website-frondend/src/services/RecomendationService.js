import axios from "axios";
import axiosCustomize from "./axios-customize";

export const getSimilarProductList_CBF = async (toolId, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/cbf/product/${toolId}?top_k=${quantity}`);
    return res?.data?.recommendations;
}

export const getCBFRecomendationList = async (userId) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/cbf/recent-interactions/${userId}`);
    return res?.data?.recommendations;
}


export const sematicSearch = async (query, quantity) => {
    const res = await axios.get(`http://localhost:8000/python/api/v1/search?query=${query}&top_k=${quantity}`);
    return res?.data;
}

export const getRecommendationList = async (userId, quantity) => {
    if (userId === '') userId = 1;
    const res = await axios.get(`http://localhost:8000/python/api/v1/ubcf/user/${userId}?top_k=${quantity}`);
    console.log(res.data.recommendations);
    return res?.data?.recommendations;
}

export const saveInteraction = async (userId, toolId, interactionType) => {
    try {
        // Kiểm tra các tham số đầu vào
        if (!userId || !toolId || !interactionType) {
            console.error('Missing required parameters for saving interaction');
            return null;
        }

        // Kiểm tra interactionType phải là một trong các giá trị hợp lệ
        const validTypes = ['VIEW', 'ADD_CART', 'PURCHASE'];
        if (!validTypes.includes(interactionType)) {
            console.error('Invalid interaction type:', interactionType);
            return null;
        }

        // Gọi API để lưu tương tác
        const res = await axiosCustomize.post(
            `/api/v1/recommendation/cf-data/interaction`,
            null, // không có body data
            {
                params: {
                    userId,
                    toolId,
                    interactionType
                }
            }
        );

        console.log(`Saved interaction: user=${userId}, tool=${toolId}, type=${interactionType}`);
        return res?.data;
    } catch (error) {
        console.error('Error saving interaction:', error);
        return null;
    }
}
