import axios from './axios-customize';

export const callProvinceFromGHN = async () => {
    const path = "/api/v1/ghn/provinces";
    const response = await axios.post(path);
    // console.log("response", response?.data);
    return response?.data;
}

export const callDistrictFromGHN = async (cityId) => {
    const path = `/api/v1/ghn/districts/${cityId}`;
    const response = await axios.post(path);
    return response?.data;
}

export const callWardFromGHN = async (districtId) => {
    const path = `/api/v1/ghn/wards/${districtId}`;
    const response = await axios.post(path);
    return response?.data;
}

export const callCreateStoreFromGHN = async (data) => {
    const path = "/api/v1/ghn/shops";
    const response = await axios.post(path, data);
    return response?.data;
}

export const callCalculateShippingCost = async (data) => {
    const path = "/api/v1/ghn/calculate-shipping-cost";
    const response = await axios.post(path, data);
    return response?.data;
};

export const callGetTimeDelivery = async (data) => {
    const path = "/api/v1/ghn/orders/delivery-time";
    const response = await axios.post(path, data);
    return response?.data;
}
