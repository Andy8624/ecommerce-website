import axios from './axios-customize';

export const callGetProductReview = async (productId) => {
    const path = `/api/v1/product-reviews/tools/${productId}`;
    const res = await axios.get(path);
    console.log('res', res);
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
    }
    const path = `/api/v1/product-reviews`;
    const res = await axios.post(path, formatdata);
    return res?.data;
}
