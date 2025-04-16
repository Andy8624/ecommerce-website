import axios from './axios-customize';

export const callGetUserByUserId = async (userId) => {
    const res = await axios.get(`/api/v1/users/${userId}`);
    return res?.data;
}

export const callUpdateUserRoleByUserId = async (userId, data) => {
    const res = await axios.post(`/api/v1/users/user-role/${userId}`, data);
    // console.log("res ", res?.data);
    return res?.data;
}

export const callUpdateUserProfile = async (data, userId) => {
    const res = await axios.put(`/api/v1/users/${userId}`, data);
    return res?.data;
}


export const callCheckPhoneExist = async (phone, userId) => {
    const res = await axios.get(`/api/v1/users/check-phone/${phone}/${userId}`);
    return res?.data;
}

export const callCheckShopName = async (shopName) => {
    const res = await axios.post(`/api/v1/users/check-shopname/${shopName}`);
    return res?.data;
}

export const callCreateShopInfo = async (data) => {
    const res = await axios.post(`/api/v1/users/shop`, data);
    return res?.data;
}

export const callUpdateUserPatch = async (data, userId) => {
    console.log("data ", data);
    const res = await axios.patch(`/api/v1/users/patch/${userId}`, data);
    return res?.data;
}

export const callGetShippingMethod = async (userId) => {
    const res = await axios.get(`/api/v1/users/shipping-method/${userId}`);
    return res?.data;
}

export const callUpdateShippingMethod = async (data, userId) => {
    const res = await axios.post(`/api/v1/users/shipping-method/${userId}`, data);
    return res?.data;
}

export const callUpdateTaxAndIdentityInfo = async (data, userId) => {
    const res = await axios.put(`/api/v1/users/tax-identity/${userId}`, data);
    // console.log("res ", res?.data);
    return res?.data;
}

export const callCountToolByUserId = async (userId) => {
    const path = `/api/v1/users/total-products/${userId}`;
    const res = await axios.get(path);
    return res?.data;
}

export const callCountSoldToolByUserId = async (userId) => {
    const path = `/api/v1/users/total-sold-products/${userId}`;
    const res = await axios.get(path);
    return res?.data;
}

export const callGetTotalRatedOfProductByShopId = async (userId) => {
    const path = `/api/v1/users/total-rated-products/${userId}`;
    const res = await axios.get(path);
    return res?.data;
}