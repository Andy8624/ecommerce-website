import axios from './axios-customize';

export const callGetProductReviewOfUser = async (buyerId, productId) => {
    const path = `/api/v1/product-reviews/${buyerId}/${productId}`;
    const res = await axios.get(path);
    return res?.data;
}

export const callGetProductReview = async (productId) => {
    const path = `/api/v1/product-reviews/tools/${productId}`;
    const res = await axios.get(path);
    return res?.data;
}

export const callCreateProductReview = async (data) => {
    // Lay ten cac file image va ket noi voi nhau bang dau phay
    const imageList = data?.imageUrls?.map((image) => image?.fileName).join(',');
    const formatdata = {
        buyerId: data.buyerId,
        toolId: data.toolId,
        rating: data.rating,
        buyerReview: data.comment,
        imageUrls: imageList,
        category_name_1: data.category_name_1,
        category_name_2: data.category_name_2,
        category_detail_name_1: data.category_detail_name_1,
        category_detail_name_2: data.category_detail_name_2,
        quantity: data.quantity,
        orderId: data.orderId,
    }
    const path = `/api/v1/product-reviews`;
    const res = await axios.post(path, formatdata);
    return res?.data;
}
